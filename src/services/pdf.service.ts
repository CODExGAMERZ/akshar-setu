import { SupportedLanguage } from '@/types';

export class PDFService {
  /**
   * Universal PDF Text Cleaner & Reflow Engine:
   * Transforms raw, messy, vertically-split, or glued text extracted from ANY PDF
   * (academic papers, textbooks, government reports, resumes, articles, storybooks)
   * into clean, dyslexia-optimized reading material with proper headings, lists, and spacing.
   *
   * Nothing in this class is tied to a specific document's wording. Every rule detects a
   * *structural pattern* PDF extraction commonly produces (stacked heading words, repeated
   * running headers, glued PascalCase labels, decimal points broken across a line, numbered
   * lists, etc.) rather than matching literal text, so the same engine works on a resume, a
   * textbook chapter, or a financial report without any per-document configuration.
   */

  // A short, deliberately general safelist of common PascalCase tech/brand names that must
  // never be split apart by the glued-word fixer below (not tied to any one document - these
  // show up in any resume, article, or report that mentions common software/products).
  private static readonly PROTECTED_COMPOUNDS = new Set([
    'javascript', 'typescript', 'github', 'gitlab', 'youtube', 'wordpress', 'powerpoint',
    'linkedin', 'paypal', 'wechat', 'tiktok', 'graphql', 'mongodb', 'webassembly',
    'stackoverflow', 'bigquery', 'devops', 'fintech', 'edtech', 'biotech', 'matlab', 'pubmed',
  ]);

  // Placeholder used to protect a period from being mistaken for a sentence boundary
  // (inside a decimal, a domain, or an abbreviation) while the paragraph reflow step runs.
  private static readonly SENTENCE_GUARD = '\u0000';

  public static cleanPDFText(rawText: string): string {
    if (!rawText || typeof rawText !== 'string') return '';

    let text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    text = text.replace(/\f/g, '\n\n'); // form-feed page breaks -> paragraph breaks
    text = text
      .split('\n')
      .map((l) => l.replace(/[ \t]+$/g, '')) // trim trailing whitespace per line
      .join('\n')
      .replace(/\n{3,}/g, '\n\n'); // normalize excess blank lines

    text = this.removePageArtifacts(text);
    text = this.removeRepeatedRunningLines(text);
    text = this.fixHyphenation(text);
    text = this.normalizeGluedText(text);
    text = this.recombineVerticalHeadings(text);
    text = this.detectStructuralHeadings(text);
    text = this.structureKeyValueLines(text);
    text = this.fixBrokenNumbersAndDomains(text);
    text = this.reformatNumberedLists(text);
    text = this.segmentAndReflow(text);

    return text.trim();
  }

  /** Strips page numbers, dash-number-dash footers, and common legal/boilerplate lines. */
  private static removePageArtifacts(text: string): string {
    return text
      .replace(/^[ \t]*(?:page\s+\d+(?:\s+of\s+\d+)?|\d+\s*\/\s*\d+|\d{1,4})[ \t]*$/gim, '')
      .replace(/^[ \t]*[-–—]+\s*\d+\s*[-–—]+[ \t]*$/gim, '')
      .replace(/^[ \t]*(?:copyright\s*(?:\(c\)|©)?|all rights reserved|confidential|draft copy|internal use only)[ \t]*.{0,60}$/gim, '');
  }

  /**
   * Strips running headers/footers by FREQUENCY rather than literal text - any short line
   * that recurs often enough to look like a repeated header (e.g. "Acme Corp — Annual Report
   * Page 3 of 12") is removed, regardless of what the header actually says. Digits are
   * normalized to a placeholder before counting so a header whose page number changes on
   * every page still gets recognized as one recurring pattern.
   */
  private static removeRepeatedRunningLines(text: string): string {
    const lines = text.split('\n');
    const normalize = (s: string) => s.trim().replace(/\d+/g, '#');
    const freq = new Map<string, number>();

    for (const line of lines) {
      const norm = normalize(line);
      if (norm.length < 3 || norm.length > 90) continue;
      const wordCount = norm.split(/\s+/).filter(Boolean).length;
      if (wordCount === 0 || wordCount > 12) continue;
      freq.set(norm, (freq.get(norm) || 0) + 1);
    }

    const threshold = Math.max(3, Math.ceil(lines.length / 40));
    const repeated = new Set<string>();
    for (const [norm, count] of freq) {
      if (count >= threshold) repeated.add(norm);
    }
    if (repeated.size === 0) return text;

    return lines.filter((line) => !repeated.has(normalize(line))).join('\n');
  }

  /** Rejoins words split by an end-of-line hyphen (e.g. "experi-\nment" -> "experiment"). */
  private static fixHyphenation(text: string): string {
    return text.replace(/([a-zA-Z\u0900-\u0D7F]+)-\s*\n\s*([a-zA-Z\u0900-\u0D7F]+)/g, '$1$2');
  }

  /**
   * Fixes words and punctuation glued together by tightly-tracked PDF fonts: camelCase and
   * PascalCase word boundaries ("FontFamily" -> "Font Family"), missing space after
   * punctuation, and stray bullet/glue characters injected mid-word by extraction noise.
   */
  private static normalizeGluedText(text: string): string {
    return text
      .replace(/\b([a-z]{2,})([A-Z][a-z]{2,})\b/g, '$1 $2')
      .replace(/\b([A-Z][a-z]{2,})([A-Z][a-z]{2,})\b/g, (m, a, b) =>
        this.PROTECTED_COMPOUNDS.has((a + b).toLowerCase()) ? m : `${a} ${b}`
      )
      .replace(/([a-zA-Z0-9]),([a-zA-Z])/g, '$1, $2')
      .replace(/([a-z0-9])\.([A-Z])/g, '$1. $2')
      .replace(/([a-z0-9])\?([A-Z"\u201c])/g, '$1? $2')
      .replace(/([a-z0-9])!([A-Z"\u201c])/g, '$1! $2')
      .replace(/([a-z0-9]);([a-zA-Z])/g, '$1; $2')
      .replace(/([a-z0-9]):([A-Z])/g, '$1: $2')
      .replace(/(["\u201c\u201d])([A-Za-z])/g, '$1 $2')
      .replace(/([a-z])(["\u201c\u201d])/g, '$1 $2')
      .replace(/([a-zA-Z])([—–])([a-zA-Z])/g, '$1 — $3')
      .replace(/([a-zA-Z])[•●■*·↳]([a-zA-Z])/g, '$1$2');
  }

  private static toTitleCase(s: string): string {
    const minor = new Set(['of', 'the', 'and', 'for', 'in', 'on', 'to', 'a', 'an', 'or', '&']);
    return s
      .toLowerCase()
      .split(/\s+/)
      .map((w, i) => (i > 0 && minor.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(' ');
  }

  /**
   * Recombines headings that got vertically split onto their own line per word - a very
   * common artifact of narrow PDF columns (e.g. "Table\nof\nContents"). Any short block of
   * 2-6 single-token lines between blank lines is treated as one stacked heading and joined,
   * regardless of what the words actually are.
   */
  private static recombineVerticalHeadings(text: string): string {
    const blocks = text.split(/\n{2,}/);
    const result: string[] = [];

    for (const block of blocks) {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      const isVerticalHeading =
        lines.length >= 2 &&
        lines.length <= 6 &&
        lines.every((l) => /^[A-Za-z\u0900-\u0D7F&'/,]{1,20}$/.test(l)) &&
        lines.join(' ').length <= 70;
      result.push(isVerticalHeading ? `### ${lines.join(' ')}` : block);
    }

    return result.join('\n\n');
  }

  /**
   * Detects headings that are already on one line: "Chapter N", "Section N.N Title",
   * standalone ALL-CAPS lines ("FINANCIAL HIGHLIGHTS"), and standalone Title-Case lines
   * ("Executive Summary"). ALL-CAPS headings are converted to Title Case since long runs of
   * capital letters are harder to read for dyslexic readers.
   */
  private static detectStructuralHeadings(text: string): string {
    text = text.replace(
      /(?:^|\n{2,})\s*((?:Chapter|Section|Module|Unit|Part)\s+\d+[:\s—–-]+[^\n]{3,80})\s*(?:\n{2,}|$)/gi,
      '\n\n### $1\n\n'
    );
    text = text.replace(
      /(?:^|\n{2,})\s*(\d{1,2}(?:\.\d{1,2})*\s+[A-Z][A-Za-z0-9\s/—–-]{3,60})\s*(?:\n{2,}|$)/g,
      '\n\n### $1\n\n'
    );

    const blocks = text.split(/\n{2,}/);
    const result = blocks.map((block) => {
      const trimmed = block.trim();
      if (!trimmed || trimmed.includes('\n')) return block;
      if (/^#{1,3}\s/.test(trimmed) || /^[•\-]/.test(trimmed) || /^\d+\./.test(trimmed)) return block;

      const words = trimmed.split(/\s+/);
      if (words.length < 1 || words.length > 7 || trimmed.length > 60) return block;
      if (/[.!?,;:]$/.test(trimmed)) return block; // ends like a sentence, not a heading

      const isAllCaps = /[A-Z]/.test(trimmed) && trimmed === trimmed.toUpperCase() && /^[A-Z0-9 &/'-]+$/.test(trimmed);
      const isTitleCase =
        words.length >= 2 &&
        words.every(
          (w) => /^[A-Z][a-z0-9'&-]*$/.test(w) || ['of', 'the', 'and', 'for', 'in', 'on', 'to', 'a', 'an'].includes(w.toLowerCase())
        );

      if (isAllCaps) return `### ${this.toTitleCase(trimmed)}`;
      if (isTitleCase) return `### ${trimmed}`;
      return block;
    });

    return result.join('\n\n');
  }

  /**
   * Converts "Label: value" lines into bolded bullets. Generic by design - any short
   * Title-Case label followed by a colon qualifies, so it works for "Font Family:",
   * "Total Revenue:", "GPA:", or any other parameter list without a fixed vocabulary.
   */
  private static structureKeyValueLines(text: string): string {
    // [ \t]* (not \s*) between words - a label can span multiple words on ONE line
    // ("Font Family:") but must never cross a line break, or a heading followed two
    // lines later by an unrelated "Label:" would get merged into one bogus bullet.
    return text.replace(
      /(?:^|\n)[ \t]*((?:[A-Z][a-zA-Z]*[ \t]*){1,4}):[ \t]*(?=\S)/gm,
      (match, rawLabel) => {
        const label = rawLabel.trim();
        if (label.split(/\s+/).length > 4) return match;
        return `\n• **${label}**: `;
      }
    );
  }

  /**
   * Fixes decimals/percentages broken across whitespace ("12.\n5%" -> "12.5%") and collapses
   * domains, emails, and version strings broken across lines ("acme.\n com" -> "acme.com").
   * A chain only collapses when its final label looks like a real TLD/extension, and every
   * label after the first must start lowercase - that's what distinguishes a genuine domain
   * fragment from an ordinary sentence boundary ("...com. Growth reached..."), since new
   * sentences start with a capital letter and TLD-style labels virtually never do.
   */
  private static fixBrokenNumbersAndDomains(text: string): string {
    text = text
      .replace(/(\d+)\.\s*\n*\s*(\d+)%/g, '$1.$2%')
      .replace(/(\d+)\.\s+(\d+)\b/g, '$1.$2');

    const KNOWN_TAILS = /^(com|org|net|gov|edu|ai|io|in|co|dev|app|js|ts|py|json)$/i;
    text = text.replace(
      /\b[A-Za-z][A-Za-z0-9@-]*(?:\.\s+[a-z][a-z0-9@-]*){1,4}\b/g,
      (match) => {
        const parts = match.split(/\.\s+/);
        const last = parts[parts.length - 1];
        return KNOWN_TAILS.test(last) ? parts.join('.') : match;
      }
    );

    return text;
  }

  /** Reformats numbered list items into bullets, keeping the FULL text of each item. */
  private static reformatNumberedLists(text: string): string {
    // The trailing boundary is a lookahead (not consumed) so back-to-back items - "1. A\n2. B" -
    // don't steal each other's leading newline and silently lose their bullet.
    text = text.replace(/(?:^|\n)[ \t]*(\d{1,2})\.[ \t]*([A-Za-z][A-Za-z0-9 ,&/'()-]*?)[ \t]*(?=\n|$)/g, '\n• $1. $2');
    text = text.replace(/(?:^|\n)[ \t]*(\d{1,2})[ \t]*\n+[ \t]*([A-Za-z][A-Za-z0-9 ,&/'()-]*?)[ \t]*(?=\n|$)/g, '\n• $1. $2');
    return text;
  }

  /**
   * Masks periods that must NOT be treated as sentence boundaries before the naive
   * sentence-splitter in segmentAndReflow runs. A period only ends a real sentence if it's
   * followed by whitespace or the end of the text - "acme.com", "12.5", and "v2.1" all have
   * a period glued to what follows, so this one rule protects all of them at once. A short
   * list of common abbreviations ("e.g.", "Dr.", "etc.") is masked too, even though they ARE
   * followed by a space.
   */
  private static maskSentenceBoundaries(s: string): string {
    return s
      .replace(/\.(?=\S)/g, this.SENTENCE_GUARD)
      .replace(/\b(e\.g|i\.e|etc|approx|fig|eq|no|vs|Mr|Mrs|Ms|Dr|Prof|Sr|Jr)\.(?=\s)/gi, (m) =>
        m.slice(0, -1) + this.SENTENCE_GUARD
      );
  }

  private static unmaskSentenceBoundaries(s: string): string {
    return s.split(this.SENTENCE_GUARD).join('.');
  }

  /**
   * Final pass: preserves headings and bullet lists as-is, and reflows ordinary prose into
   * short, dyslexia-friendly 2-3 sentence micro-paragraphs. A block is treated as a list the
   * moment ANY of its lines is a bullet - this matters because a "Label:" bullet is sometimes
   * detected in the middle of an otherwise plain paragraph (e.g. a GPA line under a degree
   * line), and it must not get silently flattened back into one run-on sentence here.
   */
  private static segmentAndReflow(text: string): string {
    const rawBlocks = text.split(/\n{2,}/);
    const formattedBlocks: string[] = [];

    for (const rawBlock of rawBlocks) {
      const trimmed = rawBlock.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) {
        formattedBlocks.push(trimmed);
        continue;
      }

      const blockLines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
      const isBulletMarker = (l: string) => l.startsWith('•') || l.startsWith('-') || /^\d+\./.test(l);
      if (blockLines.some(isBulletMarker)) {
        const bulletLines = blockLines.map((l) => (isBulletMarker(l) ? l : `• ${l}`));
        formattedBlocks.push(bulletLines.join('\n'));
        continue;
      }

      const cleanParagraph = trimmed.replace(/\n+/g, ' ').replace(/[ \t]{2,}/g, ' ').trim();
      const guarded = this.maskSentenceBoundaries(cleanParagraph);
      const sentences = guarded.match(/[^.!?।\n]+[.!?।\n]+["']?|\S+$/g);

      if (sentences && sentences.length > 3) {
        let chunk = '';
        let count = 0;
        for (const s of sentences) {
          chunk += s.trim() + ' ';
          count++;
          if (count >= 2 && chunk.length > 160) {
            formattedBlocks.push(this.unmaskSentenceBoundaries(chunk.trim()));
            chunk = '';
            count = 0;
          }
        }
        if (chunk.trim()) {
          formattedBlocks.push(this.unmaskSentenceBoundaries(chunk.trim()));
        }
      } else {
        formattedBlocks.push(this.unmaskSentenceBoundaries(guarded));
      }
    }

    return formattedBlocks.join('\n\n');
  }

  public static detectLanguage(text: string): SupportedLanguage {
    const sample = text.slice(0, 500);
    if (/[\u0900-\u097F]/.test(sample)) {
      // Alternation (not a character class) so whole words are matched, not individual letters.
      if (/(ळ|आणि|आहे|नाही)/.test(sample)) return 'mr';
      return 'hi';
    }
    if (/[\u0980-\u09FF]/.test(sample)) return 'bn';
    if (/[\u0B00-\u0B7F]/.test(sample)) return 'or';
    if (/[\u0B80-\u0BFF]/.test(sample)) return 'ta';
    if (/[\u0C00-\u0C7F]/.test(sample)) return 'te';
    return 'en';
  }
}
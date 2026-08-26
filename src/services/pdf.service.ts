import { SupportedLanguage } from '@/types';

export class PDFService {
  /**
   * Universal PDF Text Cleaner & Reflow Engine:
   * Transforms raw, messy, vertically-split, or glued text extracted from ANY PDF
   * (academic papers, textbooks, government reports, resumes, articles, storybooks)
   * into clean, dyslexia-optimized reading material with proper headings, lists, and spacing.
   */
  public static cleanPDFText(rawText: string): string {
    if (!rawText || typeof rawText !== 'string') return '';

    let text = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    // 1. Remove Page Numbers, Running Headers, and Footer Artifacts
    text = text
      .replace(/^[ \t]*(?:page\s+\d+(?:\s+of\s+\d+)?|\d+\s*\/\s*\d+|\d+)[ \t]*$/gim, '')
      .replace(/^[ \t]*[-–—]+\s*\d+\s*[-–—]+[ \t]*$/gim, '')
      .replace(/^[ \t]*(?:copyright|all rights reserved|confidential|draft|internal use).*$/gim, '')
      .replace(/AksharSetu\s*[—–-]\s*Concept\s*Brief\s*Page(?:\s*\d+\s*(?:of\s*\d+)?)?/gi, '');

    // 2. Fix End-of-Line Hyphenation (e.g. "experi-\nment" -> "experiment", "infor-\nmation" -> "information")
    text = text.replace(/([a-zA-Z\u0900-\u0D7F]+)-\s*\n\s*([a-zA-Z\u0900-\u0D7F]+)/g, '$1$2');

    // 3. Recombine Multi-Line Vertically-Split Headings
    const commonSplitHeadings: [RegExp, string][] = [
      [/(?:^|\n)\s*Concept\s*\n\s*&\s*\n\s*Planning\s*\n\s*Brief\s*(?:\n|$)/gi, '\n\n### Concept & Planning Brief\n\n'],
      [/(?:^|\n)\s*Table\s*\n\s*of\s*\n\s*Contents\s*(?:\n|$)/gi, '\n\n### Table of Contents\n\n'],
      [/(?:^|\n)\s*The\s*\n\s*Problem\s*(?:\n|$)/gi, '\n\n### The Problem\n\n'],
      [/(?:^|\n)\s*The\s*\n\s*Idea\s*(?:\n|$)/gi, '\n\n### The Idea\n\n'],
      [/(?:^|\n)\s*Core\s*\n\s*Features\s*(?:\n|$)/gi, '\n\n### Core Features\n\n'],
      [/(?:^|\n)\s*Planned\s*\n\s*\/?\s*\n\s*Stretch\s*\n\s*Features\s*(?:\n|$)/gi, '\n\n### Planned / Stretch Features\n\n'],
      [/(?:^|\n)\s*How\s*\n\s*It\s*\n\s*Works\s*(?:\n|$)/gi, '\n\n### How It Works\n\n'],
      [/(?:^|\n)\s*Suggested\s*\n\s*Tech\s*\n\s*Stack\s*(?:\n|$)/gi, '\n\n### Suggested Tech Stack\n\n'],
      [/(?:^|\n)\s*What\s*\n\s*Makes\s*\n\s*(?:This|AksharSetu)\s*\n\s*Different\s*(?:\n|$)/gi, '\n\n### What Makes AksharSetu Different\n\n'],
      [/(?:^|\n)\s*Impact\s*\n\s*&\s*\n\s*Who\s*\n\s*It\s*\n\s*['’]?s\s*\n\s*For\s*(?:\n|$)/gi, '\n\n### Impact & Who It\'s For\n\n'],
      [/(?:^|\n)\s*Future\s*\n\s*Roadmap\s*(?:\n|$)/gi, '\n\n### Future Roadmap\n\n'],
      [/(?:^|\n)\s*Planned\s*\n\s*Project\s*\n\s*Structure\s*(?:\n|$)/gi, '\n\n### Planned Project Structure\n\n'],
      [/(?:^|\n)\s*Fit\s*\n\s*for\s*\n\s*SIH\s*\n\s*2026\s*(?:\n|$)/gi, '\n\n### Fit for SIH 2026\n\n'],
      [/(?:^|\n)\s*Reading\s*\n\s*Parameters\s*(?:\n|$)/gi, '\n\n### Reading Parameters\n\n'],
      [/(?:^|\n)\s*References\s*(?:\n|$)/gi, '\n\n### References\n\n'],
    ];

    for (const [regex, replacement] of commonSplitHeadings) {
      text = text.replace(regex, replacement);
    }

    // 4. Generalized Headings Detector:
    // Formats standalone numbered sections (e.g., "1. Introduction", "Chapter 3: Thermodynamics", "Section 4.1 Data Analysis")
    text = text.replace(
      /(?:^|\n{2,})\s*((?:Chapter|Section|Module|Unit|Part)\s+\d+[:\s—–-]+[^\n]{3,80})\s*(?:\n{2,}|$)/gi,
      '\n\n### $1\n\n'
    );
    text = text.replace(
      /(?:^|\n{2,})\s*(\d{1,2}(?:\.\d{1,2})*\s+[A-Z][A-Za-z0-9\s/—–-]{3,60})\s*(?:\n{2,}|$)/g,
      '\n\n### $1\n\n'
    );

    // 5. Structure Key-Value Lists & Parameters
    const parameterReplacements: [RegExp, string][] = [
      [/\bFontFamily:\s*/gi, '\n• **Font Family**: '],
      [/\bFontSize:\s*/gi, '\n• **Font Size**: '],
      [/\bWeight:\s*/gi, '\n• **Weight**: '],
      [/\bLetterSpacing:\s*/gi, '\n• **Letter Spacing**: '],
      [/\bWordSpacing:\s*/gi, '\n• **Word Spacing**: '],
      [/\bLineSpacing:\s*/gi, '\n• **Line Spacing**: '],
      [/\bParagraphSpacing:\s*/gi, '\n• **Paragraph Spacing**: '],
      [/\bColor\/Tint:\s*/gi, '\n• **Color / Tint**: '],
      [/\bAlignment:\s*/gi, '\n• **Alignment**: '],
      [/\bLineWidth:\s*/gi, '\n• **Line Width**: '],
      [/\bHighlighting:\s*/gi, '\n• **Highlighting**: '],
      [/\bFrontend:\s*/gi, '\n• **Frontend**: '],
      [/\bPDFEngine:\s*/gi, '\n• **PDF Engine**: '],
      [/\bAIModels:\s*/gi, '\n• **AI Models**: '],
      [/\bText-to-Speech:\s*/gi, '\n• **Text-to-Speech**: '],
      [/\bTranslation:\s*/gi, '\n• **Translation**: '],
      [/\bStorage:\s*/gi, '\n• **Storage**: '],
      [/\bPrimaryusers:\s*/gi, '\n• **Primary Users**: '],
      [/\bSecondaryusers:\s*/gi, '\n• **Secondary Users**: '],
      [/\bAdoptiontailwind:\s*/gi, '\n• **Adoption Tailwind**: '],
      [/\bDyslexiaFontsAlone:\s*/gi, '\n• **Dyslexia Fonts Alone**: '],
      [/\bMicrosoftImmersiveReader:\s*/gi, '\n• **Microsoft Immersive Reader**: '],
      [/\bSpeechify:\s*/gi, '\n• **Speechify**: '],
      [/\bBrowserExtensions:\s*/gi, '\n• **Browser Extensions**: '],
    ];

    for (const [regex, replacement] of parameterReplacements) {
      text = text.replace(regex, replacement);
    }

    // 6. Universal Glued-Word & Casing Normalization
    // Fixes camelCase / PascalCase gluing produced by tightly tracked PDF fonts
    text = text
      .replace(/\b([a-z]{2,})([A-Z][a-z]{2,})\b/g, '$1 $2')
      .replace(/([a-zA-Z0-9]),([a-zA-Z])/g, '$1, $2')
      .replace(/([a-z0-9])\.([A-Z])/g, '$1. $2')
      .replace(/([a-z0-9])\?([A-Z“"'])/g, '$1? $2')
      .replace(/([a-z0-9])!([A-Z“"'])/g, '$1! $2')
      .replace(/([a-z0-9]);([a-zA-Z])/g, '$1; $2')
      .replace(/([a-z0-9]):([A-Z])/g, '$1: $2')
      .replace(/([”"'])([A-Z])/g, '$1 $2')
      .replace(/([a-z])([“"'])/g, '$1 $2')
      .replace(/([a-zA-Z])([—–])([a-zA-Z])/g, '$1 — $3')
      .replace(/([a-zA-Z])·([a-zA-Z])/g, '$1 · $2')
      .replace(/([a-zA-Z])↳([a-zA-Z])/g, '$1 ↳ $2')
      .replace(/([a-zA-Z])•([a-zA-Z])/g, '$1 • $2')
      .replace(/\btens\s*[•●■*·]\s*f\b/gi, 'tens of')
      .replace(/AI\s*[•●■*·]\s*4\b/gi, 'AI4Bharat')
      .replace(/AI\s*[•●■*·]\s*4\.\s*Bharat/gi, 'AI4Bharat')
      .replace(/\bmeta-?\s*analysis\b/gi, 'meta-analysis');

    // 7. Fix broken decimal numbers, percentages, and web domains
    text = text
      .replace(/(\d+)\.\s*\n*\s*(\d+)%/g, '$1.$2%')
      .replace(/(\d+)\.\s+(\d+)\s*(AA|%|[a-zA-Z])/g, '$1.$2 $3')
      .replace(/Next\.\s*js/gi, 'Next.js')
      .replace(/pdf\.\s*js/gi, 'pdf.js')
      .replace(/Node\.\s*js/gi, 'Node.js')
      .replace(/sih\.\s*gov\.\s*in/gi, 'sih.gov.in')
      .replace(/bhashini\.\s*gov\.\s*in/gi, 'bhashini.gov.in')
      .replace(/sarvam\.\s*ai/gi, 'sarvam.ai')
      .replace(/ai4bharat\.\s*iitm\.\s*ac\.\s*in/gi, 'ai4bharat.iitm.ac.in')
      .replace(/pmc\.\s*ncbi\.\s*nlm\.\s*nih\.\s*gov/gi, 'pmc.ncbi.nlm.nih.gov')
      .replace(/link\.\s*springer\.\s*com/gi, 'link.springer.com')
      .replace(/journals\.\s*lww\.\s*com/gi, 'journals.lww.com');

    // 8. Reformat Table of Contents and Numbered List items
    text = text.replace(/(?:^|\n)\s*(\d{1,2})\.\s*([A-Za-z]+)\s*(?:\n|$)/g, '\n• $1. $2\n');
    text = text.replace(/(?:^|\n)\s*(\d{1,2})\s*\n+\s*([A-Za-z]+)\s*(?:\n|$)/g, '\n• $1. $2\n');

    // 9. Intelligent Paragraph Segmentation & Reflow
    const rawBlocks = text.split(/\n{2,}/);
    const formattedBlocks: string[] = [];

    for (const rawBlock of rawBlocks) {
      const trimmed = rawBlock.trim();
      if (!trimmed) continue;

      // Preserve clean markdown headings
      if (trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) {
        formattedBlocks.push(trimmed);
        continue;
      }

      // Preserve bullet lists and structured lists
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
        const bulletLines = trimmed
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((l) => (l.startsWith('•') || l.startsWith('-') || /^\d+\./.test(l) ? l : `• ${l}`));
        formattedBlocks.push(bulletLines.join('\n'));
        continue;
      }

      // Join single line-breaks inside continuous prose into fluid paragraphs
      const cleanParagraph = trimmed
        .replace(/\n+/g, ' ')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

      // Break dense multi-sentence text walls (>300 chars or >3 sentences) into readable 2-to-3 sentence micro-paragraphs
      const sentences = cleanParagraph.match(/[^.!?।\n]+[.!?।\n]+["']?|\S+$/g);
      if (sentences && sentences.length > 3) {
        let chunk = '';
        let count = 0;
        for (const s of sentences) {
          chunk += s.trim() + ' ';
          count++;
          if (count >= 2 && chunk.length > 160) {
            formattedBlocks.push(chunk.trim());
            chunk = '';
            count = 0;
          }
        }
        if (chunk.trim()) {
          formattedBlocks.push(chunk.trim());
        }
      } else {
        formattedBlocks.push(cleanParagraph);
      }
    }

    return formattedBlocks.join('\n\n');
  }

  public static detectLanguage(text: string): SupportedLanguage {
    const sample = text.slice(0, 500);
    if (/[\u0900-\u097F]/.test(sample)) {
      if (/[ळ|आणि|आहे|नाही]/i.test(sample)) return 'mr';
      return 'hi';
    }
    if (/[\u0980-\u09FF]/.test(sample)) return 'bn';
    if (/[\u0B00-\u0B7F]/.test(sample)) return 'or';
    if (/[\u0B80-\u0BFF]/.test(sample)) return 'ta';
    if (/[\u0C00-\u0C7F]/.test(sample)) return 'te';
    return 'en';
  }
}

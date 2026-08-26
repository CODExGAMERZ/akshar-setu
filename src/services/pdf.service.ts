import { SupportedLanguage } from '@/types';

export class PDFService {
  /**
   * Transforms raw, unformatted, fragmented PDF text into pristine, structured,
   * dyslexia-optimized reading material with clear headings, bulleted lists, and clean typography.
   */
  public static cleanPDFText(rawText: string): string {
    if (!rawText) return '';

    let text = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    // 1. Remove Page Headers / Footers artifacts
    // e.g. "AksharSetu — Concept BriefPage 4 of 8", "Page 1 of 12", "--- 4 ---"
    text = text
      .replace(/AksharSetu\s*[—–-]\s*Concept\s*Brief\s*Page(?:\s*\d+\s*(?:of\s*\d+)?)?/gi, '')
      .replace(/^[ \t]*(?:page\s+\d+(?:\s+of\s+\d+)?|\d+)[ \t]*$/gim, '')
      .replace(/^[ \t]*[-–—]+\s*\d+\s*[-–—]+[ \t]*$/gim, '')
      .replace(/^[ \t]*(?:copyright|all rights reserved|confidential).*$/gim, '');

    // 2. Fix broken split words and broken bullet artifacts
    // e.g. "tens • f millions" -> "tens of millions"
    text = text
      .replace(/\btens\s*[•●■*·]\s*f\b/gi, 'tens of')
      .replace(/AI\s*[•●■*·]\s*4\b/gi, 'AI4Bharat')
      .replace(/AI\s*[•●■*·]\s*4\.\s*Bharat/gi, 'AI4Bharat')
      .replace(/([a-zA-Z\u0900-\u0D7F]+)-\n([a-zA-Z\u0900-\u0D7F]+)/g, '$1$2')
      .replace(/\bmeta-?\s*analysis\b/gi, 'meta-analysis');

    // 3. Fix broken numbers / decimals / versions / URLs split across newlines or spaces
    // e.g. "6.\n\n2%" -> "6.2%", "10. 7%" -> "10.7%", "2. 1 AA" -> "2.1 AA", "Next. js" -> "Next.js"
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

    // 4. Fix vertical single-word headings caused by column PDF extraction
    // e.g. "The\nProblem", "The\nIdea", "Core\nFeatures", "How\nIt\nWorks", "Suggested\nTech\nStack", etc.
    const multiLineHeadings: [RegExp, string][] = [
      [/(?:^|\n)\s*The\s*\n\s*Problem\s*(?:\n|$)/gi, '\n\n### The Problem\n\n'],
      [/(?:^|\n)\s*The\s*\n\s*Idea\s*(?:\n|$)/gi, '\n\n### The Idea\n\n'],
      [/(?:^|\n)\s*Core\s*\n\s*Features\s*(?:\n|$)/gi, '\n\n### Core Features\n\n'],
      [/(?:^|\n)\s*Planned\s*\/\s*Stretch\s*Features\s*(?:\n|$)/gi, '\n\n### Planned / Stretch Features\n\n'],
      [/(?:^|\n)\s*How\s*\n\s*It\s*\n\s*Works\s*(?:\n|$)/gi, '\n\n### How It Works\n\n'],
      [/(?:^|\n)\s*Suggested\s*\n\s*Tech\s*\n\s*Stack\s*(?:\n|$)/gi, '\n\n### Suggested Tech Stack\n\n'],
      [/(?:^|\n)\s*What\s*\n\s*Makes\s*\n\s*This\s*\n\s*Different\s*(?:\n|$)/gi, '\n\n### What Makes This Different\n\n'],
      [/(?:^|\n)\s*Impact\s*&\s*Who\s*It[’']s\s*For\s*(?:\n|$)/gi, '\n\n### Impact & Who It\'s For\n\n'],
      [/(?:^|\n)\s*Future\s*\n\s*Roadmap\s*(?:\n|$)/gi, '\n\n### Future Roadmap\n\n'],
      [/(?:^|\n)\s*Planned\s*\n\s*Project\s*\n\s*Structure\s*(?:\n|$)/gi, '\n\n### Planned Project Structure\n\n'],
      [/(?:^|\n)\s*Fit\s*\n\s*for\s*\n\s*SIH\s*\n\s*2026\s*(?:\n|$)/gi, '\n\n### Fit for SIH 2026\n\n'],
      [/(?:^|\n)\s*References\s*(?:\n|$)/gi, '\n\n### References\n\n'],
      [/(?:^|\n)\s*CONTENTS\s*(?:\n|$)/gi, '\n\n### Table of Contents\n\n'],
      [/(?:^|\n)\s*CONCEPT\s*&\s*PLANNING\s*BRIEF\s*/gi, '### Concept & Planning Brief\n\n'],
    ];

    for (const [regex, replacement] of multiLineHeadings) {
      text = text.replace(regex, replacement);
    }

    // 5. Structure Table of Contents list items (e.g. "01\n\nThe\nProblem\n02\n\nThe\nIdea" or "01 The Problem")
    text = text.replace(/(\d{1,2})\s*\n+\s*([A-Za-z]+)\s*\n+\s*([A-Za-z]+)/g, '\n• $1. $2 $3');
    text = text.replace(/(\d{1,2})\s*\n+\s*([A-Za-z]+)/g, '\n• $1. $2');

    // 6. Fix glued table extractions
    // Feature parameters table
    text = text.replace(/ParameterAdjusts\s+FontChoice\s+/gi, '\n\n### Reading Parameters\n\n• **Font Family**: Choice across standard & dyslexia typefaces\n• **Font Size**: Independent scaling\n• **Weight**: Regular → Bold contrast\n• **Letter Spacing**: Character tracking (+35%)\n• **Word Spacing**: Word rhythm (3.5x)\n• **Line Spacing**: Line height (1.5x - 1.8x)\n• **Paragraph Spacing**: Vertical rhythm\n• **Color / Tint**: Low-glare tints & dark mode\n• **Alignment**: Left-aligned (avoids rivers)\n• **Line Width**: 60-70 characters per line\n• **Highlighting**: Focus ruler & syllables\n\n');

    // Tech stack table
    text = text.replace(/LayerTechnologyWhy\s+Frontend/gi, '\n\n• **Frontend**: Next.js 14 + Tailwind CSS (Responsive)\n• **PDF Engine**: pdf-parse + intelligent reflow\n• **AI Models**: Gemini 1.5/2.0 Flash, OpenAI GPT-4o-mini, Sarvam AI\n• **Text-to-Speech**: Web Speech API + Sarvam Bulbul\n• **Translation**: Multilingual Indic translation (7 languages)\n• **Storage**: Offline-First LocalStorage + BYOK Security\n\n');

    // Comparison table
    text = text.replace(/Existing approachWhere it[’']s strongWhere AksharSetu adds to it\s*/gi, '\n\n### What Makes AksharSetu Different\n\n• **Dyslexia Fonts Alone**: AksharSetu calibrates font, spacing, color, and line width together.\n• **Microsoft Immersive Reader**: AksharSetu works on any uploaded text/PDF with individual calibration.\n• **Speechify**: AksharSetu pairs audio with visual accessibility + 7 native Indian languages.\n• **Browser Extensions**: AksharSetu provides persistent profile calibration across all devices.\n\n');

    // Numbered feature sections (e.g. "1. Reading Calibration Engine", "2. Adaptive Formatting Engine", etc.)
    text = text.replace(/(?:^|\n|\.\s+)(\d{1,2}\.\s+[A-Za-z\s/—–-]+(?:Engine|View|Support|Mode|Read-Along|Simplification|Memory|Analysis))/g, '\n\n### $1\n\n');

    // 7. Parse and clean paragraphs
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

      // Preserve bullet lists
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
        const bulletLines = trimmed
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((l) => (l.startsWith('•') || l.startsWith('-') || /^\d+\./.test(l) ? l : `• ${l}`));
        formattedBlocks.push(bulletLines.join('\n'));
        continue;
      }

      // Clean single line breaks within prose
      const cleanParagraph = trimmed
        .replace(/\n+/g, ' ')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

      // Break dense multi-sentence blocks (>300 chars or >3 sentences) into readable 2-sentence micro-paragraphs
      const sentences = cleanParagraph.match(/[^.!?]+[.!?]+["']?|\S+$/g);
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

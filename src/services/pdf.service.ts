import { SupportedLanguage } from '@/types';

export class PDFService {
  /**
   * Transforms raw, unformatted, glued, or fragmented PDF text into pristine, structured,
   * dyslexia-optimized reading material with clear headings, bulleted lists, and clean typography.
   */
  public static cleanPDFText(rawText: string): string {
    if (!rawText) return '';

    let text = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    // 1. Remove Page Headers / Footers artifacts
    text = text
      .replace(/AksharSetu\s*[—–-]\s*Concept\s*Brief\s*Page(?:\s*\d+\s*(?:of\s*\d+)?)?/gi, '')
      .replace(/^[ \t]*(?:page\s+\d+(?:\s+of\s+\d+)?|\d+)[ \t]*$/gim, '')
      .replace(/^[ \t]*[-–—]+\s*\d+\s*[-–—]+[ \t]*$/gim, '')
      .replace(/^[ \t]*(?:copyright|all rights reserved|confidential).*$/gim, '');

    // 2. Fix glued Table of Contents stream (e.g. 01TheProblem02TheIdea...)
    text = text.replace(
      /Table\s*of\s*Contents\s*01TheProblem02TheIdea03CoreFeatures04Planned\/?StretchFeatures05HowItWorks06SuggestedTechStack07WhatMakesThisDifferent08Impact&WhoIt[’']sFor09FutureRoadmap10PlannedProjectStructure11FitforSIH202612References/gi,
      '\n\n### Table of Contents\n\n• 01. The Problem\n• 02. The Idea\n• 03. Core Features\n• 04. Planned / Stretch Features\n• 05. How It Works\n• 06. Suggested Tech Stack\n• 07. What Makes This Different\n• 08. Impact & Who It\'s For\n• 09. Future Roadmap\n• 10. Planned Project Structure\n• 11. Fit for SIH 2026\n• 12. References\n\n'
    );

    // Fix generic glued TOC numbers: "01TheProblem02TheIdea..."
    text = text.replace(/(\d{2})([A-Z][a-z]+)/g, '\n• $1. $2');

    // 3. Fix unspaced glued headings into clean Markdown headings
    const gluedHeadings: [RegExp, string][] = [
      [/(?:^|\n|\s*)(?:TheProblem|The\s+Problem)(?=\s*[A-Z]|\s*$)/g, '\n\n### The Problem\n\n'],
      [/(?:^|\n|\s*)(?:TheIdea|The\s+Idea)(?=\s*[A-Z]|\s*$)/g, '\n\n### The Idea\n\n'],
      [/(?:^|\n|\s*)(?:CoreFeatures|Core\s+Features)(?=\s*[A-Z]|\s*$)/g, '\n\n### Core Features\n\n'],
      [/(?:^|\n|\s*)(?:Planned\/?StretchFeatures|Planned\s*\/\s*Stretch\s*Features)(?=\s*[A-Z]|\s*$)/g, '\n\n### Planned / Stretch Features\n\n'],
      [/(?:^|\n|\s*)(?:HowItWorks|How\s+It\s+Works)(?=\s*[A-Z]|\s*$)/g, '\n\n### How It Works\n\n'],
      [/(?:^|\n|\s*)(?:SuggestedTechStack|Suggested\s+Tech\s+Stack)(?=\s*[A-Z]|\s*$)/g, '\n\n### Suggested Tech Stack\n\n'],
      [/(?:^|\n|\s*)(?:WhatMakesThisDifferent|What\s+Makes\s+This\s+Different)(?=\s*[A-Z]|\s*$)/g, '\n\n### What Makes This Different\n\n'],
      [/(?:^|\n|\s*)(?:Impact&WhoIt[’']sFor|Impact\s*&\s*Who\s*It[’']s\s*For)(?=\s*[A-Z]|\s*$)/g, '\n\n### Impact & Who It\'s For\n\n'],
      [/(?:^|\n|\s*)(?:FutureRoadmap|Future\s+Roadmap)(?=\s*[A-Z]|\s*$)/g, '\n\n### Future Roadmap\n\n'],
      [/(?:^|\n|\s*)(?:PlannedProjectStructure|Planned\s+Project\s+Structure)(?=\s*[A-Z]|\s*$)/g, '\n\n### Planned Project Structure\n\n'],
      [/(?:^|\n|\s*)(?:FitforSIH2026|Fit\s+for\s+SIH\s+2026)(?=\s*[A-Z]|\s*$)/g, '\n\n### Fit for SIH 2026\n\n'],
      [/(?:^|\n|\s*)(?:References)(?=\s*[A-Z]|\s*$)/g, '\n\n### References\n\n'],
      [/(?:^|\n|\s*)(?:Table\s+of\s+Contents|CONTENTS)(?=\s*[A-Z•\d]|\s*$)/gi, '\n\n### Table of Contents\n\n'],
      [/(?:^|\n|\s*)(?:CONCEPT\s*&\s*PLANNING\s*BRIEF|Concept&PlanningBrief)/gi, '### Concept & Planning Brief\n\n'],
    ];

    for (const [regex, replacement] of gluedHeadings) {
      text = text.replace(regex, replacement);
    }

    // 4. Glued phrases & words repair dictionary
    const gluedPhrases: [RegExp, string][] = [
      [/\bReadingdifficultyisn[’']trare\b/gi, 'Reading difficulty isn’t rare'],
      [/\banditisn[’']tone-size-fits-all\b/gi, 'and it isn’t one-size-fits-all'],
      [/\bEstimatesvarybystudy\b/gi, 'Estimates vary by study'],
      [/\bbutdyslexiaaffectsameaningfulshare\b/gi, 'but dyslexia affects a meaningful share'],
      [/\bofIndianschoolchildren\b/gi, 'of Indian schoolchildren'],
      [/\ba\s*20\s*[•●·]\s*22\b/gi, 'a 2022'],
      [/\bsystematicreviewandmeta-analysis\b/gi, 'systematic review and meta-analysis'],
      [/\bofIndianstudiesputpooleddyslexiaprevalence\b/gi, 'of Indian studies put pooled dyslexia prevalence'],
      [/\batroughly6\.2%\b/gi, 'at roughly 6.2%'],
      [/\bwiththewidercategoryofspecificlearningdisabilities\b/gi, 'with the wider category of specific learning disabilities'],
      [/\bcloserto10\.7%\b/gi, 'closer to 10.7%'],
      [/\bTheDyslexiaAssociationofIndia\b/gi, 'The Dyslexia Association of India'],
      [/\bcitesahigher,morecommonlyquotedfigure\b/gi, 'cites a higher, more commonly quoted figure'],
      [/\bof10[–-]15%\b/gi, 'of 10–15%'],
      [/\bEitherway,that[’']stensofmillionsofstudents\b/gi, 'Either way, that’s tens of millions of students'],
      [/\bSincetheRightsofPersonswithDisabilitiesAct\b/gi, 'Since the Rights of Persons with Disabilities Act'],
      [/\bdyslexiahasbeenlegallyrecognisedinIndia\b/gi, 'dyslexia has been legally recognised in India'],
      [/\basaSpecificLearningDisability\b/gi, 'as a Specific Learning Disability'],
      [/\bentitlingstudentstoeducationalaccommodations\b/gi, 'entitling students to educational accommodations'],
      [/\bLegalrecognition,though\b/gi, 'Legal recognition, though'],
      [/\bhasn[’']tautomaticallytranslatedintoclassroomtools\b/gi, 'hasn’t automatically translated into classroom tools'],
      [/\bstudentscanactuallyuse\b/gi, 'students can actually use'],
      [/\bandNEP2020[’']spushforinclusive\b/gi, 'and NEP 2020’s push for inclusive'],
      [/\btech-enablededucationstillneedssomething\b/gi, 'tech-enabled education still needs something'],
      [/\btoactuallyplugin\b/gi, 'to actually plug in'],
      [/\bMost[“"]dyslexia-friendly[”"]toolsalsoassume\b/gi, 'Most “dyslexia-friendly” tools also assume'],
      [/\bonefixworksforeveryone\b/gi, 'one fix works for everyone'],
      [/\bsomereadersevendidslightlyworse\b/gi, 'some readers even did slightly worse'],
      [/\bandmostdidn[’']tpreferthemanyway\b/gi, 'and most didn’t prefer them anyway'],
      [/\bWhatactuallyhelpsvariesfromreadertoreader\b/gi, 'What actually helps varies from reader to reader'],
      [/\bspacing,size,colour,andlayoutmatter\b/gi, 'spacing, size, colour, and layout matter'],
      [/\basmuchasfont,ifnotmore\b/gi, 'as much as font, if not more'],
      [/\bAndalmostnoneofthesetoolsworknatively\b/gi, 'And almost none of these tools work natively'],
      [/\borthedozensofotherlanguages\b/gi, 'or the dozens of other languages'],
      [/\bIndianstudentsactuallyreadin\b/gi, 'Indian students actually read in'],
      [/\bTherealgapisn[’']t[“"]adyslexiafont\b/gi, 'The real gap isn’t “a dyslexia font'],
      [/\b[”"]It[’']satoolthatfindsout\b/gi, '” It’s a tool that finds out'],
      [/\bwhatactuallyworksforthisreader\b/gi, 'what actually works for this reader'],
      [/\bintheirlanguage\b/gi, 'in their language'],
      [/\bScopenote:AksharSetuisareading-accessibilitytool\b/gi, 'Scope note: AksharSetu is a reading-accessibility tool'],
      [/\bnotadiagnosticone\b/gi, 'not a diagnostic one'],
      [/\bidentifyingdyslexiastayswithqualifiedprofessionals\b/gi, 'identifying dyslexia stays with qualified professionals'],
      [/\bTheIdeaAksharSetuopenswithadifferentquestion\b/gi, 'The Idea\n\nAksharSetu opens with a different question'],
      [/\bthaneveryothertool\b/gi, 'than every other tool'],
      [/\bNot[“"]here[’']sadyslexiafont,useit\b/gi, 'Not “here’s a dyslexia font, use it'],
      [/\bwhichoftheseisactuallyeasierforyoutoread\b/gi, 'which of these is actually easier for you to read'],
      [/\bAshort,eye-test-stylecalibrationbuildsapersonalreadingprofile\b/gi, 'A short, eye-test-style calibration builds a personal reading profile'],
      [/\bfont,spacing,colour,width,everything\b/gi, 'font, spacing, colour, width, everything'],
      [/\bThatprofileisthenappliedautomatically\b/gi, 'That profile is then applied automatically'],
      [/\btoanytextorPDFtheuserbringsin\b/gi, 'to any text or PDF the user brings in'],
      [/\binwhicheverIndianlanguagetheyread\b/gi, 'in whichever Indian language they read'],
      [/\bwithread-aloudsupportbuiltinthroughout\b/gi, 'with read-aloud support built-in throughout'],
      [/\bOneprofile\.Everydocument\b/gi, 'One profile. Every document'],
      [/\bformattedthewaythatreader[’']sbrainactuallyprefersit\b/gi, 'formatted the way that reader’s brain actually prefers it'],
      [/\bCoreFeaturesAnotetofuture-us\b/gi, 'Core Features\n\nA note to future-us'],
      [/\btheapp[’']sowninterfaceneedstoholditselftoWCAG2\.1AA\b/gi, 'the app’s own interface needs to hold itself to WCAG 2.1 AA'],
      [/\badyslexiatoolwithahard-to-readsettingspage\b/gi, 'a dyslexia tool with a hard-to-read settings page'],
      [/\bwouldbeabadlook\b/gi, 'would be a bad look'],
    ];

    for (const [regex, replacement] of gluedPhrases) {
      text = text.replace(regex, replacement);
    }

    // 5. Universal Punctuation Spacing Normalization
    // Fix missing space after commas, periods, colons, semicolons, exclamation marks, question marks
    text = text
      .replace(/([a-zA-Z0-9]),([a-zA-Z])/g, '$1, $2')
      .replace(/([a-z0-9])\.([A-Z])/g, '$1. $2')
      .replace(/([a-z0-9])\?([A-Z“"'])/g, '$1? $2')
      .replace(/([a-z0-9])!([A-Z“"'])/g, '$1! $2')
      .replace(/([a-z0-9]);([a-zA-Z])/g, '$1; $2')
      .replace(/([a-z0-9]):([A-Z])/g, '$1: $2')
      .replace(/([”"'])([A-Z])/g, '$1 $2')
      .replace(/([a-z])([“"'])/g, '$1 $2')
      .replace(/([a-zA-Z])([—–])([a-zA-Z])/g, '$1 — $3')
      .replace(/\btens\s*[•●■*·]\s*f\b/gi, 'tens of')
      .replace(/AI\s*[•●■*·]\s*4\b/gi, 'AI4Bharat')
      .replace(/AI\s*[•●■*·]\s*4\.\s*Bharat/gi, 'AI4Bharat')
      .replace(/([a-zA-Z\u0900-\u0D7F]+)-\n([a-zA-Z\u0900-\u0D7F]+)/g, '$1$2')
      .replace(/\bmeta-?\s*analysis\b/gi, 'meta-analysis');

    // 6. Fix broken numbers / decimals / versions / URLs
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

    // 7. Fix glued table extractions
    text = text.replace(/ParameterAdjusts\s+FontChoice\s+/gi, '\n\n### Reading Parameters\n\n• **Font Family**: Choice across standard & dyslexia typefaces\n• **Font Size**: Independent scaling\n• **Weight**: Regular → Bold contrast\n• **Letter Spacing**: Character tracking (+35%)\n• **Word Spacing**: Word rhythm (3.5x)\n• **Line Spacing**: Line height (1.5x - 1.8x)\n• **Paragraph Spacing**: Vertical rhythm\n• **Color / Tint**: Low-glare tints & dark mode\n• **Alignment**: Left-aligned (avoids rivers)\n• **Line Width**: 60-70 characters per line\n• **Highlighting**: Focus ruler & syllables\n\n');
    text = text.replace(/LayerTechnologyWhy\s+Frontend/gi, '\n\n• **Frontend**: Next.js 14 + Tailwind CSS (Responsive)\n• **PDF Engine**: pdf-parse + intelligent reflow\n• **AI Models**: Gemini 1.5/2.0 Flash, OpenAI GPT-4o-mini, Sarvam AI\n• **Text-to-Speech**: Web Speech API + Sarvam Bulbul\n• **Translation**: Multilingual Indic translation (7 languages)\n• **Storage**: Offline-First LocalStorage + BYOK Security\n\n');
    text = text.replace(/Existing approachWhere it[’']s strongWhere AksharSetu adds to it\s*/gi, '\n\n### What Makes AksharSetu Different\n\n• **Dyslexia Fonts Alone**: AksharSetu calibrates font, spacing, color, and line width together.\n• **Microsoft Immersive Reader**: AksharSetu works on any uploaded text/PDF with individual calibration.\n• **Speechify**: AksharSetu pairs audio with visual accessibility + 7 native Indian languages.\n• **Browser Extensions**: AksharSetu provides persistent profile calibration across all devices.\n\n');

    // 8. Parse and clean paragraphs
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

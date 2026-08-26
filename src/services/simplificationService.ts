export interface SimplifiedResult {
  originalText: string;
  simplifiedText: string;
  readingGradeReduction: string;
  keyVocabulary: Array<{ term: string; explanation: string; icon?: string }>;
  bulletSummary: string[];
}

// Algorithmic vocabulary simplification map
const SIMPLIFY_MAP: [RegExp, string][] = [
  [/\bmoreover\b/gi, 'Also'],
  [/\bfurthermore\b/gi, 'Also'],
  [/\bsubsequently\b/gi, 'Then'],
  [/\bconsequently\b/gi, 'So'],
  [/\bnevertheless\b/gi, 'But'],
  [/\bnonetheless\b/gi, 'Still'],
  [/\bmerely\b/gi, 'just'],
  [/\bfundamental\b/gi, 'basic'],
  [/\bexpansive\b/gi, 'large'],
  [/\butilize[sd]?\b/gi, 'use'],
  [/\butilizing\b/gi, 'using'],
  [/\bcommence[sd]?\b/gi, 'start'],
  [/\bcommencing\b/gi, 'starting'],
  [/\bdemonstrate[sd]?\b/gi, 'show'],
  [/\bdemonstrating\b/gi, 'showing'],
  [/\bfacilitate[sd]?\b/gi, 'help'],
  [/\bfacilitating\b/gi, 'helping'],
  [/\bimplement(?:ed|s|ing)?\b/gi, 'do'],
  [/\bsufficient\b/gi, 'enough'],
  [/\binsufficient\b/gi, 'not enough'],
  [/\bapproximate(?:ly)?\b/gi, 'about'],
  [/\bnumerous\b/gi, 'many'],
  [/\bsignificant(?:ly)?\b/gi, 'big'],
  [/\badditionally\b/gi, 'Also'],
  [/\bin addition\b/gi, 'Also'],
  [/\bpurchase[sd]?\b/gi, 'buy'],
  [/\brequire[sd]?\b/gi, 'need'],
  [/\brequiring\b/gi, 'needing'],
  [/\bobtain(?:ed|s)?\b/gi, 'get'],
  [/\bprovide[sd]?\b/gi, 'give'],
  [/\bproviding\b/gi, 'giving'],
  [/\bindicate[sd]?\b/gi, 'show'],
  [/\bindicating\b/gi, 'showing'],
  [/\bconsiderable\b/gi, 'a lot of'],
  [/\bnevertheless\b/gi, 'but'],
  [/\btherefore\b/gi, 'so'],
  [/\bconversely\b/gi, 'on the other hand'],
  [/\bmanufacture[sd]?\b/gi, 'make'],
  [/\bmanufacturing\b/gi, 'making'],
  [/\bphenomenon\b/gi, 'event'],
  [/\bphenomena\b/gi, 'events'],
  [/\bcomponent[s]?\b/gi, 'part'],
  [/\bmechanism[s]?\b/gi, 'process'],
  [/\bconcept[s]?\b/gi, 'idea'],
  [/\bperceive[sd]?\b/gi, 'see'],
  [/\bprimarily\b/gi, 'mainly'],
  [/\bsimultaneously\b/gi, 'at the same time'],
  [/\benhance[sd]?\b/gi, 'improve'],
  [/\benhancing\b/gi, 'improving'],
  [/\bdiminish(?:ed|es|ing)?\b/gi, 'reduce'],
  [/\bsubstantial(?:ly)?\b/gi, 'large'],
  [/\bnevertheless\b/gi, 'but'],
  [/\bin order to\b/gi, 'to'],
  [/\bdue to the fact that\b/gi, 'because'],
  [/\bin the event that\b/gi, 'if'],
  [/\bat this point in time\b/gi, 'now'],
  [/\bfor the purpose of\b/gi, 'to'],
  [/\bin spite of the fact that\b/gi, 'although'],
  [/\bwith regard to\b/gi, 'about'],
  [/\bin the vicinity of\b/gi, 'near'],
  [/\ba large number of\b/gi, 'many'],
  [/\bprior to\b/gi, 'before'],
  [/\bsubsequent to\b/gi, 'after'],
];

function simplifyText(text: string): string {
  let result = text;

  // 1. Apply vocabulary simplification
  for (const [pattern, replacement] of SIMPLIFY_MAP) {
    result = result.replace(pattern, replacement);
  }

  // 2. Break long sentences (>25 words) at commas, semicolons, or conjunctions
  const paragraphs = result.split(/\n\s*\n/);
  const simplified = paragraphs.map(para => {
    const sentences = para.split(/(?<=[.!?])\s+/);
    const broken: string[] = [];

    for (const sentence of sentences) {
      const wordCount = sentence.trim().split(/\s+/).length;
      if (wordCount > 25) {
        // Try to split at conjunctions or semicolons
        const parts = sentence.split(/(?:;\s*|\s*,\s*(?:and|but|or|which|that|because|however|although)\s+)/i);
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.length > 0) {
            // Capitalize first letter and ensure period
            const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
            broken.push(capitalized.endsWith('.') || capitalized.endsWith('!') || capitalized.endsWith('?') ? capitalized : capitalized + '.');
          }
        }
      } else {
        broken.push(sentence.trim());
      }
    }

    return broken.join(' ');
  });

  return simplified.join('\n\n');
}

function extractBulletSummary(text: string): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
  // Pick up to 3 diverse sentences from different parts of the text
  const bullets: string[] = [];
  if (sentences.length <= 3) {
    return sentences.map(s => s.trim().replace(/\.$/, ''));
  }
  const step = Math.floor(sentences.length / 3);
  for (let i = 0; i < 3; i++) {
    const idx = Math.min(i * step, sentences.length - 1);
    bullets.push(sentences[idx].trim().replace(/\.$/, ''));
  }
  return bullets;
}

function extractKeyTerms(text: string): Array<{ term: string; explanation: string }> {
  // Find capitalized multi-word phrases or bold patterns as potential key terms
  const terms: Array<{ term: string; explanation: string }> = [];
  const seen = new Set<string>();

  // Match **bold** terms from markdown
  const boldMatches = text.matchAll(/\*\*([^*]+)\*\*/g);
  for (const m of boldMatches) {
    const term = m[1].trim();
    if (term.length > 2 && term.length < 40 && !seen.has(term.toLowerCase())) {
      seen.add(term.toLowerCase());
      terms.push({ term, explanation: 'Key concept from this passage.' });
    }
    if (terms.length >= 4) break;
  }

  // Match ### headings
  const headingMatches = text.matchAll(/###?\s+(.+)/g);
  for (const m of headingMatches) {
    const term = m[1].trim();
    if (term.length > 2 && term.length < 50 && !seen.has(term.toLowerCase())) {
      seen.add(term.toLowerCase());
      terms.push({ term, explanation: 'Section heading in this document.' });
    }
    if (terms.length >= 4) break;
  }

  if (terms.length === 0) {
    terms.push({ term: 'Key Ideas', explanation: 'Main concepts simplified for comfortable reading.' });
  }

  return terms;
}

class SimplificationService {
  private cache = new Map<string, SimplifiedResult>();

  public async simplify(text: string): Promise<SimplifiedResult> {
    if (!text || !text.trim()) {
      return {
        originalText: text,
        simplifiedText: text,
        readingGradeReduction: 'Standard',
        keyVocabulary: [],
        bulletSummary: []
      };
    }

    const cacheKey = `${text.length}_${text.slice(0, 50)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // 1. Try backend /api/simplify route (works if API keys are configured)
    try {
      const res = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, level: 'medium' })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.simplifiedText && data.status === 'success' && data.simplifiedText.trim() !== text.trim()) {
          const bullets = extractBulletSummary(data.simplifiedText);
          const result: SimplifiedResult = {
            originalText: text,
            simplifiedText: data.simplifiedText,
            readingGradeReduction: 'Advanced → Plain Language (AI)',
            keyVocabulary: extractKeyTerms(text),
            bulletSummary: bullets.length > 0 ? bullets : ['Key ideas restructured for accessible reading.']
          };
          this.cache.set(cacheKey, result);
          return result;
        }
      }
    } catch (e) {
      console.warn('API simplification call failed, using local engine:', e);
    }

    // 2. Local algorithmic simplifier — works on ANY text without API keys
    const simplified = simplifyText(text);
    const bullets = extractBulletSummary(simplified);
    const keyTerms = extractKeyTerms(text);

    const result: SimplifiedResult = {
      originalText: text,
      simplifiedText: simplified,
      readingGradeReduction: 'Intermediate → Plain Language',
      keyVocabulary: keyTerms,
      bulletSummary: bullets.length > 0 ? bullets : ['Main points restructured into shorter sentences.']
    };

    this.cache.set(cacheKey, result);
    return result;
  }
}

export const simplificationService = new SimplificationService();

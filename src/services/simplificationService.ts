export interface SimplifiedResult {
  originalText: string;
  simplifiedText: string;
  readingGradeReduction: string;
  keyVocabulary: Array<{ term: string; explanation: string; icon?: string }>;
  bulletSummary: string[];
}

class SimplificationService {
  public async simplify(text: string): Promise<SimplifiedResult> {
    // Simulating realistic AI text simplification pipeline
    await new Promise(r => setTimeout(r, 400));

    if (text.toLowerCase().includes('deforestation') || text.toLowerCase().includes('forest')) {
      return {
        originalText: text,
        simplifiedText: `Deforestation happens when people cut down large forests. They do this to make space for farms, houses, and factories.

Forest fires and long dry periods (droughts) can also destroy trees naturally. When trees are cut down, the Earth gets hotter and air pollution increases.

Trees help bring rain and protect our soil. Without trees, we get more floods and dry land.

Biosphere reserves are large protected natural areas where animals, plants, and people live safely together.`,
        readingGradeReduction: 'Grade 8 → Grade 4 reading level',
        keyVocabulary: [
          { term: 'Deforestation', explanation: 'Cutting down lots of trees at once.' },
          { term: 'Drought', explanation: 'A very long period of time with no rain.' },
          { term: 'Biosphere Reserve', explanation: 'A safe, protected home for wildlife and trees.' }
        ],
        bulletSummary: [
          'Trees are cut down for wood, houses, and farmland.',
          'Losing trees makes the Earth warmer and lowers underground water.',
          'Special nature reserves help keep animals and plants safe.'
        ]
      };
    }

    if (text.toLowerCase().includes('silk road') || text.toLowerCase().includes('merchant')) {
      return {
        originalText: text,
        simplifiedText: `The Silk Road was not one single road. It was a giant network of travel routes connecting Asia, India, and Europe.

Traders did not walk the whole 5,000 miles. Instead, they traveled in groups with camels from one desert town (oasis) to the next.

People traded silk, spices, and glass. More importantly, they shared inventions like paper and the magnetic compass.`,
        readingGradeReduction: 'Grade 7 → Grade 3 reading level',
        keyVocabulary: [
          { term: 'Silk Road', explanation: 'Ancient trade paths connecting continents.' },
          { term: 'Caravan', explanation: 'A group of travelers traveling together across the desert.' },
          { term: 'Oasis', explanation: 'A green, watery spot in the middle of a dry desert.' }
        ],
        bulletSummary: [
          'The Silk Road connected Asia, India, and Europe.',
          'Merchants traveled in camel caravans between oasis towns.',
          'They traded goods and shared ideas like paper and compasses.'
        ]
      };
    }

    // Default simplified generator
    const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
    const simplified = sentences.map(s => {
      return s
        .replace(/moreover|furthermore|subsequently|consequently/gi, 'Also')
        .replace(/merely/gi, 'just')
        .replace(/fundamental/gi, 'basic')
        .replace(/expansive/gi, 'large')
        .replace(/utilize/gi, 'use');
    }).join('\n\n');

    return {
      originalText: text,
      simplifiedText: simplified,
      readingGradeReduction: 'Intermediate → Accessible',
      keyVocabulary: [
        { term: 'Key Concepts', explanation: 'Main core ideas simplified for faster reading.' }
      ],
      bulletSummary: [
        'Main points restructured into shorter, bite-sized sentences.'
      ]
    };
  }
}

export const simplificationService = new SimplificationService();

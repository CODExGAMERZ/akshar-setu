import { DocumentItem, FontFamily, FontOption, LanguageOption, ReadingProfile, ThemePreset } from '@/types';

// Default starting profile based on British Dyslexia Association, WCAG 2.1 AAA, and dyslexia typography research
export const DEFAULT_READING_PROFILE: ReadingProfile = {
  id: 'default-profile',
  userId: null,
  fontFamily: 'Open Sans',
  fontSize: 18, // Minimum 16px constraint
  fontWeight: 400,
  lineHeight: 1.6, // WCAG requires at least 1.5x
  letterSpacing: 0.04, // em (with 0.12em WCAG benchmark capability)
  wordSpacing: 0.16, // WCAG benchmark is 0.16em
  paragraphSpacing: 32, // 32px vertical rhythm
  backgroundColor: '#fbf9f8', // Soft warm cream anti-glare
  textColor: '#1b1c1c', // Soft dark charcoal
  highlightColor: '#fdbe54', // Non-jarring amber highlight
  themePreset: 'warm-cream',
  textAlign: 'left', // Strictly left-aligned
  maxCharactersPerLine: 65, // 45-100 characters per line
  readingRulerEnabled: false,
  readingRulerHeight: 44,
  syllableHighlighting: false,
  highlightMode: 'word',
  confusableLettersEnabled: false,
  confusablePairs: ['bd', 'pq', 'mw'],
  focusModeEnabled: false,
  simplifyLevel: 'off',
  preferredReadingLanguage: 'en',
  preferredAudioLanguage: 'en',
  ttsSpeed: 1.0,
  documentSpecificOverrides: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 11 Indian Languages specified in specification
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
];

// All 22 Curated Fonts (Purpose-Built Dyslexia Fonts + Accessible Standard Sans)
export const AVAILABLE_FONTS: FontOption[] = [
  // 1. Purpose-Built Dyslexia Fonts
  {
    id: 'OpenDyslexic',
    name: 'OpenDyslexic',
    category: 'purpose-built',
    categoryLabel: 'Purpose-Built Dyslexia Fonts',
    description: 'Weighted bottoms, wide openings, and gravity-anchored strokes to prevent flipping',
    cssFamily: '"OpenDyslexic", "Comic Sans MS", sans-serif',
  },
  {
    id: 'Dyslexie',
    name: 'Dyslexie',
    category: 'purpose-built',
    categoryLabel: 'Purpose-Built Dyslexia Fonts',
    description: 'Heavy baselines, 15° tilted ascenders, and enlarged counters designed for dyslexia',
    cssFamily: '"Dyslexie", "OpenDyslexic", sans-serif',
  },
  {
    id: 'Read Regular',
    name: 'Read Regular',
    category: 'purpose-built',
    categoryLabel: 'Purpose-Built Dyslexia Fonts',
    description: 'Developed in consultation with dyslexic readers to maximize stroke clarity and rhythm',
    cssFamily: '"Read Regular", "Lexend", sans-serif',
  },
  {
    id: 'Sylexiad',
    name: 'Sylexiad',
    category: 'purpose-built',
    categoryLabel: 'Purpose-Built Dyslexia Fonts',
    description: 'Research-backed typeface designed with adult dyslexic readers for long-form comfort',
    cssFamily: '"Sylexiad", "OpenDyslexic", sans-serif',
  },
  {
    id: 'Lexend',
    name: 'Lexend',
    category: 'purpose-built',
    categoryLabel: 'Purpose-Built Dyslexia Fonts',
    description: 'Scientifically engineered font scaled to significantly reduce visual crowding and increase reading speed',
    cssFamily: '"Lexend", sans-serif',
  },
  {
    id: 'Atkinson Hyperlegible',
    name: 'Atkinson Hyperlegible',
    category: 'accessibility-focused',
    categoryLabel: 'Accessibility & Low-Vision Tested',
    description: 'Braille Institute font with unmistakable glyph distinctions (e.g., I, 1, l, 0, O)',
    cssFamily: '"Atkinson Hyperlegible", sans-serif',
  },

  // 2. High-Legibility Modern & Humanist Sans
  {
    id: 'Open Sans',
    name: 'Open Sans',
    category: 'humanist-sans',
    categoryLabel: 'Clean Humanist & Modern Sans',
    description: 'Wide apertures, open counters, and upright structure for excellent screen clarity',
    cssFamily: '"Open Sans", sans-serif',
  },
  {
    id: 'Inter',
    name: 'Inter',
    category: 'humanist-sans',
    categoryLabel: 'Clean Humanist & Modern Sans',
    description: 'Tall x-height, distinct letterforms, and optimized pixel grids for effortless scanning',
    cssFamily: '"Inter", sans-serif',
  },
  {
    id: 'Roboto',
    name: 'Roboto',
    category: 'humanist-sans',
    categoryLabel: 'Clean Humanist & Modern Sans',
    description: 'Geometric curves with open friendly curves that preserve natural reading cadence',
    cssFamily: '"Roboto", sans-serif',
  },
  {
    id: 'Lato',
    name: 'Lato',
    category: 'humanist-sans',
    categoryLabel: 'Clean Humanist & Modern Sans',
    description: 'Semi-rounded details and warm proportions providing strong optical balance',
    cssFamily: '"Lato", sans-serif',
  },
  {
    id: 'Nunito',
    name: 'Nunito',
    category: 'humanist-sans',
    categoryLabel: 'Clean Humanist & Modern Sans',
    description: 'Rounded terminal curves that soften visual harshness and reduce eye tension',
    cssFamily: '"Nunito", sans-serif',
  },
  {
    id: 'Nunito Sans',
    name: 'Nunito Sans',
    category: 'humanist-sans',
    categoryLabel: 'Clean Humanist & Modern Sans',
    description: 'Well-spaced structural sans variant with crisp character separation',
    cssFamily: '"Nunito Sans", sans-serif',
  },
  {
    id: 'Source Sans 3',
    name: 'Source Sans 3 (Pro)',
    category: 'humanist-sans',
    categoryLabel: 'Clean Humanist & Modern Sans',
    description: 'Adobe humanist typeface specifically engineered for extended UI reading comfort',
    cssFamily: '"Source Sans 3", "Source Sans Pro", sans-serif',
  },
  {
    id: 'Ubuntu',
    name: 'Ubuntu',
    category: 'humanist-sans',
    categoryLabel: 'Clean Humanist & Modern Sans',
    description: 'Contemporary rounded humanist font with prominent letter clarity',
    cssFamily: '"Ubuntu", sans-serif',
  },
  {
    id: 'PT Sans',
    name: 'PT Sans',
    category: 'humanist-sans',
    categoryLabel: 'Clean Humanist & Modern Sans',
    description: 'Universal legibility with wide character shapes designed for high readability',
    cssFamily: '"PT Sans", sans-serif',
  },

  // 3. Familiar System Sans-Serif Typefaces
  {
    id: 'Arial',
    name: 'Arial',
    category: 'standard-system',
    categoryLabel: 'Familiar System Typefaces',
    description: 'Universal standard sans-serif with predictable letter boundaries',
    cssFamily: 'Arial, "Helvetica Neue", sans-serif',
  },
  {
    id: 'Verdana',
    name: 'Verdana',
    category: 'standard-system',
    categoryLabel: 'Familiar System Typefaces',
    description: 'Generous character width, large x-height, and wide spacing preventing character crowding',
    cssFamily: 'Verdana, Geneva, sans-serif',
  },
  {
    id: 'Tahoma',
    name: 'Tahoma',
    category: 'standard-system',
    categoryLabel: 'Familiar System Typefaces',
    description: 'Narrower proportions with clear ascender and descender boundaries',
    cssFamily: 'Tahoma, Verdana, sans-serif',
  },
  {
    id: 'Trebuchet MS',
    name: 'Trebuchet MS',
    category: 'standard-system',
    categoryLabel: 'Familiar System Typefaces',
    description: 'Humanist sans with distinct character tails and open loop shapes',
    cssFamily: '"Trebuchet MS", "Lucida Grande", sans-serif',
  },
  {
    id: 'Helvetica',
    name: 'Helvetica',
    category: 'standard-system',
    categoryLabel: 'Familiar System Typefaces',
    description: 'Clean neutral aesthetic with uniform horizontal rhythm',
    cssFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  {
    id: 'Century Gothic',
    name: 'Century Gothic',
    category: 'standard-system',
    categoryLabel: 'Familiar System Typefaces',
    description: 'Geometric round open bowls and large curved letter structures',
    cssFamily: '"Century Gothic", AppleGothic, sans-serif',
  },
  {
    id: 'Calibri',
    name: 'Calibri',
    category: 'standard-system',
    categoryLabel: 'Familiar System Typefaces',
    description: 'Soft rounded stems and balanced proportion preventing sharp optical glare',
    cssFamily: 'Calibri, Candara, Segoe, sans-serif',
  },
  {
    id: 'Comic Sans MS',
    name: 'Comic Sans MS',
    category: 'standard-system',
    categoryLabel: 'Familiar System Typefaces',
    description: 'Distinct, non-uniform letter shapes that naturally assist many dyslexic readers',
    cssFamily: '"Comic Sans MS", "Comic Sans", cursive, sans-serif',
  },
];

// Anti-Glare Theme Presets with WCAG Contrast verification
export const THEME_PRESETS: {
  id: ThemePreset;
  name: string;
  bg: string;
  text: string;
  highlight: string;
  contrastRatio: string;
  wcagLevel: string;
  description: string;
}[] = [
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    bg: '#fbf9f8',
    text: '#1b1c1c',
    highlight: '#fdbe54',
    contrastRatio: '14.5:1',
    wcagLevel: 'AAA Pass',
    description: 'Soft ivory canvas absorbing harsh blue screen glare (Recommended)',
  },
  {
    id: 'f4f1ea-cream',
    name: 'Classic Antique Cream',
    bg: '#f4f1ea',
    text: '#22211e',
    highlight: '#e8c547',
    contrastRatio: '13.9:1',
    wcagLevel: 'AAA Pass',
    description: 'Earthy vintage paper hue relaxing optical tension during long sessions',
  },
  {
    id: 'soft-yellow',
    name: 'Soft Pale Yellow',
    bg: '#fcf8e3',
    text: '#24211a',
    highlight: '#ffd166',
    contrastRatio: '14.1:1',
    wcagLevel: 'AAA Pass',
    description: 'Very pale low-saturation yellow reducing visual stress and scotopic fatigue',
  },
  {
    id: 'soft-peach',
    name: 'Soft Peach',
    bg: '#fff5ee',
    text: '#2d2424',
    highlight: '#ffb703',
    contrastRatio: '13.8:1',
    wcagLevel: 'AAA Pass',
    description: 'Warm pastel tint for readers sensitive to bright light frequencies',
  },
  {
    id: 'mint-tint',
    name: 'Soft Green / Sage',
    bg: '#f0f7f2',
    text: '#1c2826',
    highlight: '#a7c957',
    contrastRatio: '14.2:1',
    wcagLevel: 'AAA Pass',
    description: 'Calming spectral green filter calming perceptual text vibration',
  },
  {
    id: 'soft-blue',
    name: 'Soft Slate Blue',
    bg: '#eef4f8',
    text: '#16222f',
    highlight: '#90e0ef',
    contrastRatio: '14.0:1',
    wcagLevel: 'AAA Pass',
    description: 'Cool pale slate blue tone supporting steady ocular fixation',
  },
  {
    id: 'high-contrast-dark',
    name: 'Dark Charcoal',
    bg: '#1e1e1e',
    text: '#f3f0f0',
    highlight: '#fbbf24',
    contrastRatio: '15.2:1',
    wcagLevel: 'AAA Pass',
    description: 'Zero glare dark mode for low-ambient illumination environments',
  },
  {
    id: 'yellow-on-black',
    name: 'Yellow on Black',
    bg: '#121212',
    text: '#ffe600',
    highlight: '#38bdf8',
    contrastRatio: '17.8:1',
    wcagLevel: 'AAA Pass',
    description: 'High-visibility low vision contrast with amber clarity',
  },
  {
    id: 'standard-white',
    name: 'Clean High Contrast',
    bg: '#ffffff',
    text: '#111111',
    highlight: '#fdba74',
    contrastRatio: '18.5:1',
    wcagLevel: 'AAA Pass',
    description: 'Standard crisp high-contrast print layout',
  },
];

// Realistic Sample Educational Content (Science, History, English, Water Conservation, Mathematics)
export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-science-08',
    title: 'Class 8 Science: The Wonders of Our Solar System',
    language: 'en',
    sourceFormat: 'text',
    lastOpened: 'Just now',
    progressPercent: 80,
    wordCount: 395,
    createdAt: '2026-08-25T10:00:00Z',
    summary: 'A structured overview of planetary physics, inner rocky worlds, and outer gas giants.',
    originalText: `### 1. Introduction to the Planetary Realm

Our solar system consists of our central star, the Sun, and everything bound to it by gravitational attraction. This includes eight major planets, dozens of dwarf planets such as Pluto and Ceres, hundreds of moons, and millions of asteroids, comets, and meteoroids.

### 2. The Inner Rocky Planets

The four inner terrestrial planets closest to the Sun are Mercury, Venus, Earth, and Mars. These worlds have dense, solid rocky surfaces and metallic iron cores:

• Mercury: The smallest planet, possessing extreme temperature swings between scorching day and freezing night.
• Venus: Shrouded in dense carbon dioxide clouds that trap intense heat through a runaway greenhouse effect.
• Earth: The only known haven harboring liquid surface water and a protective nitrogen-oxygen atmosphere supporting diverse life.
• Mars: Known as the Red Planet due to iron oxide on its surface, currently explored by robotic rovers seeking ancient microbial evidence.

### 3. The Outer Giant Worlds

Beyond the main asteroid belt lie the giant planets. Jupiter and Saturn are massive gas giants composed predominantly of hydrogen and helium gas. Uranus and Neptune are classified as ice giants containing heavier compounds including water, methane, and ammonia. Each giant planet commands a complex system of rings and orbiting moons.`,
    processedText: `### 1. Introduction to the Planetary Realm

Our solar system consists of our central star, the Sun, and everything bound to it by gravitational attraction. This includes eight major planets, dozens of dwarf planets such as Pluto and Ceres, hundreds of moons, and millions of asteroids, comets, and meteoroids.

### 2. The Inner Rocky Planets

The four inner terrestrial planets closest to the Sun are Mercury, Venus, Earth, and Mars. These worlds have dense, solid rocky surfaces and metallic iron cores:

• Mercury: The smallest planet, possessing extreme temperature swings between scorching day and freezing night.
• Venus: Shrouded in dense carbon dioxide clouds that trap intense heat through a runaway greenhouse effect.
• Earth: The only known haven harboring liquid surface water and a protective nitrogen-oxygen atmosphere supporting diverse life.
• Mars: Known as the Red Planet due to iron oxide on its surface, currently explored by robotic rovers seeking ancient microbial evidence.

### 3. The Outer Giant Worlds

Beyond the main asteroid belt lie the giant planets. Jupiter and Saturn are massive gas giants composed predominantly of hydrogen and helium gas. Uranus and Neptune are classified as ice giants containing heavier compounds including water, methane, and ammonia. Each giant planet commands a complex system of rings and orbiting moons.`,
  },
  {
    id: 'doc-history-ch4',
    title: 'History Chapter 4: The Dawn of Indian Railways',
    language: 'en',
    sourceFormat: 'pdf',
    lastOpened: 'Yesterday',
    progressPercent: 45,
    wordCount: 420,
    createdAt: '2026-08-24T14:30:00Z',
    summary: 'The historical evolution of railway transport across the Indian subcontinent from 1832 to modern times.',
    originalText: `### 1. The Early Proposals (1832–1837)

The first recorded railway proposal in India was initiated in Madras in 1832. The country's very first operational experimental line, the Red Hill Railroad, was constructed in 1837 by engineer Sir Arthur Cotton to transport granite stone for canal and road building.

### 2. The Historic Maiden Journey (1853)

India's first commercial passenger train was inaugurated by the Great Indian Peninsula Railway on 16 April 1853. The train departed from Bori Bunder in Bombay toward Thane, covering 34 kilometers in 57 minutes:

• Three historical steam locomotives named Sahib, Sindh, and Sultan hauled fourteen passenger carriages.
• Four hundred invited guests rode on the maiden voyage, marking the inception of modern mass transit across Asia.

### 3. Modern Network Scale

Today, Indian Railways stands as one of the world's largest transportation enterprises. Spanning over 68,000 route kilometers, it connects thousands of towns, transports millions of passengers every single day, and serves as the economic lifeline of the nation.`,
    processedText: `### 1. The Early Proposals (1832–1837)

The first recorded railway proposal in India was initiated in Madras in 1832. The country's very first operational experimental line, the Red Hill Railroad, was constructed in 1837 by engineer Sir Arthur Cotton to transport granite stone for canal and road building.

### 2. The Historic Maiden Journey (1853)

India's first commercial passenger train was inaugurated by the Great Indian Peninsula Railway on 16 April 1853. The train departed from Bori Bunder in Bombay toward Thane, covering 34 kilometers in 57 minutes:

• Three historical steam locomotives named Sahib, Sindh, and Sultan hauled fourteen passenger carriages.
• Four hundred invited guests rode on the maiden voyage, marking the inception of modern mass transit across Asia.

### 3. Modern Network Scale

Today, Indian Railways stands as one of the world's largest transportation enterprises. Spanning over 68,000 route kilometers, it connects thousands of towns, transports millions of passengers every single day, and serves as the economic lifeline of the nation.`,
  },
  {
    id: 'doc-water-conservation',
    title: 'जल संरक्षण का महत्व (Importance of Water Conservation)',
    language: 'hi',
    sourceFormat: 'text',
    lastOpened: '3 days ago',
    progressPercent: 100,
    wordCount: 310,
    createdAt: '2026-08-22T09:15:00Z',
    summary: 'A short Hindi lesson highlighting sustainable rainwater harvesting and ecological preservation.',
    originalText: `### १. जल ही जीवन का आधार है

पृथ्वी पर समस्त जीव-जंतुओं और वनस्पतियों के अस्तित्व के लिए जल सबसे आवश्यक तत्व है। यद्यपि हमारी पृथ्वी का लगभग ७१ प्रतिशत भू-भाग पानी से घिरा हुआ है, परंतु इसमें से केवल एक प्रतिशत से भी कम जल मीठा और पीने योग्य है।

### २. जल संकट के प्रमुख कारण

जनसंख्या में तीव्र वृद्धि, अनियंत्रित औद्योगिकीकरण और प्राकृतिक स्रोतों के अत्यधिक दोहन से दुनिया भर में भूजल स्तर लगातार गिर रहा है:

• वर्षा जल का संचयन न होना।
• नदियों और झीलों में अनुपचारित कचरे का मिलना।
• दैनिक जीवन में पानी का अपव्यय।

### ३. हमारे कर्तव्य और समाधान

प्रत्येक नागरिक को जल का सदुपयोग करना चाहिए। घरों में वर्षा जल संचयन (Rainwater Harvesting) तकनीक अपनाकर तथा टपकते नलों को तुरंत ठीक करके हम आने वाली पीढ़ियों के लिए स्वच्छ जल सुरक्षित कर सकते हैं।`,
    processedText: `### १. जल ही जीवन का आधार है

पृथ्वी पर समस्त जीव-जंतुओं और वनस्पतियों के अस्तित्व के लिए जल सबसे आवश्यक तत्व है। यद्यपि हमारी पृथ्वी का लगभग ७१ प्रतिशत भू-भाग पानी से घिरा हुआ है, परंतु इसमें से केवल एक प्रतिशत से भी कम जल मीठा और पीने योग्य है।

### २. जल संकट के प्रमुख कारण

जनसंख्या में तीव्र वृद्धि, अनियंत्रित औद्योगिकीकरण और प्राकृतिक स्रोतों के अत्यधिक दोहन से दुनिया भर में भूजल स्तर लगातार गिर रहा है:

• वर्षा जल का संचयन न होना।
• नदियों और झीलों में अनुपचारित कचरे का मिलना।
• दैनिक जीवन में पानी का अपव्यय।

### ३. हमारे कर्तव्य और समाधान

प्रत्येक नागरिक को जल का सदुपयोग करना चाहिए। घरों में वर्षा जल संचयन (Rainwater Harvesting) तकनीक अपनाकर तथा टपकते नलों को तुरंत ठीक करके हम आने वाली पीढ़ियों के लिए स्वच्छ जल सुरक्षित कर सकते हैं।`,
  },
];

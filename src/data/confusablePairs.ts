export interface ScriptConfusablePair {
  pair: string;
  charA: string;
  charB: string;
  label: string;
  description: string;
}

export interface LanguageConfusables {
  scriptName: string;
  languageName: string;
  pairs: ScriptConfusablePair[];
}

export const LANGUAGE_CONFUSABLES: Record<string, LanguageConfusables> = {
  // English & Latin
  en: {
    scriptName: 'Latin',
    languageName: 'English',
    pairs: [
      { pair: 'b/d', charA: 'b', charB: 'd', label: 'b / d', description: 'Horizontal mirror ascenders' },
      { pair: 'p/q', charA: 'p', charB: 'q', label: 'p / q', description: 'Horizontal mirror descenders' },
      { pair: 'm/w', charA: 'm', charB: 'w', label: 'm / w', description: 'Vertical inversion' },
      { pair: 'n/u', charA: 'n', charB: 'u', label: 'n / u', description: 'Vertical inversion' },
      { pair: 's/z', charA: 's', charB: 'z', label: 's / z', description: 'Angular vs curved tracking' }
    ]
  },
  // Hindi (Devanagari)
  hi: {
    scriptName: 'Devanagari',
    languageName: 'Hindi (हिन्दी)',
    pairs: [
      { pair: 'ब/व', charA: 'ब', charB: 'व', label: 'ब / व', description: 'Diagonal inner slash distinction (ba vs va)' },
      { pair: 'भ/म', charA: 'भ', charB: 'म', label: 'भ / म', description: 'Open top loop & broken shirorekha (bha vs ma)' },
      { pair: 'घ/ध', charA: 'घ', charB: 'ध', label: 'घ / ध', description: 'Top spiral loop & broken top bar (gha vs dha)' },
      { pair: 'प/ष', charA: 'प', charB: 'ष', label: 'प / ष', description: 'Diagonal retroflex slash (pa vs sha)' },
      { pair: 'थ/य', charA: 'थ', charB: 'य', label: 'थ / य', description: 'Aperture curl & broken bar (tha vs ya)' },
      { pair: 'ड/ढ', charA: 'ड', charB: 'ढ', label: 'ड / ढ', description: 'Open tail vs closed curl (da vs dha)' }
    ]
  },
  // Marathi (Devanagari)
  mr: {
    scriptName: 'Devanagari',
    languageName: 'Marathi (मराठी)',
    pairs: [
      { pair: 'ब/व', charA: 'ब', charB: 'व', label: 'ब / व', description: 'Slash loop distinction (ba vs va)' },
      { pair: 'भ/म', charA: 'भ', charB: 'म', label: 'भ / म', description: 'Top aperture curl (bha vs ma)' },
      { pair: 'घ/ध', charA: 'घ', charB: 'ध', label: 'घ / ध', description: 'Broken shirorekha bar (gha vs dha)' },
      { pair: 'प/ष', charA: 'प', charB: 'ष', label: 'प / ष', description: 'Internal diagonal slash (pa vs sha)' },
      { pair: 'थ/य', charA: 'थ', charB: 'य', label: 'थ / य', description: 'Top circle aperture (tha vs ya)' },
      { pair: 'श/स', charA: 'श', charB: 'स', label: 'श / स', description: 'Curved loop vs angular hook (sha vs sa)' }
    ]
  },
  // Bengali
  bn: {
    scriptName: 'Bengali',
    languageName: 'Bengali (বাংলা)',
    pairs: [
      { pair: 'ব/র', charA: 'ব', charB: 'র', label: 'ব / র', description: 'Bottom dot distinction (ba vs ra)' },
      { pair: 'ক/ধ', charA: 'ক', charB: 'ধ', label: 'ক / ধ', description: 'Central cross loop (ka vs dha)' },
      { pair: 'ঘ/য', charA: 'ঘ', charB: 'য', label: 'ঘ / য', description: 'Shoulder curve symmetry (gha vs ya)' },
      { pair: 'প/ষ', charA: 'প', charB: 'ষ', label: 'প / ষ', description: 'Inner diagonal cross (pa vs sha)' },
      { pair: 'ড/ঢ', charA: 'ড', charB: 'ঢ', label: 'ড / ঢ', description: 'Tail loop closure (da vs dha)' }
    ]
  },
  // Tamil
  ta: {
    scriptName: 'Tamil',
    languageName: 'Tamil (தமிழ்)',
    pairs: [
      { pair: 'ர/ஈ', charA: 'ர', charB: 'ஈ', label: 'ர / ஈ', description: 'Single loop vs dual dot vowel (ra vs ii)' },
      { pair: 'ண/ன', charA: 'ண', charB: 'ன', label: 'ண / ன', description: 'Triple loop vs double loop (retroflex na vs dental na)' },
      { pair: 'ப/ய', charA: 'ப', charB: 'ய', label: 'ப / ய', description: 'Square cup vs central indent (pa vs ya)' },
      { pair: 'ல/ள', charA: 'ல', charB: 'ள', label: 'ல / ள', description: 'Lateral vs retroflex loop (la vs la)' }
    ]
  },
  // Telugu
  te: {
    scriptName: 'Telugu',
    languageName: 'Telugu (తెలుగు)',
    pairs: [
      { pair: 'బ/భ', charA: 'బ', charB: 'భ', label: 'బ / భ', description: 'Aspiration tick mark (ba vs bha)' },
      { pair: 'ఘ/ధ', charA: 'ఘ', charB: 'ధ', label: 'ఘ / ధ', description: 'Vowel headstroke position (gha vs dha)' },
      { pair: 'ప/వ', charA: 'ప', charB: 'వ', label: 'ప / వ', description: 'Top loop closure angle (pa vs va)' },
      { pair: 'ర/రి', charA: 'ర', charB: 'రి', label: 'ర / రి', description: 'Circle base vs matra curl (ra vs ri)' }
    ]
  },
  // Gujarati
  gu: {
    scriptName: 'Gujarati',
    languageName: 'Gujarati (ગુજરાતી)',
    pairs: [
      { pair: 'બ/વ', charA: 'બ', charB: 'વ', label: 'બ / વ', description: 'Inner slash distinction (ba vs va)' },
      { pair: 'ભ/મ', charA: 'ભ', charB: 'મ', label: 'ભ / મ', description: 'Left circular loop (bha vs ma)' },
      { pair: 'ઘ/ધ', charA: 'ઘ', charB: 'ધ', label: 'ઘ / ધ', description: 'Upper aperture opening (gha vs dha)' },
      { pair: 'પ/ષ', charA: 'પ', charB: 'ષ', label: 'પ / ષ', description: 'Internal diagonal slash (pa vs sha)' },
      { pair: 'થ/ય', charA: 'થ', charB: 'ય', label: 'થ / ય', description: 'Top swirl loop (tha vs ya)' }
    ]
  },
  // Kannada
  kn: {
    scriptName: 'Kannada',
    languageName: 'Kannada (ಕನ್ನಡ)',
    pairs: [
      { pair: 'ಬ/ಭ', charA: 'ಬ', charB: 'ಭ', label: 'ಬ / ಭ', description: 'Aspiration center tick (ba vs bha)' },
      { pair: 'ಪ/ವ', charA: 'ಪ', charB: 'ವ', label: 'ಪ / ವ', description: 'Aperture closure position (pa vs va)' },
      { pair: 'ಘ/ಧ', charA: 'ಘ', charB: 'ಧ', label: 'ಘ / ಧ', description: 'Headstroke curve alignment (gha vs dha)' }
    ]
  },
  // Punjabi (Gurmukhi)
  pa: {
    scriptName: 'Gurmukhi',
    languageName: 'Punjabi (ਪੰਜਾਬੀ)',
    pairs: [
      { pair: 'ਖ/ਥ', charA: 'ਖ', charB: 'ਥ', label: 'ਖ / ਥ', description: 'Top horizontal bar closure (kha vs tha)' },
      { pair: 'ਘ/ਧ', charA: 'ਘ', charB: 'ਧ', label: 'ਘ / ਧ', description: 'Center vertical split (gha vs dha)' },
      { pair: 'ਦ/ਢ', charA: 'ਦ', charB: 'ਢ', label: 'ਦ / ਢ', description: 'Tail descent vs bottom curl (da vs dha)' }
    ]
  },
  // Odia
  or: {
    scriptName: 'Odia',
    languageName: 'Odia (ଓଡ଼ିଆ)',
    pairs: [
      { pair: 'ବ/ର', charA: 'ବ', charB: 'ର', label: 'ବ / ର', description: 'Dot indicator accent (ba vs ra)' },
      { pair: 'ପ/ଷ', charA: 'ପ', charB: 'ଷ', label: 'ପ / ଷ', description: 'Internal cross stroke (pa vs sha)' },
      { pair: 'ଢ/ଡ', charA: 'ଢ', charB: 'ଡ', label: 'ଢ / ଡ', description: 'Closed curl vs curve (dha vs da)' }
    ]
  },
  // Malayalam
  ml: {
    scriptName: 'Malayalam',
    languageName: 'Malayalam (മലയാളം)',
    pairs: [
      { pair: 'പ/വ', charA: 'പ', charB: 'വ', label: 'പ / വ', description: 'Rounded loop curvature (pa vs va)' },
      { pair: 'റ/റ്റ', charA: 'റ', charB: 'റ്റ', label: 'റ / റ്റ', description: 'Single vs doubled alveolar (ra vs tta)' },
      { pair: 'ബ/ഭ', charA: 'ബ', charB: 'ഭ', label: 'ബ / ഭ', description: 'Aspiration loop curl (ba vs bha)' }
    ]
  },
  // Spanish & French
  es: {
    scriptName: 'Latin',
    languageName: 'Spanish (Español)',
    pairs: [
      { pair: 'b/d', charA: 'b', charB: 'd', label: 'b / d', description: 'Horizontal mirror ascenders' },
      { pair: 'p/q', charA: 'p', charB: 'q', label: 'p / q', description: 'Horizontal mirror descenders' },
      { pair: 'm/w', charA: 'm', charB: 'w', label: 'm / w', description: 'Vertical inversion' },
      { pair: 'n/u', charA: 'n', charB: 'u', label: 'n / u', description: 'Vertical inversion' }
    ]
  },
  fr: {
    scriptName: 'Latin',
    languageName: 'French (Français)',
    pairs: [
      { pair: 'b/d', charA: 'b', charB: 'd', label: 'b / d', description: 'Horizontal mirror ascenders' },
      { pair: 'p/q', charA: 'p', charB: 'q', label: 'p / q', description: 'Horizontal mirror descenders' },
      { pair: 'm/w', charA: 'm', charB: 'w', label: 'm / w', description: 'Vertical inversion' },
      { pair: 'n/u', charA: 'n', charB: 'u', label: 'n / u', description: 'Vertical inversion' }
    ]
  }
};

/**
 * Resolves the confusable pairs for a given language code (e.g. 'hi-IN', 'hi', 'en-IN', 'ta').
 */
export function getConfusablesForLanguage(langCode: string): LanguageConfusables {
  const normalized = (langCode || 'en').split('-')[0].toLowerCase();
  return LANGUAGE_CONFUSABLES[normalized] || LANGUAGE_CONFUSABLES.en;
}

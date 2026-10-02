export type ScriptName =
  | 'Latin'
  | 'Devanagari'
  | 'Odia'
  | 'Bengali'
  | 'Tamil'
  | 'Telugu'
  | 'Gujarati'
  | 'Kannada'
  | 'Malayalam'
  | 'Gurmukhi'
  | 'Arabic';

export interface LanguageDefinition {
  code: string;                  // BCP-47 (e.g. 'hi-IN', 'or-IN')
  isoCode: string;               // 2-letter ISO (e.g. 'hi', 'or')
  name: string;                  // English name ('Hindi', 'Odia')
  nativeName: string;            // Native script name ('हिन्दी', 'ଓଡ଼ିଆ')
  script: ScriptName;            // Script family name
  unicodeRange: [number, number][]; // Unicode code point ranges
  sarvamCode?: string;           // Code used for Sarvam Mayura/Bulbul (e.g. 'od-IN')
  googleCode: string;            // Google translate code (e.g. 'hi', 'or')
  webSpeechLang: string;         // Browser Web Speech API lang code
  fontStack: string;             // Recommended CSS font fallback
  isIndic: boolean;              // True for Indic languages
  isRTL: boolean;                // True for right-to-left scripts
  supportsConfusableHighlight: boolean; // True for Latin; Indic uses whole-unit rendering
  sampleText: string;            // Calibration & dyslexia test sample
}

export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
  {
    code: 'en-US',
    isoCode: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    unicodeRange: [[0x0020, 0x007F], [0x00A0, 0x024F]],
    sarvamCode: 'en-IN',
    googleCode: 'en',
    webSpeechLang: 'en-US',
    fontStack: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    isIndic: false,
    isRTL: false,
    supportsConfusableHighlight: true,
    sampleText: 'The great blue heron stepped silently through the shallow riverbed, searching for small silver fish under the sunlight.'
  },
  {
    code: 'hi-IN',
    isoCode: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    unicodeRange: [[0x0900, 0x097F]],
    sarvamCode: 'hi-IN',
    googleCode: 'hi',
    webSpeechLang: 'hi-IN',
    fontStack: "'Noto Sans Devanagari', 'Mangal', 'Kohinoor Devanagari', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'नदी के शांत किनारे पर सारस चुपचाप चल रहा था और धूप में छोटी मछलियों की तलाश कर रहा था।'
  },
  {
    code: 'or-IN',
    isoCode: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    unicodeRange: [[0x0B00, 0x0B7F]],
    sarvamCode: 'od-IN',
    googleCode: 'or',
    webSpeechLang: 'or-IN',
    fontStack: "'Noto Sans Oriya', 'Kalinga', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'ଶାନ୍ତ ନଦୀ କୂଳରେ ବଗଟି ନିଶବ୍ଦରେ ଚାଲି ଚାଲି ସୂର୍ଯ୍ୟ କିରଣ ତଳେ ଛୋଟ ମାଛ ଖୋଜୁଥିଲା।'
  },
  {
    code: 'bn-IN',
    isoCode: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    unicodeRange: [[0x0980, 0x09FF]],
    sarvamCode: 'bn-IN',
    googleCode: 'bn',
    webSpeechLang: 'bn-IN',
    fontStack: "'Noto Sans Bengali', 'Vrinda', 'SolaimanLipi', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'শান্ত নদীর তীরে বকটি নিঃশব্দে হেঁটে যাচ্ছিল এবং সূর্যালোকের নিচে ছোট মাছের সন্ধান করছিল।'
  },
  {
    code: 'ta-IN',
    isoCode: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    unicodeRange: [[0x0B80, 0x0BFF]],
    sarvamCode: 'ta-IN',
    googleCode: 'ta',
    webSpeechLang: 'ta-IN',
    fontStack: "'Noto Sans Tamil', 'Latha', 'Vijaya', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'அமைதியான ஆற்றங்கரையில் கொக்கு அமைதியாக நடந்து, சூரிய ஒளியில் சிறிய மீன்களைத் தேடிக்கொண்டிருந்தது.'
  },
  {
    code: 'te-IN',
    isoCode: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    unicodeRange: [[0x0C00, 0x0C7F]],
    sarvamCode: 'te-IN',
    googleCode: 'te',
    webSpeechLang: 'te-IN',
    fontStack: "'Noto Sans Telugu', 'Gautami', 'Vani', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'నిశ్శబ్దమైన నదీ తీరంలో కొంగ నిశ్శబ్దంగా నడుస్తూ ఎండలో చిన్న చేపల కోసం వెతుకుతోంది.'
  },
  {
    code: 'mr-IN',
    isoCode: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    unicodeRange: [[0x0900, 0x097F]],
    sarvamCode: 'mr-IN',
    googleCode: 'mr',
    webSpeechLang: 'mr-IN',
    fontStack: "'Noto Sans Devanagari', 'Mangal', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'शांत नदीकाठी बगळा सावकाश चालत उन्हात लहान माशांचा शोध घेत होता.'
  },
  {
    code: 'gu-IN',
    isoCode: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    unicodeRange: [[0x0A80, 0x0AFF]],
    sarvamCode: 'gu-IN',
    googleCode: 'gu',
    webSpeechLang: 'gu-IN',
    fontStack: "'Noto Sans Gujarati', 'Shruti', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'શાંત નદીના કિનારે બગલો ધીમે ધીમે ચાલીને સૂર્યપ્રકાશમાં નાની માછલીઓની શોધ કરી રહ્યો હતો.'
  },
  {
    code: 'kn-IN',
    isoCode: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    unicodeRange: [[0x0C80, 0x0CFF]],
    sarvamCode: 'kn-IN',
    googleCode: 'kn',
    webSpeechLang: 'kn-IN',
    fontStack: "'Noto Sans Kannada', 'Tunga', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'ಶಾಂತ ನದಿಯ ದಡದಲ್ಲಿ ಬಕಪಕ್ಷಿಯು ನಿಶ್ಯಬ್ದವಾಗಿ ಹೆಜ್ಜೆ ಇಡುತ್ತಾ ಬಿಸಿಲಿನಲ್ಲಿ ಸಣ್ಣ ಮೀನುಗಳನ್ನು ಹುಡುಕುತ್ತಿತ್ತು.'
  },
  {
    code: 'ml-IN',
    isoCode: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    unicodeRange: [[0x0D00, 0x0D7F]],
    sarvamCode: 'ml-IN',
    googleCode: 'ml',
    webSpeechLang: 'ml-IN',
    fontStack: "'Noto Sans Malayalam', 'Kartika', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'ശാന്തമായ നദിക്കരയിലൂടെ കൊക്ക് നിശബ്ദമായി നടന്ന് സൂര്യപ്രകാശത്തിൽ ചെറിയ മീനുകളെ തിരയുകയായിരുന്നു.'
  },
  {
    code: 'pa-IN',
    isoCode: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    unicodeRange: [[0x0A00, 0x0A7F]],
    sarvamCode: 'pa-IN',
    googleCode: 'pa',
    webSpeechLang: 'pa-IN',
    fontStack: "'Noto Sans Gurmukhi', 'Raavi', sans-serif",
    isIndic: true,
    isRTL: false,
    supportsConfusableHighlight: false,
    sampleText: 'ਸ਼ਾਂਤ ਨਦੀ ਦੇ ਕੰਢੇ ਬਗਲਾ ਹੌਲੀ-ਹੌਲੀ ਤੁਰਦਾ ਹੋਇਆ ਧੁੱਪ ਵਿੱਚ ਛੋਟੀਆਂ ਮੱਛੀਆਂ ਦੀ ਭਾਲ ਕਰ ਰਿਹਾ ਸੀ।'
  }
];

export const LANGUAGE_MAP = new Map<string, LanguageDefinition>();
SUPPORTED_LANGUAGES.forEach(lang => {
  LANGUAGE_MAP.set(lang.isoCode.toLowerCase(), lang);
  LANGUAGE_MAP.set(lang.code.toLowerCase(), lang);
  if (lang.sarvamCode) {
    LANGUAGE_MAP.set(lang.sarvamCode.toLowerCase(), lang);
  }
});

// Quick helper to resolve language by ISO code, BCP-47, or Sarvam code
export function getLanguage(codeOrIso: string): LanguageDefinition {
  if (!codeOrIso) return SUPPORTED_LANGUAGES[0];
  const normalized = codeOrIso.toLowerCase().trim();
  const direct = LANGUAGE_MAP.get(normalized);
  if (direct) return direct;

  const prefix = normalized.split(/[-_]/)[0];
  const fromPrefix = LANGUAGE_MAP.get(prefix);
  if (fromPrefix) return fromPrefix;

  // Odia alias check ('od' vs 'or')
  if (prefix === 'od') return LANGUAGE_MAP.get('or') || SUPPORTED_LANGUAGES[0];

  return SUPPORTED_LANGUAGES[0];
}

import { DocumentItem, FontFamily, LanguageOption, ReadingProfile, ThemePreset } from '@/types';

// Default starting profile based on British Dyslexia Association & Dyslexia Scotland research
export const DEFAULT_READING_PROFILE: ReadingProfile = {
  id: 'default-profile',
  userId: null,
  fontFamily: 'Open Sans',
  fontSize: 18,
  fontWeight: 400,
  lineHeight: 1.6, // 1.5x to 1.8x
  letterSpacing: 0.03, // 0.03em (+35% average tracking)
  wordSpacing: 0.15, // 0.15em (approx 3.5x letter spacing)
  paragraphSpacing: 32, // 32px vertical rhythm
  backgroundColor: '#fbf9f8', // Warm cream anti-glare
  textColor: '#1b1c1c', // Soft dark charcoal
  themePreset: 'warm-cream',
  textAlign: 'left', // Strictly left-aligned
  maxCharactersPerLine: 65, // 60-70 characters per line
  readingRulerEnabled: false,
  readingRulerHeight: 44,
  syllableHighlighting: false,
  simplifyLevel: 'off',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

export const AVAILABLE_FONTS: { id: FontFamily; name: string; category: string; description: string }[] = [
  { id: 'Open Sans', name: 'Open Sans', category: 'Standard High-Legibility', description: 'Wide apertures & distinct character forms' },
  { id: 'Lexend', name: 'Lexend', category: 'Dyslexia-Optimized', description: 'Specifically designed to reduce visual crowding' },
  { id: 'Atkinson Hyperlegible', name: 'Atkinson Hyperlegible', category: 'Low Vision / Accessibility', description: 'Distinguishes ambiguous characters (e.g., I, 1, l)' },
  { id: 'Arial', name: 'Arial', category: 'Standard Sans', description: 'Familiar clean sans-serif' },
  { id: 'Verdana', name: 'Verdana', category: 'Standard Sans', description: 'Generous character width and open counters' },
  { id: 'Tahoma', name: 'Tahoma', category: 'Standard Sans', description: 'Clear letter boundaries' },
  { id: 'Century Gothic', name: 'Century Gothic', category: 'Geometric Sans', description: 'Round open bowls' },
  { id: 'Calibri', name: 'Calibri', category: 'Humanist Sans', description: 'Softened stems and clean layout' },
  { id: 'OpenDyslexic', name: 'OpenDyslexic', category: 'Specialized', description: 'Weighted letter bottoms to prevent flipping' },
];

export const THEME_PRESETS: { id: ThemePreset; name: string; bg: string; text: string; description: string }[] = [
  { id: 'warm-cream', name: 'Warm Cream', bg: '#fbf9f8', text: '#1b1c1c', description: 'Anti-glare soft ivory canvas (Recommended)' },
  { id: 'soft-peach', name: 'Soft Peach', bg: '#fff5ee', text: '#2d2424', description: 'Gentle warmth reducing visual stress' },
  { id: 'mint-tint', name: 'Mint Tint', bg: '#f2f8f5', text: '#1c2826', description: 'Cool calming background for prolonged focus' },
  { id: 'high-contrast-dark', name: 'Dark Mode', bg: '#1e1e1e', text: '#f3f0f0', description: 'High contrast with low ambient brightness' },
  { id: 'standard-white', name: 'Pure Paper', bg: '#ffffff', text: '#111111', description: 'High contrast standard clean paper' },
];

export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'The Wonders of the Solar System',
    language: 'en',
    sourceFormat: 'text',
    lastOpened: '2 hours ago',
    progressPercent: 45,
    wordCount: 380,
    createdAt: '2026-08-25T10:00:00Z',
    originalText: `Our solar system consists of our star, the Sun, and everything bound to it by gravity — the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets such as Pluto; dozens of moons; and millions of asteroids, comets, and meteoroids.

The inner, rocky planets are Mercury, Venus, Earth, and Mars. NASA's newest rover on Mars is actively exploring the surface to seek signs of ancient microbial life and cache rock samples. Beyond Mars lies the asteroid belt, a vast region containing thousands of rocky fragments left over from the formation of the solar system.

The giant planets occupy the outer realm of our solar system. Jupiter and Saturn are gas giants composed mostly of hydrogen and helium, while Uranus and Neptune are ice giants containing heavier elements like water, ammonia, and methane. Each of these massive worlds hosts a fascinating system of rings and moons.`,
    processedText: `Our solar system consists of our star, the Sun, and everything bound to it by gravity — the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets such as Pluto; dozens of moons; and millions of asteroids, comets, and meteoroids.

The inner, rocky planets are Mercury, Venus, Earth, and Mars. NASA's newest rover on Mars is actively exploring the surface to seek signs of ancient microbial life and cache rock samples. Beyond Mars lies the asteroid belt, a vast region containing thousands of rocky fragments left over from the formation of the solar system.

The giant planets occupy the outer realm of our solar system. Jupiter and Saturn are gas giants composed mostly of hydrogen and helium, while Uranus and Neptune are ice giants containing heavier elements like water, ammonia, and methane. Each of these massive worlds hosts a fascinating system of rings and moons.`,
  },
  {
    id: 'doc-2',
    title: 'History of the Indian Railways',
    language: 'en',
    sourceFormat: 'pdf',
    lastOpened: 'Yesterday',
    progressPercent: 80,
    wordCount: 520,
    createdAt: '2026-08-24T14:30:00Z',
    originalText: `The first railway proposal for India was made in Madras in 1832. The country's first train, the Red Hill Railway, was built by Sir Arthur Cotton to transport granite stone for road building in 1837. 

India's first passenger train, operated by the Great Indian Peninsula Railway, ran between Bori Bunder in Mumbai and Thane on 16 April 1853. The train was hauled by three steam locomotives named Sahib, Sindh, and Sultan. The train traveled a distance of 34 kilometers in about 57 minutes, carrying 400 people across fourteen carriages.

Today, Indian Railways is the national railway system of India operated by the Ministry of Railways. It manages the fourth-largest national railway system in the world by size, comprising over 68,000 route kilometers and carrying millions of passengers every single day.`,
    processedText: `The first railway proposal for India was made in Madras in 1832. The country's first train, the Red Hill Railway, was built by Sir Arthur Cotton to transport granite stone for road building in 1837. 

India's first passenger train, operated by the Great Indian Peninsula Railway, ran between Bori Bunder in Mumbai and Thane on 16 April 1853. The train was hauled by three steam locomotives named Sahib, Sindh, and Sultan. The train traveled a distance of 34 kilometers in about 57 minutes, carrying 400 people across fourteen carriages.

Today, Indian Railways is the national railway system of India operated by the Ministry of Railways. It manages the fourth-largest national railway system in the world by size, comprising over 68,000 route kilometers and carrying millions of passengers every single day.`,
  },
  {
    id: 'doc-3',
    title: 'जल संरक्षण का महत्व (Importance of Water Conservation)',
    language: 'hi',
    sourceFormat: 'text',
    lastOpened: '3 days ago',
    progressPercent: 100,
    wordCount: 290,
    createdAt: '2026-08-22T09:15:00Z',
    originalText: `जल ही जीवन है। पृथ्वी पर जीवन को बनाए रखने के लिए पानी सबसे आवश्यक तत्वों में से एक है। यद्यपि पृथ्वी का लगभग 71 प्रतिशत हिस्सा पानी से ढका है, लेकिन इसमें से केवल एक बहुत छोटा हिस्सा ही पीने योग्य स्वच्छ जल है।

जनसंख्या वृद्धि और औद्योगिकीकरण के कारण जल संकट बढ़ रहा है। इसलिए हमें वर्षा जल संचयन (Rainwater Harvesting) अपनाना चाहिए और पानी की हर बूंद का सदुपयोग करना चाहिए। जागरूक नागरिक बनकर ही हम अपने भविष्य को सुरक्षित कर सकते हैं।`,
    processedText: `जल ही जीवन है। पृथ्वी पर जीवन को बनाए रखने के लिए पानी सबसे आवश्यक तत्वों में से एक है। यद्यपि पृथ्वी का लगभग 71 प्रतिशत हिस्सा पानी से ढका है, लेकिन इसमें से केवल एक बहुत छोटा हिस्सा ही पीने योग्य स्वच्छ जल है।

जनसंख्या वृद्धि और औद्योगिकीकरण के कारण जल संकट बढ़ रहा है। इसलिए हमें वर्षा जल संचयन (Rainwater Harvesting) अपनाना चाहिए और पानी की हर बूंद का सदुपयोग करना चाहिए। जागरूक नागरिक बनकर ही हम अपने भविष्य को सुरक्षित कर सकते हैं।`,
  },
];

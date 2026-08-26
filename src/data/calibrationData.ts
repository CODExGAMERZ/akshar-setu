import { CalibrationRound } from '../types';

export const CALIBRATION_SAMPLE_TEXT = 
  "The great blue heron stepped silently through the shallow riverbed, searching for small silver fish under the sunlight.";

export const CALIBRATION_ROUNDS: CalibrationRound[] = [
  {
    id: 1,
    title: "Round 1: Typography & Letter Shapes",
    subtitle: "Select the font style that feels clearest and least crowded to your eyes.",
    roundType: "typography",
    sampleText: CALIBRATION_SAMPLE_TEXT,
    options: [
      {
        id: "font_lexend",
        title: "Lexend Fluidity",
        description: "Engineered specifically to expand letter widths and reduce visual crowding.",
        badge: "High Fluency",
        previewSettings: {
          font: "Lexend",
          fontSize: 19,
          boldness: 450,
          letterSpacing: 0.04
        }
      },
      {
        id: "font_atkinson",
        title: "Atkinson Hyperlegible",
        description: "Distinctive character shapes (unambiguous 'b', 'd', '1', 'I') designed by the Braille Institute.",
        badge: "Disambiguated Shapes",
        previewSettings: {
          font: "Atkinson Hyperlegible",
          fontSize: 20,
          boldness: 500,
          letterSpacing: 0.06
        }
      },
      {
        id: "font_opendyslexic",
        title: "OpenDyslexic Heavy Base",
        description: "Bottom-weighted letterforms designed to help prevent visual letter flipping.",
        badge: "Gravity Anchored",
        previewSettings: {
          font: "OpenDyslexic",
          fontSize: 18,
          boldness: 400,
          letterSpacing: 0.05
        }
      },
      {
        id: "font_comic_neue",
        title: "Comic Neue Organic",
        description: "Informal, friendly organic curves that soften sharp angles and tracking tension.",
        badge: "Soft Curves",
        previewSettings: {
          font: "Comic Neue",
          fontSize: 20,
          boldness: 500,
          letterSpacing: 0.05
        }
      }
    ]
  },
  {
    id: 2,
    title: "Round 2: Spacing & Line Height",
    subtitle: "Which line and word spacing allows your gaze to track effortlessly without losing your place?",
    roundType: "spacing",
    sampleText: CALIBRATION_SAMPLE_TEXT,
    options: [
      {
        id: "spacing_spacious",
        title: "Expansive & Relaxed",
        description: "Wide line gaps (2.0x) and extended word boundaries for readers who experience rivering.",
        badge: "Maximum Breath",
        previewSettings: {
          lineSpacing: 2.1,
          wordSpacing: 0.18,
          letterSpacing: 0.06
        }
      },
      {
        id: "spacing_balanced",
        title: "Balanced Rhythm",
        description: "Comfortable 1.8x line height with natural word rhythm.",
        badge: "Recommended",
        previewSettings: {
          lineSpacing: 1.8,
          wordSpacing: 0.10,
          letterSpacing: 0.03
        }
      },
      {
        id: "spacing_compact_guided",
        title: "Tighter Tracking with Letter Spacing",
        description: "Standard 1.6x line height with slightly wider letter-to-letter spacing.",
        badge: "Compact Focus",
        previewSettings: {
          lineSpacing: 1.6,
          wordSpacing: 0.08,
          letterSpacing: 0.08
        }
      }
    ]
  },
  {
    id: 3,
    title: "Round 3: Anti-Glare Color Tint",
    subtitle: "Select the background surface that softens contrast and stops visual glare.",
    roundType: "theme",
    sampleText: CALIBRATION_SAMPLE_TEXT,
    options: [
      {
        id: "theme_warm_cream",
        title: "Ivory Clarity (Warm Cream #FEF9EB)",
        description: "Soft parchment tone that reduces eye vibration and strain while maintaining crisp contrast.",
        badge: "Gentle Daylight",
        previewSettings: {
          themeId: "warm-cream",
          backgroundColor: "#FEF9EB",
          textColor: "#26231E",
          highlightColor: "#FDE047"
        }
      },
      {
        id: "theme_soft_yellow",
        title: "Soft Solar Yellow",
        description: "Pale amber spectrum that counters scotopic sensitivity and stabilizes text jitter.",
        badge: "Amber Filter",
        previewSettings: {
          themeId: "anti-glare-soft-yellow",
          backgroundColor: "#FEF08A",
          textColor: "#1E1B18",
          highlightColor: "#FBBF24"
        }
      },
      {
        id: "theme_calm_sage",
        title: "Calm Sage Green",
        description: "Cool soothing botanical green known for reducing ocular muscle tension.",
        badge: "Restful Nature",
        previewSettings: {
          themeId: "calm-sage",
          backgroundColor: "#EDF5EC",
          textColor: "#1A2E1C",
          highlightColor: "#86EFAC"
        }
      },
      {
        id: "theme_slate_blue",
        title: "Peaceful Slate Blue",
        description: "Low-saturation blue surface that sharpens letter boundaries for visual thinkers.",
        badge: "Cool Ocean",
        previewSettings: {
          themeId: "slate-blue",
          backgroundColor: "#EEF4F8",
          textColor: "#1E2B37",
          highlightColor: "#93C5FD"
        }
      }
    ]
  },
  {
    id: 4,
    title: "Round 4: Highlighting & Visual Guidance",
    subtitle: "Choose how active spoken or focused text should guide your attention.",
    roundType: "highlighting",
    sampleText: CALIBRATION_SAMPLE_TEXT,
    options: [
      {
        id: "highlight_word",
        title: "Current Word Glow",
        description: "Illuminates one spoken or active word at a time for precise phonological synchronization.",
        badge: "Pacing Spotlight",
        previewSettings: {
          highlightMode: "word",
          highlightColor: "#FDE047"
        }
      },
      {
        id: "highlight_phrase",
        title: "Phrase / Chunk Highlighting",
        description: "Highlights natural semantic word clusters (3–5 words) to assist comprehension.",
        badge: "Semantic Chunks",
        previewSettings: {
          highlightMode: "phrase",
          highlightColor: "#FDE047"
        }
      },
      {
        id: "highlight_line",
        title: "Line Tracking Ruler",
        description: "Subtly accents the whole active reading line to prevent skipping up or down.",
        badge: "Line Guide",
        previewSettings: {
          highlightMode: "line",
          highlightColor: "#FEF08A"
        }
      },
      {
        id: "highlight_none",
        title: "Minimal Clean (No Highlighting)",
        description: "Keeps the page completely static without animated color backgrounds.",
        badge: "Zero Motion",
        previewSettings: {
          highlightMode: "none"
        }
      }
    ]
  },
  {
    id: 5,
    title: "Round 5: Final Personalized Calibration Check",
    subtitle: "Compare your calibrated settings against standard unadjusted textbook formatting.",
    roundType: "comparison",
    sampleText: "In the heart of the ancient forest, mighty redwood trees absorb morning mist through their needle-like leaves, sheltering owls, mosses, and clear streams.",
    options: [
      {
        id: "calibrated_choice",
        title: "Your Calibrated Environment",
        description: "Combines your preferred font, line height, warm anti-glare ivory background, and guidance.",
        badge: "Your Calibrated Match",
        previewSettings: {} // Will be filled dynamically from rounds 1-4
      },
      {
        id: "standard_unadjusted",
        title: "Standard Generic Baseline",
        description: "Standard Arial, tight line spacing (1.2), high-glare stark contrast without guidance.",
        badge: "Standard System",
        previewSettings: {
          font: "Arial",
          fontSize: 16,
          boldness: 400,
          letterSpacing: 0,
          wordSpacing: 0,
          lineSpacing: 1.3,
          backgroundColor: "#FFFFFF",
          textColor: "#111827",
          highlightMode: "none"
        }
      }
    ]
  }
];

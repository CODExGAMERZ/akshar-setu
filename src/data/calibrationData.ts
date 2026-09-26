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
    title: "Round 5: Confusable Letter Distinctions",
    subtitle: "Do you experience letter reversals like b/d, p/q, or m/w? Select the visual anchor style that helps most.",
    roundType: "confusable",
    sampleText: "The brave bird dipped past quiet ponds while morning shadows danced across the riverbed.",
    options: [
      {
        id: "confusable_weight",
        title: "Distinct Weight & Hue Accent",
        description: "Applies bold weight and subtle contrast tints to mirror letter pairs (b/d, p/q, s/z).",
        badge: "Bolder Shapes",
        previewSettings: {
          confusableLetterSettings: {
            enabled: true,
            activePairs: ['b/d', 'p/q', 'm/w', 'n/u', 's/z'],
            style: 'weight'
          }
        }
      },
      {
        id: "confusable_subtle",
        title: "Soft Background Glow Tints",
        description: "Pastel highlighting capsules under easily flipped letterforms to stop character switching.",
        badge: "Soft Pastel Glow",
        previewSettings: {
          confusableLetterSettings: {
            enabled: true,
            activePairs: ['b/d', 'p/q', 'm/w', 'n/u', 's/z'],
            style: 'subtle-color'
          }
        }
      },
      {
        id: "confusable_underline",
        title: "Directional Underline Anchors",
        description: "Crisp accent lines under confusable letters to give them strong directional grounding.",
        badge: "Underline Anchor",
        previewSettings: {
          confusableLetterSettings: {
            enabled: true,
            activePairs: ['b/d', 'p/q', 'm/w', 'n/u', 's/z'],
            style: 'underline'
          }
        }
      },
      {
        id: "confusable_none",
        title: "Natural Uniform Typography",
        description: "No special character coloring or weight alterations across confusable letters.",
        badge: "Standard Neutral",
        previewSettings: {
          confusableLetterSettings: {
            enabled: false,
            activePairs: [],
            style: 'weight'
          }
        }
      }
    ]
  },
  {
    id: 6,
    title: "Round 6: Audio Narration & Speech Cadence",
    subtitle: "Choose the read-aloud playback pace that best supports your auditory processing speed.",
    roundType: "audio",
    sampleText: "Natural synchronized voice narration guides your eyes across each word, ensuring comprehension and smooth tracking.",
    options: [
      {
        id: "audio_relaxed",
        title: "Relaxed & Measured (0.85x)",
        description: "Slightly slower cadence with breathing pauses between clauses for maximum processing time.",
        badge: "0.85x Speed",
        previewSettings: {
          ttsSpeed: 0.85
        }
      },
      {
        id: "audio_balanced",
        title: "Natural Conversational (1.0x)",
        description: "Standard human storytelling rhythm that balances fluency with clarity.",
        badge: "1.0x Recommended",
        previewSettings: {
          ttsSpeed: 1.0
        }
      },
      {
        id: "audio_brisk",
        title: "Dynamic & Fluid (1.15x)",
        description: "Energetic pace for readers who retain better when spoken text moves without pause.",
        badge: "1.15x Speed",
        previewSettings: {
          ttsSpeed: 1.15
        }
      }
    ]
  },
  {
    id: 7,
    title: "Round 7: Column Width & Reading Density",
    subtitle: "Select the horizontal line span that keeps your eye from wandering or losing vertical place.",
    roundType: "density",
    sampleText: "Shorter lines prevent ocular wandering during saccades, while wider spans provide expansive continuity for fast paragraph scanning.",
    options: [
      {
        id: "density_narrow",
        title: "Focused Column (~58 chars)",
        description: "Compact margins that prevent eye fatigue and eliminate horizontal head movement.",
        badge: "Max Focus",
        previewSettings: {
          textWidth: 58,
          paragraphSpacing: 1.75
        }
      },
      {
        id: "density_balanced",
        title: "Editorial Standard (~68 chars)",
        description: "Classic typography proportion offering effortless saccadic line returns.",
        badge: "Recommended",
        previewSettings: {
          textWidth: 68,
          paragraphSpacing: 1.5
        }
      },
      {
        id: "density_wide",
        title: "Panoramic Flow (~78 chars)",
        description: "Wider span that accommodates longer thoughts per line with fewer vertical jumps.",
        badge: "Wide Horizon",
        previewSettings: {
          textWidth: 78,
          paragraphSpacing: 1.3
        }
      }
    ]
  },
  {
    id: 8,
    title: "Round 8: Final Personalized Calibration Check",
    subtitle: "Compare your calibrated settings against standard unadjusted textbook formatting.",
    roundType: "comparison",
    sampleText: "In the heart of the ancient forest, mighty redwood trees absorb morning mist through their needle-like leaves, sheltering owls, mosses, and clear streams.",
    options: [
      {
        id: "calibrated_choice",
        title: "Your Calibrated Environment",
        description: "Combines your preferred font, line height, warm anti-glare ivory background, confusable anchors, and guidance.",
        badge: "Your Calibrated Match",
        previewSettings: {} // Will be filled dynamically from rounds 1-7
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
          highlightMode: "none",
          confusableLetterSettings: {
            enabled: false,
            activePairs: [],
            style: 'weight'
          },
          textWidth: 80
        }
      }
    ]
  }
];

import { NextRequest, NextResponse } from 'next/server';
import { executeAICompletion } from '@/lib/ai-provider';

const LANG_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिन्दी)',
  or: 'Odia (ଓଡ଼ିଆ)',
  bn: 'Bengali (বাংলা)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  mr: 'Marathi (मराठी)',
};

const SARVAM_LANG_CODES: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  or: 'od-IN',
};

// Server-side translation memory cache
const serverTranslationCache = new Map<string, string>();

async function translateChunkWithMyMemory(text: string, targetLang: string): Promise<string> {
  const clean = text.trim();
  if (!clean) return '';
  const cacheKey = `mm_${targetLang}_${clean}`;
  if (serverTranslationCache.has(cacheKey)) {
    return serverTranslationCache.get(cacheKey)!;
  }

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean.slice(0, 450))}&langpair=en|${targetLang}`
    );
    if (res.ok) {
      const data = await res.json();
      const translated = data.responseData?.translatedText;
      if (translated && !translated.startsWith('INVALID') && !translated.startsWith('QUERY LENGTH')) {
        serverTranslationCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (err) {
    console.warn('MyMemory chunk error:', err);
  }
  return clean;
}

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, apiKey, provider } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or target language' }, { status: 400 });
    }

    if (targetLang === 'en') {
      return NextResponse.json({ translatedText: text, status: 'success' });
    }

    const langName = LANG_NAMES[targetLang] || targetLang;
    const sarvamKey = (provider === 'sarvam' && apiKey) || process.env.SARVAM_API_KEY;

    // 1. Try Sarvam AI Mayura Translation if Sarvam key is provided
    if (sarvamKey) {
      try {
        const sarvamTargetCode = SARVAM_LANG_CODES[targetLang] || `${targetLang}-IN`;
        const paragraphs = text.split('\n\n').filter((p: string) => p.trim().length > 0);

        // Run in parallel batches of 5
        const translatedParagraphs: string[] = await Promise.all(
          paragraphs.map(async (p: string) => {
            try {
              const res = await fetch('https://api.sarvam.ai/translate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'api-subscription-key': sarvamKey,
                },
                body: JSON.stringify({
                  input: p.trim().slice(0, 1000),
                  source_language_code: 'en-IN',
                  target_language_code: sarvamTargetCode,
                  speaker_gender: 'Female',
                  mode: 'formal',
                  model: 'mayura:v1',
                }),
              });
              if (res.ok) {
                const data = await res.json();
                if (data.translated_text) return data.translated_text;
              }
            } catch {
              // fallback to original paragraph
            }
            return p;
          })
        );

        if (translatedParagraphs.length > 0 && translatedParagraphs.some((tp) => tp !== paragraphs[0])) {
          return NextResponse.json({
            translatedText: translatedParagraphs.join('\n\n'),
            status: 'success',
            provider: 'sarvam',
          });
        }
      } catch (sarvamErr) {
        console.warn('Sarvam translation batch error, falling back:', sarvamErr);
      }
    }

    // 2. Try Generative AI Translation (Gemini / OpenAI / Groq)
    const prompt = `You are a high-accuracy translator and linguistic accessibility expert.
Translate the following text faithfully into ${langName}.
Instructions:
- Preserve paragraph breaks and original formatting.
- Ensure natural, highly readable sentences appropriate for readers with dyslexia or reading differences.
- Return ONLY the direct translation. Do not include markdown code blocks, quotes, or conversational preamble.

Source Text:
${text.slice(0, 8000)}`;

    const systemInstruction = `You are an expert assistive multilingual translator specializing in Indian languages (${Object.values(LANG_NAMES).join(', ')}). Output pure translated text only.`;

    const aiResult = await executeAICompletion({
      prompt,
      systemInstruction,
      userApiKey: apiKey,
      provider: provider || 'server-default',
    });

    if (aiResult && aiResult.trim().length > 0 && aiResult.trim() !== text.trim()) {
      return NextResponse.json({
        translatedText: aiResult.trim(),
        status: 'success',
        provider: 'ai',
      });
    }

    // 3. High-Speed Parallel MyMemory Translation for all 7 Indic Languages
    try {
      const paragraphs = text.split('\n\n').filter((p: string) => p.trim().length > 0);

      const translatedParagraphs = await Promise.all(
        paragraphs.map(async (para: string) => {
          // Group sentences into chunks <= 350 chars
          const sentences = para.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [para];
          const chunks: string[] = [];
          let cur = '';

          for (const s of sentences) {
            if (cur.length + s.length + 1 <= 350) {
              cur = cur ? `${cur} ${s}` : s;
            } else {
              if (cur) chunks.push(cur);
              cur = s;
            }
          }
          if (cur) chunks.push(cur);

          const translatedChunks = await Promise.all(
            chunks.map((chunk) => translateChunkWithMyMemory(chunk, targetLang))
          );
          return translatedChunks.join(' ');
        })
      );

      if (translatedParagraphs.length > 0) {
        return NextResponse.json({
          translatedText: translatedParagraphs.join('\n\n'),
          status: 'success',
          provider: 'mymemory-parallel',
        });
      }
    } catch (fallbackErr) {
      console.warn('MyMemory parallel translation error:', fallbackErr);
    }

    return NextResponse.json({
      translatedText: text,
      status: 'fallback',
    });
  } catch (err: any) {
    console.error('Translation route error:', err);
    return NextResponse.json({ error: err.message || 'Translation failed' }, { status: 500 });
  }
}

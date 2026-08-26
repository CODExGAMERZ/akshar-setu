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

async function translateChunkWithMyMemory(text: string, targetLang: string): Promise<string | null> {
  try {
    const clean = text.trim();
    if (!clean) return '';
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|${targetLang}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.responseData?.translatedText && !data.responseData.translatedText.startsWith('INVALID')) {
        return data.responseData.translatedText;
      }
    }
  } catch (err) {
    console.warn('MyMemory translation chunk exception:', err);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, apiKey, provider } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or target language' }, { status: 400 });
    }

    if (targetLang === 'en' && /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(text.slice(0, 100))) {
      return NextResponse.json({ translatedText: text, status: 'success' });
    }

    const langName = LANG_NAMES[targetLang] || targetLang;

    // 1. Try Sarvam AI Mayura Translation if provider is sarvam or key is available
    const sarvamKey = (provider === 'sarvam' && apiKey) || process.env.SARVAM_API_KEY;
    if (sarvamKey) {
      try {
        const sarvamTargetCode = SARVAM_LANG_CODES[targetLang] || `${targetLang}-IN`;
        // Split long text into paragraphs / chunks under 800 chars
        const paragraphs = text.split('\n\n').filter((p: string) => p.trim().length > 0);
        const translatedParagraphs: string[] = [];

        for (const p of paragraphs) {
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
            if (data.translated_text) {
              translatedParagraphs.push(data.translated_text);
            } else {
              translatedParagraphs.push(p);
            }
          } else {
            translatedParagraphs.push(p);
          }
        }

        if (translatedParagraphs.length > 0) {
          return NextResponse.json({
            translatedText: translatedParagraphs.join('\n\n'),
            status: 'success',
            provider: 'sarvam',
          });
        }
      } catch (sarvamErr) {
        console.warn('Sarvam translation failed, falling back:', sarvamErr);
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
${text}`;

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

    // 3. Fallback to Free Neural MyMemory API for all 7 Indic Languages
    try {
      const paragraphs = text.split('\n\n').filter((p: string) => p.trim().length > 0);
      const translatedList: string[] = [];

      for (const para of paragraphs) {
        const sentences = para.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [para];
        const translatedSentences: string[] = [];

        for (const s of sentences) {
          const res = await translateChunkWithMyMemory(s, targetLang);
          translatedSentences.push(res || s);
        }

        translatedList.push(translatedSentences.join(' '));
      }

      if (translatedList.length > 0) {
        return NextResponse.json({
          translatedText: translatedList.join('\n\n'),
          status: 'success',
          provider: 'mymemory-fallback',
        });
      }
    } catch (fallbackErr) {
      console.warn('MyMemory fallback failed:', fallbackErr);
    }

    // 4. Return original text if all methods fail
    return NextResponse.json({
      translatedText: text,
      status: 'fallback',
    });
  } catch (err: any) {
    console.error('Translation error:', err);
    return NextResponse.json({ error: err.message || 'Translation failed' }, { status: 500 });
  }
}

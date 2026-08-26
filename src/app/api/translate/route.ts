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

    // 1. Try real Generative AI Translation (Gemini / OpenAI / Groq via BYOK or Safe Server Key)
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

    if (aiResult && aiResult.trim().length > 0) {
      return NextResponse.json({
        translatedText: aiResult.trim(),
        status: 'success',
        provider: 'ai',
      });
    }

    // 2. Check Sarvam AI if configured
    const sarvamKey = (provider === 'sarvam' && apiKey) || process.env.SARVAM_API_KEY;
    if (sarvamKey) {
      try {
        const response = await fetch('https://api.sarvam.ai/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': sarvamKey,
          },
          body: JSON.stringify({
            input: text,
            source_language_code: 'en-IN',
            target_language_code: `${targetLang}-IN`,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.translated_text) {
            return NextResponse.json({
              translatedText: data.translated_text,
              status: 'success',
              provider: 'sarvam',
            });
          }
        }
      } catch (sarvamErr) {
        console.warn('Sarvam API call failed:', sarvamErr);
      }
    }

    // 3. Fallback response
    return NextResponse.json({
      translatedText: text,
      status: 'fallback',
    });
  } catch (err: any) {
    console.error('Translation error:', err);
    return NextResponse.json({ error: err.message || 'Translation failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

// Language code mappings for Sarvam Bulbul TTS
const SARVAM_LANG_CODES: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  or: 'od-IN',
};

// Language code mappings for Google Translate Server TTS
const GOOGLE_LANG_CODES: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  bn: 'bn',
  ta: 'ta',
  te: 'te',
  mr: 'mr',
  or: 'or',
};

// Server-side Audio Cache
const audioCache = new Map<string, string>();

/**
 * Splits text into sentence/phrase chunks <= maxChunkLength
 */
function chunkText(text: string, maxChunkLength: number = 180): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChunkLength) return [clean];

  const sentences = clean.match(/[^.!?।\n]+[.!?।\n]+|[^.!?।\n]+$/g) || [clean];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const s = sentence.trim();
    if (!s) continue;

    if (currentChunk.length + s.length + 1 <= maxChunkLength) {
      currentChunk = currentChunk ? `${currentChunk} ${s}` : s;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (s.length <= maxChunkLength) {
        currentChunk = s;
      } else {
        const words = s.split(' ');
        let subChunk = '';
        for (const word of words) {
          if (subChunk.length + word.length + 1 <= maxChunkLength) {
            subChunk = subChunk ? `${subChunk} ${word}` : word;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = word;
          }
        }
        currentChunk = subChunk;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.filter((c) => c.trim().length > 0);
}

/**
 * Fetch a single audio chunk from Google Translate TTS with standard headers
 */
async function fetchGoogleTTSChunk(textChunk: string, langCode: string): Promise<Buffer | null> {
  try {
    const encoded = encodeURIComponent(textChunk.trim());
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encoded}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    });

    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (e) {
    console.warn('Google server TTS chunk failed:', e);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, lang = 'en', rate = 1.0, apiKey, provider } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Missing text for TTS' }, { status: 400 });
    }

    // Strip markdown formatting symbols for clean, natural speech pronunciation
    const cleanText = text
      .replace(/[*#_~`>•\-]/g, ' ')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      return NextResponse.json({ error: 'Empty text after cleaning' }, { status: 400 });
    }

    const cacheKey = `tts_${lang}_${rate}_${cleanText.length}_${cleanText.slice(0, 50)}`;
    if (audioCache.has(cacheKey)) {
      return NextResponse.json({
        audioData: audioCache.get(cacheKey)!,
        provider: 'cache',
        status: 'success',
      });
    }

    const sarvamKey = (provider === 'sarvam' && apiKey) || process.env.SARVAM_API_KEY;
    const openaiKey = (provider === 'openai' && apiKey) || process.env.OPENAI_API_KEY;

    // 1. Try Sarvam AI TTS (Bulbul) if Sarvam key is provided
    if (sarvamKey) {
      try {
        const targetLangCode = SARVAM_LANG_CODES[lang] || 'en-IN';
        const chunks = chunkText(cleanText, 450);

        // Fetch Sarvam chunks in parallel
        const sarvamAudios = await Promise.all(
          chunks.slice(0, 10).map(async (chunk) => {
            try {
              const res = await fetch('https://api.sarvam.ai/text-to-speech', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'api-subscription-key': sarvamKey,
                },
                body: JSON.stringify({
                  inputs: [chunk],
                  target_language_code: targetLangCode,
                  speaker: 'meera',
                  pitch: 0,
                  pace: Math.max(0.7, Math.min(1.4, rate)),
                  loudness: 1.5,
                  speech_sample_rate: 22050,
                  enable_preprocessing: true,
                  model: 'bulbul:v1',
                }),
              });
              if (res.ok) {
                const data = await res.json();
                return data.audios?.[0] || null;
              }
            } catch {
              // fallback
            }
            return null;
          })
        );

        const validAudios = sarvamAudios.filter(Boolean);
        if (validAudios.length > 0) {
          const firstAudio = `data:audio/wav;base64,${validAudios[0]}`;
          audioCache.set(cacheKey, firstAudio);
          return NextResponse.json({
            audioData: firstAudio,
            allAudios: validAudios.map((a) => `data:audio/wav;base64,${a}`),
            provider: 'sarvam',
            status: 'success',
          });
        }
      } catch (sarvamErr) {
        console.warn('Sarvam TTS error, falling back:', sarvamErr);
      }
    }

    // 2. Try OpenAI TTS (tts-1) if OpenAI key is provided
    if (openaiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'tts-1',
            voice: 'alloy',
            input: cleanText.slice(0, 4000),
            speed: Math.max(0.7, Math.min(1.5, rate)),
            response_format: 'mp3',
          }),
        });

        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const audioData = `data:audio/mp3;base64,${base64}`;
          audioCache.set(cacheKey, audioData);
          return NextResponse.json({
            audioData,
            provider: 'openai',
            status: 'success',
          });
        }
      } catch (openAiErr) {
        console.warn('OpenAI TTS error, falling back:', openAiErr);
      }
    }

    // 3. High-Fidelity Server-side Google TTS Proxy (Parallel chunk fetch < 500ms)
    try {
      const googleLangCode = GOOGLE_LANG_CODES[lang] || 'en';
      const chunks = chunkText(cleanText, 180);

      // Fetch all chunks simultaneously in parallel
      const bufferResults = await Promise.all(
        chunks.slice(0, 20).map((chunk) => fetchGoogleTTSChunk(chunk, googleLangCode))
      );

      const validBuffers = bufferResults.filter((b): b is Buffer => b !== null && b.length > 0);

      if (validBuffers.length > 0) {
        const combined = Buffer.concat(validBuffers);
        const base64 = combined.toString('base64');
        const audioData = `data:audio/mp3;base64,${base64}`;
        audioCache.set(cacheKey, audioData);
        return NextResponse.json({
          audioData,
          provider: 'server-google-tts-parallel',
          status: 'success',
        });
      }
    } catch (googleErr) {
      console.warn('Google server TTS synthesis failed:', googleErr);
    }

    // 4. Fallback instruction for client Web Speech API
    return NextResponse.json({
      fallback: 'web-speech-api',
      message: 'Using client Web Speech API fallback',
    });
  } catch (err: any) {
    console.error('TTS synthesis server error:', err);
    return NextResponse.json({ error: err.message || 'TTS synthesis failed' }, { status: 500 });
  }
}

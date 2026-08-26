import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, lang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text for TTS' }, { status: 400 });
    }

    // In a production environment with SARVAM_API_KEY (Bulbul TTS):
    if (process.env.SARVAM_API_KEY) {
      try {
        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': process.env.SARVAM_API_KEY,
          },
          body: JSON.stringify({
            inputs: [text],
            target_language_code: `${lang || 'en'}-IN`,
            speaker: 'meera',
            pitch: 0,
            pace: 0.95,
            loudness: 1.5,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: 'bulbul:v1',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            audios: data.audios,
            status: 'success',
          });
        }
      } catch (sarvamErr) {
        console.warn('Sarvam TTS API failed, fallback to client Web Speech API', sarvamErr);
      }
    }

    // Default response telling frontend to use Web Speech API
    return NextResponse.json({
      fallback: 'web-speech-api',
      message: 'Using client-side high fidelity Web Speech API synthesizer with karaoke tracking',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'TTS synthesis failed' }, { status: 500 });
  }
}

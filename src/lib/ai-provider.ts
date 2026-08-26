export interface AICallOptions {
  prompt: string;
  systemInstruction?: string;
  userApiKey?: string;
  provider?: 'server-default' | 'gemini' | 'openai' | 'groq' | 'sarvam';
}

export async function executeAICompletion(options: AICallOptions): Promise<string | null> {
  const { prompt, systemInstruction, userApiKey, provider = 'server-default' } = options;

  // 1. Determine key and active provider
  const geminiKey = (provider === 'gemini' && userApiKey) || process.env.GEMINI_API_KEY || '';
  const openaiKey = (provider === 'openai' && userApiKey) || process.env.OPENAI_API_KEY || '';
  const groqKey = (provider === 'groq' && userApiKey) || process.env.GROQ_API_KEY || '';

  // 2. Try Gemini first if key is available
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const payload: any = {
        contents: [{ parts: [{ text: prompt }] }],
      };
      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } else {
        const errText = await res.text();
        console.warn('Gemini API returned non-200:', res.status, errText);
      }
    } catch (err) {
      console.warn('Gemini API call exception:', err);
    }
  }

  // 3. Try OpenAI if key is available
  if (openaiKey) {
    try {
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      }
    } catch (err) {
      console.warn('OpenAI API call exception:', err);
    }
  }

  // 4. Try Groq if key is available
  if (groqKey) {
    try {
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages,
          temperature: 0.3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      }
    } catch (err) {
      console.warn('Groq API call exception:', err);
    }
  }

  return null;
}

export interface AICallOptions {
  prompt: string;
  systemInstruction?: string;
  userApiKey?: string;
  provider?: 'server-default' | 'gemini' | 'openai' | 'groq' | 'sarvam';
}

export async function executeAICompletion(options: AICallOptions): Promise<string | null> {
  const { prompt, systemInstruction, userApiKey, provider = 'server-default' } = options;

  // 1. Determine key and active provider preference
  const geminiKey = (provider === 'gemini' && userApiKey) || (provider === 'server-default' ? process.env.GEMINI_API_KEY : '') || process.env.GEMINI_API_KEY || '';
  const openaiKey = (provider === 'openai' && userApiKey) || (provider === 'server-default' ? process.env.OPENAI_API_KEY : '') || process.env.OPENAI_API_KEY || '';
  const groqKey = (provider === 'groq' && userApiKey) || (provider === 'server-default' ? process.env.GROQ_API_KEY : '') || process.env.GROQ_API_KEY || '';
  const sarvamKey = (provider === 'sarvam' && userApiKey) || (provider === 'server-default' ? process.env.SARVAM_API_KEY : '') || process.env.SARVAM_API_KEY || '';

  // Order of attempts based on user selected provider
  const providersToTry: ('gemini' | 'openai' | 'groq' | 'sarvam')[] = [];
  if (provider === 'gemini' && geminiKey) providersToTry.push('gemini');
  else if (provider === 'openai' && openaiKey) providersToTry.push('openai');
  else if (provider === 'groq' && groqKey) providersToTry.push('groq');
  else if (provider === 'sarvam' && sarvamKey) providersToTry.push('sarvam');

  // Add fallbacks
  if (geminiKey && !providersToTry.includes('gemini')) providersToTry.push('gemini');
  if (openaiKey && !providersToTry.includes('openai')) providersToTry.push('openai');
  if (groqKey && !providersToTry.includes('groq')) providersToTry.push('groq');

  for (const prov of providersToTry) {
    if (prov === 'gemini' && geminiKey) {
      // Try latest responsive Gemini flash models
      const geminiModels = [
        'gemini-3-flash-preview',
        'gemini-flash-latest',
        'gemini-2.5-flash-lite',
        'gemini-2.5-flash',
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-pro'
      ];
      for (const model of geminiModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
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
          }
        } catch (err) {
          console.warn(`Gemini (${model}) API call exception:`, err);
        }
      }
    }

    if (prov === 'openai' && openaiKey) {
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

    if (prov === 'groq' && groqKey) {
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
  }

  return null;
}

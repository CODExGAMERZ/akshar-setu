import { NextRequest, NextResponse } from 'next/server';
import { executeAICompletion } from '@/lib/ai-provider';

export async function POST(req: NextRequest) {
  try {
    const { text, level, apiKey, provider } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text to simplify' }, { status: 400 });
    }

    if (level === 'off') {
      return NextResponse.json({ simplifiedText: text, status: 'success' });
    }

    // 1. Level-specific instruction prompts
    let levelInstruction = '';
    if (level === 'light') {
      levelInstruction = `
- Replace complex, formal, or academic vocabulary with simple, common everyday synonyms.
- Keep the same paragraph structure and full factual content.
- Fix awkward phrasing and simplify convoluted subordinate clauses.`;
    } else if (level === 'medium') {
      levelInstruction = `
- Rewrite the text into clear, direct, conversational language.
- Break long compound sentences into short, easy-to-read sentences (under 14 words each).
- Preserve all key facts and concepts.
- Use clean paragraph spacing.`;
    } else if (level === 'heavy') {
      levelInstruction = `
- Format the text as a sequence of clean, bulleted key points using standard bullet characters (•).
- Use ultra-simple words and very short sentences (under 10 words per bullet).
- Highlight key facts clearly so readers with severe dyslexia can grasp the content effortlessly.`;
    }

    const prompt = `You are an accessibility assistive AI designed for dyslexic readers and neurodivergent learners.
Rewrite the following passage according to the "${level || 'medium'}" simplification level guidelines:

${levelInstruction}

Rules:
1. Maintain the EXACT SAME LANGUAGE as the source text (if text is Hindi, output simplified Hindi; if English, output simplified English; if Bengali/Tamil/Telugu/Odia/Marathi, simplify in that same language).
2. Do NOT add any preamble (like "Here is the simplified text:").
3. Do NOT wrap in markdown code blocks. Output the clean text directly.

Original Passage:
${text}`;

    const systemInstruction =
      'You are a specialized accessibility assistive AI for dyslexic readers. Your goal is to maximize cognitive ease, eliminate visual clutter, and make reading effortless while respecting the source language.';

    const aiResult = await executeAICompletion({
      prompt,
      systemInstruction,
      userApiKey: apiKey,
      provider: provider || 'server-default',
    });

    if (aiResult && aiResult.trim().length > 0) {
      return NextResponse.json({
        simplifiedText: aiResult.trim(),
        status: 'success',
        provider: 'ai',
      });
    }

    // 2. Rule-based fallback if no AI key is available
    return NextResponse.json({
      simplifiedText: text,
      status: 'fallback',
    });
  } catch (err: any) {
    console.error('Simplification error:', err);
    return NextResponse.json({ error: err.message || 'Simplification failed' }, { status: 500 });
  }
}

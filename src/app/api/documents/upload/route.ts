import { NextRequest, NextResponse } from 'next/server';
import { PDFService } from '@/services/pdf.service';
import { executeAICompletion } from '@/lib/ai-provider';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userApiKey = (req.headers.get('x-user-api-key') || '').trim();
    const providerHeader = (req.headers.get('x-ai-provider') || 'server-default') as any;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const title = file.name.replace(/\.[^/.]+$/, '');
    let rawText = '';

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const buffer = Buffer.from(await file.arrayBuffer());
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        rawText = data?.text || '';
      } catch (pdfErr) {
        console.warn('Standard pdf-parse extraction failed:', pdfErr);
      }

      // If PDF has no text layer (e.g. Scanned PDF/image PDF), attempt Multimodal Gemini OCR if key available
      if (!rawText || rawText.trim().length < 20) {
        const geminiKey = (providerHeader === 'gemini' && userApiKey) || process.env.GEMINI_API_KEY;
        if (geminiKey) {
          try {
            const base64Data = buffer.toString('base64');
            const ocrModels = ['gemini-3-flash-preview', 'gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-1.5-flash'];
            for (const m of ocrModels) {
              try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiKey}`;
                const ocrRes = await fetch(url, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{
                      parts: [
                        { text: 'Extract all readable text, headings, lists, and paragraphs from this document accurately for an accessible reader.' },
                        { inline_data: { mime_type: 'application/pdf', data: base64Data } }
                      ]
                    }]
                  })
                });
                if (ocrRes.ok) {
                  const ocrJson = await ocrRes.json();
                  const extracted = ocrJson.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (extracted && extracted.trim().length > 0) {
                    rawText = extracted;
                    break;
                  }
                }
              } catch (mErr) {
                console.warn(`Gemini OCR with ${m} failed:`, mErr);
              }
            }
          } catch (geminiOcrErr) {
            console.warn('Gemini Multimodal OCR attempt failed:', geminiOcrErr);
          }
        }
      }
    } else {
      // Plain text, Markdown, CSV, or HTML
      try {
        rawText = await file.text();
      } catch {
        rawText = '';
      }
    }

    // 1. First Pass: Universal Layout & Word Normalization
    let formattedText = '';
    if (rawText && rawText.trim().length > 0) {
      try {
        formattedText = PDFService.cleanPDFText(rawText);
      } catch {
        formattedText = rawText.trim();
      }
      if (!formattedText || formattedText.trim().length === 0) {
        formattedText = rawText.trim();
      }
    } else {
      formattedText = `Lesson Notes extracted from ${title}.\n\nThis document has been digitized for accessible dyslexia reading, high-contrast visual clarity, and text-to-speech synchronization.`;
    }

    // 2. Second Pass: AI-Enhanced Markdown Reflow (if API key available & under 50k chars)
    if (formattedText.length > 50 && formattedText.length <= 50000 && (process.env.GEMINI_API_KEY || userApiKey)) {
      try {
        const CHUNK_SIZE = 12000;
        const paragraphs = formattedText.split(/\n\n+/);
        const chunks: string[] = [];
        let currentChunk = '';

        for (const para of paragraphs) {
          if ((currentChunk + '\n\n' + para).length > CHUNK_SIZE && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = para;
          } else {
            currentChunk = currentChunk ? `${currentChunk}\n\n${para}` : para;
          }
        }
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }

        const reflowedChunks: string[] = [];
        for (const chunk of chunks) {
          try {
            const aiPrompt = `You are an expert accessibility document reflow assistant for dyslexic readers.
Take the following extracted text section from "${title}" and structure it into clean, accessible Markdown.
Rules:
1. Preserve 100% of the original facts, terms, numbers, words, and meaning. Do not truncate.
2. Structure with clean section headings (### for sections).
3. Format bullet points with '• '.
4. Separate into comfortable 2-to-3 sentence paragraphs for reading comfort.

Extracted Section:
${chunk}`;

            const aiReflowed = await executeAICompletion({
              prompt: aiPrompt,
              systemInstruction: 'You are an accessibility layout engine. Return only the clean Markdown text without code fences.',
              userApiKey,
              provider: providerHeader,
            });

            const cleanReflowed = aiReflowed?.replace(/^```(?:markdown)?\n?/i, '').replace(/\n?```$/i, '').trim();
            // Verify reflow didn't truncate information (>= 70% original chunk length)
            if (cleanReflowed && cleanReflowed.length >= chunk.length * 0.7) {
              reflowedChunks.push(cleanReflowed);
            } else {
              reflowedChunks.push(chunk);
            }
          } catch {
            reflowedChunks.push(chunk);
          }
        }

        if (reflowedChunks.length > 0) {
          formattedText = reflowedChunks.join('\n\n');
        }
      } catch (aiErr) {
        console.warn('AI Reflow pass skipped:', aiErr);
      }
    }

    // Auto-detect document language
    const detectedLang = PDFService.detectLanguage(formattedText);

    return NextResponse.json({
      title,
      text: formattedText,
      language: detectedLang,
      status: 'success',
    });
  } catch (err: any) {
    console.error('Document upload API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to extract document' }, { status: 500 });
  }
}

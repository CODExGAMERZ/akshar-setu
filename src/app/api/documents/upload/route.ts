import { NextRequest, NextResponse } from 'next/server';
import { PDFService } from '@/services/pdf.service';
import { executeAICompletion } from '@/lib/ai-provider';

// High-precision Coordinate-Aware Page Renderer for pdf-parse
function coordinateAwarePageRenderer(pageData: any) {
  const render_options = {
    normalizeWhitespace: true,
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(render_options).then(function (textContent: any) {
    let lastY: number | undefined;
    let lastX: number | undefined;
    let lastWidth = 0;
    let text = '';

    for (const item of textContent.items) {
      if (!item.str) continue;
      const currentX = item.transform[4];
      const currentY = item.transform[5];

      if (lastY === undefined) {
        text += item.str;
      } else if (Math.abs(currentY - lastY) > 3) {
        // Vertical displacement: line break or paragraph break
        if (Math.abs(currentY - lastY) > 14) {
          text += '\n\n' + item.str;
        } else {
          text += '\n' + item.str;
        }
      } else {
        // Same line: check horizontal gap between glyph bounding boxes
        const gap = currentX - (lastX! + lastWidth);
        if (gap > 1.5 || (!text.endsWith(' ') && !item.str.startsWith(' '))) {
          text += ' ' + item.str;
        } else {
          text += item.str;
        }
      }

      lastX = currentX;
      lastY = currentY;
      lastWidth = item.width || (item.str.length * 4.5);
    }

    return text;
  });
}

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

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const buffer = Buffer.from(await file.arrayBuffer());
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer, {
          pagerender: coordinateAwarePageRenderer,
        });
        rawText = data.text || '';
      } catch (pdfErr) {
        console.warn('Coordinate-aware pdf-parse fallback:', pdfErr);
        try {
          const pdfParse = require('pdf-parse');
          const data = await pdfParse(buffer);
          rawText = data.text || '';
        } catch {
          rawText = buffer.toString('utf-8');
        }
      }
    } else {
      // Plain text, Markdown, or doc text
      rawText = await file.text();
    }

    // 1. First Pass: Deterministic Universal Layout & Word Normalization
    let formattedText = PDFService.cleanPDFText(rawText);

    if (!formattedText || formattedText.trim().length === 0) {
      formattedText = `Sample reading passage extracted from ${title}.\n\nAksharSetu enables personalized, comfortable reading for every mind.`;
    }

    // 2. Second Pass: AI-Enhanced Markdown Formatting & Accessibility Reflow (if API key available)
    if (formattedText.length > 50) {
      try {
        const aiPrompt = `You are an expert accessibility document reflow assistant for dyslexic readers.
Take the following raw extracted text and structure it into clean, publication-grade Markdown.
Rules:
1. Preserve 100% of the original content, numbers, words, and meaning. Do not summarize or remove information.
2. Structure with clean Markdown headings (### for sections).
3. Format bullet lists with '• ' or numbered lists '1. '.
4. Format tables or parameter lists into clean bold bullet points (e.g. • **Parameter**: Value).
5. Separate dense walls of text into comfortable 2-to-3 sentence paragraphs for reading comfort.
6. Fix any OCR / PDF ligature glued words or missing spaces.

Extracted Document:
${formattedText.slice(0, 15000)}`;

        const aiReflowed = await executeAICompletion({
          prompt: aiPrompt,
          systemInstruction: 'You are an accessibility layout engine. Return only the pristine Markdown text with no conversational preamble or markdown code fences.',
          userApiKey,
          provider: providerHeader,
        });

        if (aiReflowed && aiReflowed.trim().length > formattedText.length * 0.5) {
          formattedText = PDFService.cleanPDFText(aiReflowed.replace(/^```(?:markdown)?\n?/i, '').replace(/\n?```$/i, ''));
        }
      } catch (aiErr) {
        console.warn('AI Reflow pass skipped, using deterministic cleaner:', aiErr);
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

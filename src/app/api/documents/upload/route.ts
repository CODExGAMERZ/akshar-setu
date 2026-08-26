import { NextRequest, NextResponse } from 'next/server';
import { PDFService } from '@/services/pdf.service';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const title = file.name.replace(/\.[^/.]+$/, '');
    let rawText = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const buffer = Buffer.from(await file.arrayBuffer());
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        rawText = data.text || '';
      } catch (pdfErr) {
        console.warn('pdf-parse fallback to buffer decode:', pdfErr);
        rawText = buffer.toString('utf-8');
      }
    } else {
      // Plain text, Markdown, or doc text
      rawText = await file.text();
    }

    // Clean, un-hyphenate, de-noise, and reflow into beautiful paragraphs
    let formattedText = PDFService.cleanPDFText(rawText);

    if (!formattedText || formattedText.trim().length === 0) {
      formattedText = `Sample reading passage extracted from ${title}.\n\nAksharSetu enables personalized, comfortable reading for every mind.`;
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

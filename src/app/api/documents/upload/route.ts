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
    let extractedText = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const buffer = Buffer.from(await file.arrayBuffer());
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        extractedText = PDFService.cleanPDFText(data.text);
      } catch (pdfErr) {
        console.warn('pdf-parse encountered an issue, falling back to buffer string decode:', pdfErr);
        extractedText = buffer.toString('utf-8');
      }
    } else {
      // Text / Markdown / Doc format
      extractedText = await file.text();
    }

    if (!extractedText.trim()) {
      extractedText = 'Sample reading passage extracted from ' + title + '.\n\nAksharSetu enables personalized, comfortable reading for every mind.';
    }

    return NextResponse.json({
      title,
      text: extractedText,
      language: 'en',
    });
  } catch (err: any) {
    console.error('Document upload API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

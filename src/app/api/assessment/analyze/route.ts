import { NextRequest, NextResponse } from 'next/server';
import { executeAICompletion } from '@/lib/ai-provider';
import { READING_THEMES } from '@/data/themes';
import { ConfusablePair, FontOption } from '@/types';

export async function POST(req: NextRequest) {
  try {
    let rawText = '';
    const userApiKey = (req.headers.get('x-user-api-key') || '').trim();
    const providerHeader = (req.headers.get('x-ai-provider') || 'server-default') as any;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const buffer = Buffer.from(await file.arrayBuffer());
        try {
          const pdfParse = require('pdf-parse');
          const data = await pdfParse(buffer);
          rawText = data?.text || '';
        } catch (pdfErr) {
          console.warn('Assessment PDF parsing error:', pdfErr);
        }
      } else {
        rawText = await file.text();
      }
    } else {
      const body = await req.json();
      rawText = body.text || '';
    }

    if (!rawText || rawText.trim().length === 0) {
      rawText = 'Assessment report evaluating reading fluency, visual crowding, and letter recognition.';
    }

    // Attempt AI-assisted clinical report extraction
    const prompt = `Analyze this psychoeducational / clinical / optometric assessment report text for reading accommodations and accessibility recommendations:

--- REPORT TEXT ---
${rawText.slice(0, 10000)}
--- END REPORT TEXT ---

Return ONLY a valid raw JSON object (no markdown, no backticks) with this structure:
{
  "font": "Lexend" | "Atkinson Hyperlegible" | "OpenDyslexic" | "Comic Neue",
  "fontSize": 18-24,
  "lineSpacing": 1.6-2.2,
  "letterSpacing": 0.03-0.08,
  "wordSpacing": 0.08-0.18,
  "themeId": "warm-cream" | "anti-glare-soft-yellow" | "calm-sage" | "slate-blue",
  "confusablePairs": ["b/d", "p/q", "m/w", "n/u", "s/z"],
  "readingRuler": true | false,
  "bionicReading": true | false,
  "summary": [
    "Identified accommodation 1",
    "Identified accommodation 2",
    "Identified accommodation 3"
  ]
}`;

    let aiResult: any = null;
    try {
      const aiResponse = await executeAICompletion({
        prompt,
        systemInstruction: 'You are an educational accessibility specialist extracting reading accommodations from clinical reports. Return raw JSON only.',
        userApiKey,
        provider: providerHeader,
      });

      if (aiResponse) {
        const cleaned = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        aiResult = JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn('AI assessment analysis failed or not configured, using keyword extraction:', e);
    }

    // Keyword heuristics fallback if AI didn't return complete result
    const lower = rawText.toLowerCase();
    const hasScotopicOrGlare = lower.includes('scotopic') || lower.includes('glare') || lower.includes('light sensitiv') || lower.includes('irlen');
    const hasReversals = lower.includes('revers') || lower.includes('b/d') || lower.includes('p/q') || lower.includes('mirror') || lower.includes('orientation');
    const hasTrackingIssues = lower.includes('tracking') || lower.includes('saccad') || lower.includes('skip') || lower.includes('line');
    const hasCrowding = lower.includes('crowd') || lower.includes('spacing') || lower.includes('cluster');

    const detectedFont: FontOption = aiResult?.font || (lower.includes('dyslexi') ? 'OpenDyslexic' : lower.includes('hyperleg') ? 'Atkinson Hyperlegible' : 'Lexend');
    const detectedFontSize: number = typeof aiResult?.fontSize === 'number' ? aiResult.fontSize : (hasCrowding ? 21 : 19);
    const detectedLineSpacing: number = typeof aiResult?.lineSpacing === 'number' ? aiResult.lineSpacing : (hasTrackingIssues ? 2.0 : 1.85);
    const detectedLetterSpacing: number = typeof aiResult?.letterSpacing === 'number' ? aiResult.letterSpacing : (hasCrowding ? 0.06 : 0.04);
    const detectedWordSpacing: number = typeof aiResult?.wordSpacing === 'number' ? aiResult.wordSpacing : (hasCrowding ? 0.14 : 0.10);
    const detectedThemeId: string = aiResult?.themeId || (hasScotopicOrGlare ? 'anti-glare-soft-yellow' : 'warm-cream');
    const detectedTheme = READING_THEMES.find(t => t.id === detectedThemeId) || READING_THEMES[0];

    const detectedConfusables: ConfusablePair[] = Array.isArray(aiResult?.confusablePairs) && aiResult.confusablePairs.length > 0
      ? aiResult.confusablePairs
      : (hasReversals ? ['b/d', 'p/q', 'm/w'] : ['b/d', 'p/q']);

    const detectedReadingRuler: boolean = typeof aiResult?.readingRuler === 'boolean' ? aiResult.readingRuler : hasTrackingIssues;
    const detectedBionic: boolean = typeof aiResult?.bionicReading === 'boolean' ? aiResult.bionicReading : true;

    const summary: string[] = Array.isArray(aiResult?.summary) && aiResult.summary.length > 0
      ? aiResult.summary
      : [
          `Selected font ${detectedFont} (${detectedFontSize}px) to eliminate visual crowding`,
          `Set line spacing to ${detectedLineSpacing}x ${detectedReadingRuler ? 'with Reading Ruler enabled' : ''} to prevent tracking loss`,
          `Applied ${detectedTheme.name} anti-glare background tone for visual comfort`,
          `Enabled distinct anchors for confusable letter pairs (${detectedConfusables.join(', ')})`,
          `Configured ${detectedBionic ? 'bionic initial fixations' : 'clean standard flow'} for rapid cognitive processing`
        ];

    return NextResponse.json({
      status: 'success',
      preferences: {
        font: detectedFont,
        fontSize: detectedFontSize,
        lineSpacing: detectedLineSpacing,
        letterSpacing: detectedLetterSpacing,
        wordSpacing: detectedWordSpacing,
        themeId: detectedTheme.id,
        backgroundColor: detectedTheme.backgroundColor,
        textColor: detectedTheme.textColor,
        highlightColor: detectedTheme.highlightColor,
        readingRuler: detectedReadingRuler,
        bionicReading: detectedBionic,
        confusableLetterSettings: {
          enabled: true,
          activePairs: detectedConfusables,
          style: 'weight'
        }
      },
      summary
    });
  } catch (error: any) {
    console.error('Assessment analysis API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze assessment' }, { status: 500 });
  }
}

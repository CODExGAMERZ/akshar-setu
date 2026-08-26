import { DocumentItem, SupportedLanguage } from '@/types';
import { SAMPLE_DOCUMENTS } from '@/lib/constants';
import { StorageService } from '@/lib/storage';

export interface DigitiseProgressCallback {
  onStageChange?: (stage: 'uploading' | 'processing' | 'extracting' | 'formatting' | 'complete') => void;
  onProgress?: (percent: number) => void;
}

export class DocumentService {
  /**
   * Retrieves all documents stored in localStorage with fallback to educational samples.
   */
  public static getDocuments(): DocumentItem[] {
    return StorageService.getDocuments();
  }

  /**
   * Retrieves a single document by ID.
   */
  public static getDocumentById(id: string): DocumentItem | null {
    const docs = this.getDocuments();
    return docs.find((d) => d.id === id) || null;
  }

  /**
   * Saves or updates a document.
   */
  public static saveDocument(doc: DocumentItem): void {
    StorageService.saveDocument(doc);
  }

  /**
   * Deletes a document by ID.
   */
  public static deleteDocument(id: string): void {
    StorageService.deleteDocument(id);
  }

  /**
   * Renames a document.
   */
  public static renameDocument(id: string, newTitle: string): DocumentItem | null {
    const doc = this.getDocumentById(id);
    if (!doc) return null;
    const updated: DocumentItem = {
      ...doc,
      title: newTitle,
    };
    this.saveDocument(updated);
    return updated;
  }

  /**
   * Mock Document Digitisation (OCR) service matching Section 13 & 36 of Specification.
   * Simulates the multi-step pipeline: Uploading -> Processing -> Extracting text -> Formatting content -> Complete.
   */
  public static async digitise(
    file: File,
    callbacks?: DigitiseProgressCallback
  ): Promise<DocumentItem> {
    // 1. Uploading
    callbacks?.onStageChange?.('uploading');
    callbacks?.onProgress?.(25);
    await new Promise((res) => setTimeout(res, 400));

    // 2. Processing
    callbacks?.onStageChange?.('processing');
    callbacks?.onProgress?.(50);
    await new Promise((res) => setTimeout(res, 500));

    // 3. Extracting text
    callbacks?.onStageChange?.('extracting');
    callbacks?.onProgress?.(75);

    let extractedText = '';
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const isHindi = fileName.toLowerCase().includes('hindi') || fileName.includes('हिंदी') || fileName.includes('जल');
    const detectedLang: SupportedLanguage = isHindi ? 'hi' : 'en';

    if (file.type === 'text/plain') {
      extractedText = await file.text();
    } else {
      // Mock realistic OCR educational text extraction for PDFs / images
      extractedText = `### 1. Document Overview: ${fileName}

This document contains key concepts and learning materials structured for accessible multisensory reading.

### 2. Core Concepts & Definitions

• Principle A: Clear typography and balanced character spacing reduce visual crowding and minimize letter confusion.
• Principle B: High contrast color palettes absorb harsh ambient glare and support steady visual tracking.
• Principle C: Multisensory audio synchronization links spoken phonemes directly with visual word boundaries.

### 3. Summary & Takeaways

By tailoring font style, line length between 45–100 characters, and increasing line height to at least 1.5×, reading becomes smooth, engaging, and fatigue-free.`;
    }

    // 4. Formatting content
    callbacks?.onStageChange?.('formatting');
    callbacks?.onProgress?.(90);
    await new Promise((res) => setTimeout(res, 350));

    // 5. Complete
    callbacks?.onStageChange?.('complete');
    callbacks?.onProgress?.(100);

    const wordCount = extractedText.trim().split(/\s+/).filter(Boolean).length;

    const newDoc: DocumentItem = {
      id: `doc_${Date.now()}`,
      title: fileName || 'Uploaded Document',
      originalText: extractedText,
      processedText: extractedText,
      language: detectedLang,
      sourceFormat: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'text',
      lastOpened: 'Just now',
      progressPercent: 0,
      wordCount,
      createdAt: new Date().toISOString(),
      summary: `Digitised document containing ${wordCount} words.`,
    };

    this.saveDocument(newDoc);
    StorageService.setCurrentDocId(newDoc.id);

    return newDoc;
  }
}

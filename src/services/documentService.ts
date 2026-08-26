import { Document, DocumentPage } from '../types';
import { MOCK_DOCUMENTS } from '../data/mockDocuments';

const STORAGE_KEY = 'aksharsetu_documents_v1';

type DocCategory = 'Science' | 'History' | 'English' | 'Mathematics' | 'General';

const CATEGORY_KEYWORDS: Record<DocCategory, string[]> = {
  Science: ['science', 'biology', 'chemistry', 'physics', 'cell', 'atom', 'molecule', 'ecosystem', 'photosynthesis', 'evolution', 'genetics', 'organism', 'pollination', 'deforestation', 'biosphere', 'experiment', 'laboratory', 'hypothesis', 'chemical', 'reaction', 'electron', 'nucleus', 'energy', 'force', 'gravity', 'density', 'velocity'],
  History: ['history', 'civilization', 'empire', 'ancient', 'medieval', 'war', 'revolution', 'dynasty', 'kingdom', 'independence', 'colonial', 'mughal', 'british', 'silk road', 'constitution', 'democracy', 'treaty', 'archaeological', 'monument', 'heritage', 'century', 'battle'],
  English: ['poem', 'poetry', 'literature', 'grammar', 'essay', 'novel', 'story', 'chapter', 'character', 'narrative', 'fiction', 'shakespeare', 'metaphor', 'simile', 'comprehension', 'vocabulary', 'prose', 'lighthouse', 'author', 'literary'],
  Mathematics: ['math', 'mathematics', 'algebra', 'geometry', 'equation', 'theorem', 'formula', 'triangle', 'circle', 'calculus', 'fraction', 'decimal', 'percentage', 'graph', 'polynomial', 'quadratic', 'probability', 'statistics', 'arithmetic', 'number'],
  General: []
};

function detectCategory(title: string, content: string): DocCategory {
  const combined = `${title} ${content.slice(0, 2000)}`.toLowerCase();

  let bestCategory: DocCategory = 'General';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [DocCategory, string[]][]) {
    if (category === 'General') continue;
    let score = 0;
    for (const kw of keywords) {
      if (combined.includes(kw)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestScore >= 1 ? bestCategory : 'General';
}

class DocumentService {
  private documents: Document[] = [];
  private initialized = false;

  constructor() {
    // Lazy initialize on client
  }

  private ensureInitialized() {
    if (this.initialized) return;
    this.initialized = true;
    if (typeof window === 'undefined') {
      this.documents = [...MOCK_DOCUMENTS];
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.documents = JSON.parse(stored);
      } else {
        this.documents = [...MOCK_DOCUMENTS];
        this.persist();
      }
    } catch (e) {
      console.warn('Could not read documents from localStorage:', e);
      this.documents = [...MOCK_DOCUMENTS];
    }
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.documents));
    } catch (e) {
      console.warn('Could not save documents to localStorage:', e);
    }
  }

  public async getDocuments(): Promise<Document[]> {
    this.ensureInitialized();
    await new Promise(r => setTimeout(r, 40));
    return [...this.documents];
  }

  public async getDocument(id: string): Promise<Document | null> {
    this.ensureInitialized();
    await new Promise(r => setTimeout(r, 30));
    const doc = this.documents.find(d => d.id === id);
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  }

  public async saveDocument(doc: Document): Promise<Document> {
    this.ensureInitialized();
    const index = this.documents.findIndex(d => d.id === doc.id);
    if (index >= 0) {
      this.documents[index] = { ...doc, updatedAt: new Date().toISOString() };
    } else {
      this.documents.unshift({ ...doc, updatedAt: new Date().toISOString() });
    }
    this.persist();
    return doc;
  }

  public async deleteDocument(id: string): Promise<boolean> {
    this.ensureInitialized();
    this.documents = this.documents.filter(d => d.id !== id);
    this.persist();
    return true;
  }

  public async updateProgress(id: string, progress: number): Promise<void> {
    this.ensureInitialized();
    const doc = this.documents.find(d => d.id === id);
    if (doc) {
      doc.progressPercent = Math.min(100, Math.max(0, progress));
      doc.updatedAt = new Date().toISOString();
      this.persist();
    }
  }

  public async digitise(file: File | { name: string; size: number; textContent?: string }): Promise<Document> {
    this.ensureInitialized();
    const docId = `doc_${Date.now()}`;
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
    let extractedText = '';
    let detectedLanguage = 'en-IN';
    let serverTitle = '';

    // 1. Try server OCR extraction if File instance
    if (typeof window !== 'undefined' && file instanceof File) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text && data.text.trim().length > 0) {
            extractedText = data.text;
            if (data.language) {
              detectedLanguage = data.language;
            }
            if (data.title) {
              serverTitle = data.title;
            }
          }
        }
      } catch (uploadErr) {
        console.warn('Server upload OCR failed, trying local extraction:', uploadErr);
      }

      // If text file and server extraction wasn't used or failed
      if (!extractedText && (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
        try {
          extractedText = await file.text();
        } catch {
          // fallback
        }
      }
    }

    // 2. Use textContent if provided (non-File objects)
    if (!extractedText || extractedText.trim().length === 0) {
      if ('textContent' in file && typeof file.textContent === 'string' && file.textContent.trim()) {
        extractedText = file.textContent;
      }
    }

    // 3. Final fallback — document title placeholder
    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = `### ${cleanTitle}\n\nThis document was uploaded but could not be text-extracted. It may be a scanned image PDF. Try uploading a text-based PDF or a .txt file for best results.`;
    }

    // 4. Auto-detect category from title and content
    const finalTitle = serverTitle || cleanTitle;
    const category: DocCategory = detectCategory(finalTitle, extractedText);

    // 5. Paginate text into comfortable accessible pages (~200 words per page)
    const allParagraphs = extractedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const pages: DocumentPage[] = [];
    let currentPageParagraphs: string[] = [];
    let currentWordCount = 0;
    let pageNumber = 1;

    for (const para of allParagraphs) {
      const wordsInPara = para.trim().split(/\s+/).length;
      if (currentWordCount > 0 && currentWordCount + wordsInPara > 220) {
        const pageContent = currentPageParagraphs.join('\n\n');
        pages.push({
          pageNumber,
          content: pageContent,
          paragraphs: [...currentPageParagraphs],
          keyTerms: []
        });
        pageNumber++;
        currentPageParagraphs = [para];
        currentWordCount = wordsInPara;
      } else {
        currentPageParagraphs.push(para);
        currentWordCount += wordsInPara;
      }
    }

    if (currentPageParagraphs.length > 0) {
      const pageContent = currentPageParagraphs.join('\n\n');
      pages.push({
        pageNumber,
        content: pageContent,
        paragraphs: [...currentPageParagraphs],
        keyTerms: []
      });
    }

    const totalWordCount = extractedText.trim().split(/\s+/).length;

    const newDoc: Document = {
      id: docId,
      title: finalTitle,
      category,
      language: detectedLanguage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progressPercent: 0,
      totalWords: totalWordCount,
      estimatedReadTimeMinutes: Math.max(1, Math.ceil(totalWordCount / 120)),
      originalViewStyle: {
        headerColor: '#1E40AF',
        chapterNumber: `PAGE 1 of ${pages.length}`,
        subheading: `Digitized from ${file.name}`,
        accentColor: '#3B82F6'
      },
      pages: pages.length > 0 ? pages : [
        {
          pageNumber: 1,
          content: extractedText,
          paragraphs: allParagraphs,
          keyTerms: []
        }
      ],
      status: 'completed'
    };

    await this.saveDocument(newDoc);
    return newDoc;
  }
}

export const documentService = new DocumentService();

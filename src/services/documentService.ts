import { Document } from '../types';
import { MOCK_DOCUMENTS } from '../data/mockDocuments';

const STORAGE_KEY = 'lexiease_documents_v1';

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
    await new Promise(r => setTimeout(r, 60));
    return [...this.documents];
  }

  public async getDocument(id: string): Promise<Document | null> {
    this.ensureInitialized();
    await new Promise(r => setTimeout(r, 40));
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
    
    const sampleBody = ('textContent' in file && typeof file.textContent === 'string') 
      ? file.textContent 
      : `In natural biology, pollination is the vital ecological process by which pollen grains are transferred from the male anther of a flower to the female stigma.

Insects like honeybees, bumblebees, and butterflies are among the most effective animal pollinators on Earth. As they forage for sweet floral nectar, tiny pollen particles adhere to their fuzzy bodies and are gently deposited onto neighboring blooms.

Without healthy pollinator populations, more than one-third of our global food supply—including crunchy apples, sweet berries, almonds, and colorful garden vegetables—would fail to produce fruit. Protecting natural biodiversity and avoiding chemical insecticides ensures our agricultural systems stay resilient.`;

    const paragraphs = sampleBody.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const wordCount = sampleBody.trim().split(/\s+/).length;

    const newDoc: Document = {
      id: docId,
      title: cleanTitle,
      category: 'Science',
      language: 'en-IN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progressPercent: 0,
      totalWords: wordCount,
      estimatedReadTimeMinutes: Math.max(1, Math.ceil(wordCount / 120)),
      originalViewStyle: {
        headerColor: '#1E40AF',
        chapterNumber: 'EXTRACTED OCR',
        subheading: 'Digitized Educational Document',
        accentColor: '#3B82F6'
      },
      pages: [
        {
          pageNumber: 1,
          content: sampleBody,
          paragraphs: paragraphs,
          simplifiedContent: `Pollination is how flowers make seeds and fruits.

Bees and butterflies fly to flowers to drink sweet nectar. When they land, yellow pollen dust sticks to their bodies and moves to other flowers.

We need bees to help grow yummy foods like apples, strawberries, and nuts. Taking care of gardens helps our bees stay safe.`,
          keyTerms: [
            { term: 'Pollination', definition: 'The transfer of pollen from an anther to a stigma enabling plant reproduction.' },
            { term: 'Stigma', definition: 'The receptive surface of the female organ of a flower.' },
            { term: 'Biodiversity', definition: 'The essential variety of living animals and plants in nature.' }
          ],
          translations: {
            'hi-IN': `परागण वह महत्वपूर्ण प्रक्रिया है जिसके द्वारा परागकणों को फूल के नर भाग से मादा भाग में स्थानांतरित किया जाता है। मधुमक्खियां और तितलियां सबसे महत्वपूर्ण परागणकर्ता हैं।`
          }
        }
      ],
      status: 'completed'
    };

    await this.saveDocument(newDoc);
    return newDoc;
  }
}

export const documentService = new DocumentService();

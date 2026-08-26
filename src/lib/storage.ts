import { DEFAULT_READING_PROFILE, SAMPLE_DOCUMENTS } from './constants';
import { DocumentItem, ReadingProfile, UserApiConfig, UserSession } from '@/types';

const STORAGE_KEYS = {
  PROFILE: 'aksharsetu_profile',
  DOCUMENTS: 'aksharsetu_documents',
  SESSION: 'aksharsetu_session',
  CURRENT_DOC_ID: 'aksharsetu_current_doc_id',
  API_CONFIG: 'aksharsetu_api_config',
};

const DEFAULT_API_CONFIG: UserApiConfig = {
  provider: 'server-default',
  useCustomKey: false,
  geminiKey: '',
  openaiKey: '',
  groqKey: '',
  sarvamKey: '',
};

export const StorageService = {
  // Reading Profile
  getProfile(): ReadingProfile {
    if (typeof window === 'undefined') return DEFAULT_READING_PROFILE;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : DEFAULT_READING_PROFILE;
    } catch {
      return DEFAULT_READING_PROFILE;
    }
  },

  saveProfile(profile: ReadingProfile): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  },

  // Documents
  getDocuments(): DocumentItem[] {
    if (typeof window === 'undefined') return SAMPLE_DOCUMENTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(SAMPLE_DOCUMENTS));
        return SAMPLE_DOCUMENTS;
      }
      return JSON.parse(stored);
    } catch {
      return SAMPLE_DOCUMENTS;
    }
  },

  getDocumentById(id: string): DocumentItem | null {
    const docs = this.getDocuments();
    return docs.find((d) => d.id === id) || null;
  },

  saveDocument(doc: DocumentItem): void {
    if (typeof window === 'undefined') return;
    try {
      const docs = this.getDocuments();
      const existingIdx = docs.findIndex((d) => d.id === doc.id);
      if (existingIdx >= 0) {
        docs[existingIdx] = doc;
      } else {
        docs.unshift(doc);
      }
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save document to localStorage', e);
    }
  },

  deleteDocument(id: string): void {
    if (typeof window === 'undefined') return;
    try {
      const docs = this.getDocuments().filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to delete document', e);
    }
  },

  // Current Active Doc
  getCurrentDocId(): string {
    if (typeof window === 'undefined') return 'doc-1';
    return localStorage.getItem(STORAGE_KEYS.CURRENT_DOC_ID) || 'doc-1';
  },

  setCurrentDocId(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_DOC_ID, id);
  },

  // Session / Auth
  getSession(): UserSession {
    if (typeof window === 'undefined') return { isGuest: true, user: null };
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
      return stored ? JSON.parse(stored) : { isGuest: true, user: null };
    } catch {
      return { isGuest: true, user: null };
    }
  },

  saveSession(session: UserSession): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session', e);
    }
  },

  // API Config (BYOK)
  getApiConfig(): UserApiConfig {
    if (typeof window === 'undefined') return DEFAULT_API_CONFIG;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.API_CONFIG);
      return stored ? { ...DEFAULT_API_CONFIG, ...JSON.parse(stored) } : DEFAULT_API_CONFIG;
    } catch {
      return DEFAULT_API_CONFIG;
    }
  },

  saveApiConfig(config: UserApiConfig): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save API config to localStorage', e);
    }
  },
};

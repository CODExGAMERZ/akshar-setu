'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';
import { useAuth } from '@/context/AuthContext';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';

export default function HistoryPage() {
  const router = useRouter();
  const { documents, deleteDocument, setCurrentDocumentId } = useReader();
  const { session, signInWithGoogle } = useAuth();

  const handleOpenDoc = (id: string) => {
    setCurrentDocumentId(id);
    router.push(`/read/${id}`);
  };

  const getLanguageName = (code: string) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg mb-3 sm:mb-4 text-primary font-bold">
          History
        </h2>
        {session.isGuest && (
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-outline-variant">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary mt-0.5">info</span>
              <p className="text-xs sm:text-body-md font-body-md text-on-surface-variant">
                Guest history clears when you close this tab — sign in to keep it.
              </p>
            </div>
            <button
              onClick={signInWithGoogle}
              className="text-xs font-bold text-primary hover:underline shrink-0 py-1.5 px-4 rounded-full bg-surface-container-highest self-start sm:self-center"
            >
              Sign in
            </button>
          </div>
        )}
      </header>

      {/* Documents List */}
      <div className="space-y-4 sm:space-y-6">
        {documents.length === 0 ? (
          <div className="bg-surface rounded-xl p-8 sm:p-12 text-center border-2 border-surface-container-highest flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-5xl text-outline-variant">folder_open</span>
            <p className="text-headline-md font-headline-md text-on-surface font-bold">No reading history yet</p>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
              Upload a PDF or paste some text to start your personalized reading journey.
            </p>
            <Link
              href="/upload"
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full text-label-md font-bold hover:bg-on-primary-fixed-variant touch-target"
            >
              <span className="material-symbols-outlined">upload_file</span>
              Add material
            </Link>
          </div>
        ) : (
          documents.map((doc) => (
            <article
              key={doc.id}
              className="bg-surface rounded-xl p-5 sm:p-6 md:p-8 border-2 border-surface-container-highest flex flex-col md:flex-row gap-4 sm:gap-6 hover:border-outline transition-colors shadow-sm"
            >
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs sm:text-label-md font-label-md font-bold">
                      {getLanguageName(doc.language)}
                    </span>
                    <span className="text-xs sm:text-body-md font-body-md text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs sm:text-sm">schedule</span> Last opened:{' '}
                      {doc.lastOpened}
                    </span>
                    <span className="text-xs text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
                      {doc.sourceFormat.toUpperCase()} • {doc.wordCount || 0} words
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-headline-md font-headline-md font-bold text-on-surface">
                    {doc.title}
                  </h3>
                </div>

                <p className="text-sm sm:text-body-md font-body-md text-on-surface-variant line-clamp-3">
                  {doc.originalText}
                </p>

                <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <button
                    onClick={() => handleOpenDoc(doc.id)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-full text-xs sm:text-label-md font-label-md font-bold hover:bg-on-primary-fixed-variant transition-colors active:scale-95 shadow-sm min-h-[2.75rem] touch-target"
                  >
                    <span className="material-symbols-outlined text-sm">auto_stories</span>
                    Open
                  </button>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    aria-label="Delete document"
                    className="p-2 text-outline hover:text-error hover:bg-error-container/30 rounded-full transition-colors touch-target flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

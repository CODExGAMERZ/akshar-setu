'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useReader } from '@/context/ReaderContext';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';

export default function DocumentLibraryPage() {
  const router = useRouter();
  const { documents, deleteDocument, renameDocument, setCurrentDocumentId } = useReader();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenDoc = (id: string) => {
    setCurrentDocumentId(id);
    router.push(`/read/${id}`);
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setRenamingId(id);
    setRenameTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (renameTitle.trim()) {
      renameDocument(id, renameTitle.trim());
    }
    setRenamingId(null);
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-primary mb-1">
            Document Library
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Select a document to read with your personalized typographic and audio preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2 shadow-sm touch-target"
          >
            <span className="material-symbols-outlined text-lg">upload_file</span>
            Upload Document
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-md relative">
        <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-lg">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your library..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-bright border-2 border-surface-container-highest rounded-xl text-sm text-on-background focus:border-primary focus:ring-0"
        />
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-surface-bright rounded-3xl p-12 text-center border-2 border-surface-container-highest flex flex-col items-center">
          <span className="material-symbols-outlined text-primary text-5xl mb-3">menu_book</span>
          <h3 className="text-lg font-bold text-on-surface mb-1">No documents found</h3>
          <p className="text-xs text-on-surface-variant mb-6">Upload a new PDF or text file to start reading.</p>
          <Link
            href="/upload"
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs"
          >
            Upload Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => {
            const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === doc.language);

            return (
              <div
                key={doc.id}
                className="bg-surface-bright rounded-2xl border-2 border-surface-container-highest hover:border-primary/60 transition-all p-5 flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                      <span className="material-symbols-outlined text-xs text-primary">
                        {doc.sourceFormat === 'pdf' ? 'picture_as_pdf' : 'description'}
                      </span>
                      {doc.sourceFormat.toUpperCase()}
                    </span>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      {langObj?.nativeName || doc.language.toUpperCase()}
                    </span>
                  </div>

                  {/* Title or Inline Edit */}
                  {renamingId === doc.id ? (
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={renameTitle}
                        onChange={(e) => setRenameTitle(e.target.value)}
                        className="flex-1 p-1.5 text-sm font-bold bg-surface-container-lowest border border-primary rounded-lg"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRename(doc.id)}
                        className="p-1 text-primary hover:text-on-primary-fixed-variant"
                        title="Save name"
                      >
                        <span className="material-symbols-outlined text-lg">check</span>
                      </button>
                    </div>
                  ) : (
                    <h2
                      onClick={() => handleOpenDoc(doc.id)}
                      className="text-base sm:text-lg font-bold text-on-surface hover:text-primary cursor-pointer line-clamp-2 mb-2"
                    >
                      {doc.title}
                    </h2>
                  )}

                  {/* Summary / Snippet */}
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed mb-4">
                    {doc.summary || doc.originalText.slice(0, 140)}...
                  </p>
                </div>

                <div>
                  {/* Reading Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[11px] font-bold text-on-surface-variant mb-1">
                      <span>Progress</span>
                      <span>{doc.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${doc.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-surface-container-highest">
                    <button
                      type="button"
                      onClick={() => handleOpenDoc(doc.id)}
                      className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-1.5 touch-target"
                    >
                      <span>Continue</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartRename(doc.id, doc.title)}
                        className="p-2 text-on-surface-variant hover:text-primary rounded-full"
                        title="Rename document"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDocument(doc.id)}
                        className="p-2 text-on-surface-variant hover:text-error rounded-full"
                        title="Delete document"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

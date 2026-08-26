'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';
import { PDFService } from '@/services/pdf.service';
import { DocumentService } from '@/services/document.service';

export default function UploadPage() {
  const router = useRouter();
  const { addDocument, registerDocument, setCurrentDocumentId } = useReader();

  const [pastedText, setPastedText] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('Uploading...');
  const [processingPercent, setProcessingPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartReadingPasted = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Please enter or paste some text first.');
      return;
    }
    setErrorMsg(null);
    const title = docTitle.trim() || pastedText.slice(0, 30).trim() + '...';
    const formatted = PDFService.cleanPDFText(pastedText);
    const detectedLang = PDFService.detectLanguage(formatted);

    const newDoc = addDocument({
      title,
      originalText: formatted,
      processedText: formatted,
      language: detectedLang,
      sourceFormat: 'text',
      wordCount: formatted.trim().split(/\s+/).length,
    });
    router.push(`/read/${newDoc.id}`);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const formatted = PDFService.cleanPDFText(text);
      setPastedText(formatted);
      if (!docTitle) {
        setDocTitle('Pasted Clip ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch {
      setErrorMsg('Clipboard permission was denied. Please paste manually into the box.');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setProcessingPercent(10);
    setProcessingStage('Uploading document...');

    try {
      const digitised = await DocumentService.digitise(file, {
        onStageChange: (stage) => {
          if (stage === 'uploading') setProcessingStage('Uploading document...');
          else if (stage === 'processing') setProcessingStage('Processing document...');
          else if (stage === 'extracting') setProcessingStage('Extracting text...');
          else if (stage === 'formatting') setProcessingStage('Formatting content...');
          else if (stage === 'complete') setProcessingStage('Complete!');
        },
        onProgress: (pct) => setProcessingPercent(pct),
      });

      // Synchronize directly with ReaderContext
      registerDocument(digitised);
      setCurrentDocumentId(digitised.id);

      setIsProcessing(false);
      router.push(`/read/${digitised.id}`);
    } catch (err) {
      console.warn('Upload/OCR failed:', err);
      setIsProcessing(false);
      setErrorMsg('Failed to process document. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 pb-32">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-primary mb-2">
          Upload Reading Material
        </h1>
        <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-2xl border-2 border-surface-container-highest">
          <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">auto_awesome</span>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Your personalized settings are applied automatically — all uploaded PDFs, images, or notes will be cleaned, un-hyphenated, and reflowed for comfortable reading.
          </p>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error font-medium text-xs sm:text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="p-1 hover:bg-error/20 rounded-full"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Multi-step Processing Modal Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-primary flex items-center justify-center mx-auto animate-pulse">
              <span className="material-symbols-outlined text-3xl">document_scanner</span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-on-surface mb-1">
                Digitising & Reflowing
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                {processingStage}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden p-0.5 border border-outline-variant">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${processingPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-on-surface-variant">
                <span>Reflow Pipeline</span>
                <span>{processingPercent}%</span>
              </div>
            </div>

            {/* Steps indicator */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-surface-container-highest text-[10px] font-bold text-on-surface-variant">
              <span className={processingPercent >= 20 ? 'text-primary' : ''}>Upload</span>
              <span className={processingPercent >= 40 ? 'text-primary' : ''}>Process</span>
              <span className={processingPercent >= 70 ? 'text-primary' : ''}>Extract</span>
              <span className={processingPercent >= 90 ? 'text-primary' : ''}>Format</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Left: Drag & Drop File Upload */}
        <section
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl border-3 border-dashed transition-all duration-200 text-center ${
            isDragging
              ? 'border-primary bg-secondary-container/30 scale-[1.01]'
              : 'border-outline-variant bg-surface-container-lowest hover:border-primary/50'
          }`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4 shadow-sm">
            <span className="material-symbols-outlined text-3xl sm:text-4xl">cloud_upload</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-on-surface mb-1">
            Drop PDF, Image, or Text File
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xs mb-6">
            Supports PDF documents, textbook photos, scanned pages, or notes up to 25MB.
          </p>

          <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm shadow-md hover:bg-on-primary-fixed-variant transition-colors touch-target">
            <span className="material-symbols-outlined text-lg">folder_open</span>
            <span>Browse Files</span>
            <input
              type="file"
              accept=".pdf,.txt,.md,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </label>
        </section>

        {/* Right: Quick Text Paste & Editor */}
        <section className="bg-surface-container-lowest rounded-3xl border-2 border-surface-container-highest p-5 sm:p-7 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
                Paste or Write Text
              </h2>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="px-3 py-1.5 rounded-full bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors flex items-center gap-1 touch-target border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-sm">content_paste</span>
                Paste Clipboard
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                  Document Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 4: Photosynthesis Notes"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-surface-container-highest rounded-xl text-xs sm:text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                  Text Content
                </label>
                <textarea
                  rows={7}
                  placeholder="Paste textbook excerpts, homework problems, articles, or notes here..."
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full p-3 bg-surface-container-low border border-surface-container-highest rounded-xl text-xs sm:text-sm text-on-surface leading-relaxed focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartReadingPasted}
            disabled={!pastedText.trim()}
            className="w-full py-3 px-6 rounded-full bg-primary text-on-primary font-bold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 shadow-md touch-target"
          >
            <span className="material-symbols-outlined text-lg">auto_stories</span>
            <span>Start Reading in Accessible Mode</span>
          </button>
        </section>
      </div>
    </div>
  );
}

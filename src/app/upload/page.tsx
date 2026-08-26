'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';
import { PDFService } from '@/services/pdf.service';
import { DocumentService } from '@/services/document.service';

export default function UploadPage() {
  const router = useRouter();
  const { addDocument } = useReader();

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
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Multistep Processing Modal Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-bright rounded-3xl p-8 max-w-md w-full border-2 border-surface-container-highest shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">Digitising Document</h3>
            <p className="text-xs text-on-surface-variant mb-6">{processingStage}</p>

            {/* Progress Bar */}
            <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${processingPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-primary">{processingPercent}%</span>
          </div>
        </div>
      )}

      {/* Bento Grid for Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Option 1: PDF & Image Upload */}
        <section className="flex flex-col bg-surface-bright rounded-2xl border-2 border-surface-container-highest overflow-hidden focus-within:border-primary transition-colors shadow-sm">
          <div className="p-5 sm:p-6 border-b-2 border-surface-container-highest bg-surface-container-lowest">
            <h2 className="text-lg font-bold text-on-surface">
              Upload PDF or Image
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Supports PDF, PNG, JPG, JPEG with automated structure formatting.
            </p>
          </div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`p-6 flex-grow flex flex-col items-center justify-center gap-4 min-h-[260px] sm:min-h-[300px] border-2 border-dashed rounded-xl m-4 sm:m-6 transition-colors cursor-pointer relative group ${
              isDragging
                ? 'border-primary bg-secondary-container'
                : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              aria-label="Upload document file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="w-16 h-16 rounded-full bg-secondary-container text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-on-surface">
                Drag and drop your file here
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                or tap to browse (PDF, PNG, JPG, TXT)
              </p>
            </div>
            <div className="mt-2 inline-flex items-center justify-center px-6 py-2.5 bg-surface-container border border-surface-container-highest rounded-full text-xs font-bold text-on-surface group-hover:bg-surface-container-high transition-colors touch-target">
              Choose file
            </div>
          </div>
        </section>

        {/* Option 2: Paste Text */}
        <section className="flex flex-col bg-surface-bright rounded-2xl border-2 border-surface-container-highest overflow-hidden focus-within:border-primary transition-colors shadow-sm">
          <div className="p-5 sm:p-6 border-b-2 border-surface-container-highest bg-surface-container-lowest">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-on-surface">
                Paste Text / Notes
              </h2>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-xs font-bold text-primary hover:bg-surface-container p-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">content_paste</span>
                Paste from clipboard
              </button>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Auto-formats articles, chapters, emails, or study notes.
            </p>
          </div>
          <div className="p-5 sm:p-6 flex-grow flex flex-col gap-3">
            <input
              type="text"
              placeholder="Optional title (e.g. Science Chapter 4)"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full p-3 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl text-sm font-medium text-on-background focus:ring-0 focus:border-primary"
            />
            <textarea
              id="text-input"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-full min-h-[160px] sm:min-h-[200px] p-4 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl text-sm font-body-lg text-on-background focus:ring-0 focus:border-primary resize-none"
            />
            <div className="mt-1 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-on-surface-variant self-start sm:self-center">
                {pastedText.trim() ? `${pastedText.trim().split(/\s+/).length} words` : '0 words'}
              </span>
              <button
                type="button"
                onClick={handleStartReadingPasted}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-primary text-on-primary rounded-full text-xs sm:text-sm font-bold hover:bg-on-primary-fixed-variant transition-colors min-h-[3rem] shadow-sm active:scale-95 touch-target"
              >
                Start reading
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

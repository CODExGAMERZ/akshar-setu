'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReader } from '@/context/ReaderContext';
import { PDFService } from '@/services/pdf.service';
import { StorageService } from '@/lib/storage';

export default function UploadPage() {
  const router = useRouter();
  const { addDocument } = useReader();

  const [pastedText, setPastedText] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
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

    const formData = new FormData();
    formData.append('file', file);

    const apiConfig = StorageService.getApiConfig();
    const userApiKey = apiConfig.geminiKey || apiConfig.openaiKey || apiConfig.groqKey || '';

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'x-user-api-key': userApiKey,
          'x-ai-provider': apiConfig.provider || 'server-default',
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to parse uploaded document');
      }

      const data = await res.json();
      const newDoc = addDocument({
        title: data.title || file.name.replace(/\.[^/.]+$/, ''),
        originalText: data.text,
        processedText: data.text,
        language: data.language || 'en',
        sourceFormat: 'pdf',
        wordCount: data.text.trim().split(/\s+/).length,
      });
      setIsProcessing(false);
      router.push(`/read/${newDoc.id}`);
    } catch {
      // Fallback: Read as text with client-side formatting
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawContent = (e.target?.result as string) || 'Sample document content extracted from ' + file.name;
        const cleanContent = PDFService.cleanPDFText(rawContent);
        const detectedLang = PDFService.detectLanguage(cleanContent);

        const newDoc = addDocument({
          title: file.name.replace(/\.[^/.]+$/, ''),
          originalText: cleanContent,
          processedText: cleanContent,
          language: detectedLang,
          sourceFormat: 'pdf',
          wordCount: cleanContent.trim().split(/\s+/).length,
        });
        setIsProcessing(false);
        router.push(`/read/${newDoc.id}`);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-background font-bold mb-3 sm:mb-4">
          Upload material
        </h2>
        <div className="flex items-start gap-3 bg-surface-container-low p-4 rounded-xl border-2 border-surface-container-highest">
          <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5">info</span>
          <p className="text-sm sm:text-body-md font-body-md text-on-surface-variant">
            Your personalized settings are ready — anything you bring in will be automatically reflowed and formatted for comfortable reading.
          </p>
        </div>
      </header>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container font-medium text-sm flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {errorMsg}
        </div>
      )}

      {/* Bento Grid for Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Option 1: PDF Upload */}
        <section className="flex flex-col bg-surface-bright rounded-xl border-2 border-surface-container-highest overflow-hidden focus-within:border-primary transition-colors shadow-sm">
          <div className="p-5 sm:p-6 border-b-2 border-surface-container-highest bg-surface-container-lowest">
            <h3 className="text-lg sm:text-headline-md font-headline-md text-on-background font-bold">
              Upload a PDF
            </h3>
            <p className="text-xs sm:text-body-md font-body-md text-on-surface-variant mt-1 sm:mt-2">
              Automatically cleans headers, un-hyphenates line splits, and reflows into comfortable paragraphs.
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
                ? 'border-primary bg-surface-container-low'
                : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              aria-label="Upload PDF file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">
                {isProcessing ? 'hourglass_top' : 'picture_as_pdf'}
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm sm:text-body-lg font-body-lg font-bold text-on-background">
                {isProcessing ? 'Extracting & reflowing document...' : 'Drag and drop your file here'}
              </p>
              <p className="text-xs sm:text-body-md font-body-md text-on-surface-variant mt-1">
                or tap to browse from your device (PDF, TXT, DOCX)
              </p>
            </div>
            <div className="mt-2 sm:mt-4 inline-flex items-center justify-center px-6 py-2.5 sm:py-3 bg-surface-container border-2 border-surface-container-highest rounded-full text-xs sm:text-label-md font-label-md text-on-surface-variant group-hover:bg-surface-container-high transition-colors font-bold touch-target">
              Choose file
            </div>
          </div>
        </section>

        {/* Option 2: Paste Text */}
        <section className="flex flex-col bg-surface-bright rounded-xl border-2 border-surface-container-highest overflow-hidden focus-within:border-primary transition-colors shadow-sm">
          <div className="p-5 sm:p-6 border-b-2 border-surface-container-highest bg-surface-container-lowest">
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-headline-md font-headline-md text-on-background font-bold">
                Paste text
              </h3>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-xs sm:text-label-md font-label-md text-primary hover:bg-surface-container p-2 rounded-lg transition-colors flex items-center gap-1.5 font-bold"
              >
                <span className="material-symbols-outlined text-sm">content_paste</span>
                Paste from clipboard
              </button>
            </div>
            <p className="text-xs sm:text-body-md font-body-md text-on-surface-variant mt-1 sm:mt-2">
              Auto-formats articles, chapters, emails, or class notes.
            </p>
          </div>
          <div className="p-5 sm:p-6 flex-grow flex flex-col gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Optional title (e.g. Science Chapter 4)"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full p-3 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl text-sm sm:text-body-md font-medium text-on-background focus:ring-0 focus:border-primary focus:outline-none"
            />
            <label className="sr-only" htmlFor="text-input">
              Paste your text here
            </label>
            <textarea
              id="text-input"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-full min-h-[160px] sm:min-h-[200px] p-4 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl text-sm sm:text-body-lg font-body-lg text-on-background focus:ring-0 focus:border-primary focus:outline-none resize-none placeholder:text-outline-variant"
            />
            <div className="mt-1 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-on-surface-variant self-start sm:self-center">
                {pastedText.trim() ? `${pastedText.trim().split(/\s+/).length} words` : '0 words'}
              </span>
              <button
                type="button"
                onClick={handleStartReadingPasted}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-primary text-on-primary rounded-full text-sm sm:text-label-md font-label-md font-bold hover:bg-on-primary-fixed-variant transition-colors min-h-[3rem] shadow-sm active:scale-95 touch-target"
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

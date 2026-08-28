'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Loader2, 
  Sparkles, 
  FileCode, 
  Image as ImageIcon,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DocumentUploaderModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, uploadAndDigitise, navigateToReader, showNotification } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'processing' | 'extracting' | 'formatting' | 'success' | 'error'>('idle');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);
  const [previewSnippet, setPreviewSnippet] = useState<string>('');
  const [extractedWordCount, setExtractedWordCount] = useState<number>(0);

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setUploadStep('uploading');
    setErrorMessage(null);

    try {
      await new Promise(r => setTimeout(r, 350));
      setUploadStep('processing');
      
      await new Promise(r => setTimeout(r, 450));
      setUploadStep('extracting');
      
      await new Promise(r => setTimeout(r, 400));
      setUploadStep('formatting');

      const doc = await uploadAndDigitise(file);
      setCreatedDocId(doc.id);
      const firstPageText = doc.pages?.[0]?.content || '';
      const words = firstPageText.match(/\S+/g) || [];
      setExtractedWordCount(words.length);
      setPreviewSnippet(firstPageText.slice(0, 260).trim());
      setUploadStep('success');

      showNotification(
        `Successfully digitized "${file.name}" with multimodal OCR!`,
        'success',
        'Document Ready'
      );
    } catch (err: any) {
      console.warn('OCR error:', err);
      setUploadStep('error');
      setErrorMessage(err?.message || 'Failed to digitize document. Please check the file and try again.');
      showNotification(
        err?.message || 'Digitisation failed.',
        'error',
        'Upload Error'
      );
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadStep('idle');
    setErrorMessage(null);
    setCreatedDocId(null);
    setPreviewSnippet('');
    setExtractedWordCount(0);
    setIsUploadModalOpen(false);
  };

  const handleFinishAndRead = () => {
    if (createdDocId) {
      navigateToReader(createdDocId);
    }
    handleClose();
  };

  return (
    <Modal
      isOpen={isUploadModalOpen}
      onClose={handleClose}
      title="Universal Document Ingestion & Vision OCR"
      subtitle="Reflows textbook PDFs, scanned homework worksheets, and photos into accessible text"
      maxWidth="lg"
    >
      <div className="space-y-5 text-[#26231E]">
        {uploadStep === 'idle' && (
          <div className="space-y-4">
            <label
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`block p-8 border-2 border-dashed rounded-3xl text-center transition-all cursor-pointer group relative overflow-hidden ${
                isDragOver 
                  ? 'border-[#D97706] bg-[#FEF9EB] ring-4 ring-[#D97706]/15 scale-[1.01]' 
                  : 'border-[#D8CEB9] hover:border-[#D97706] bg-[#FAF3E0] hover:bg-[#FEF9EB]'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />
              <div className="flex flex-col items-center space-y-3.5">
                <div className="w-16 h-16 rounded-2xl bg-[#FEF9EB] text-[#D97706] flex items-center justify-center border border-[#E7DFCA] group-hover:scale-110 group-hover:shadow-md transition-all shadow-xs">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-bold text-[#1E1B18]">
                    Drop textbook PDF, worksheet photo, or image here
                  </p>
                  <p className="text-xs text-[#706655]">
                    or <span className="text-[#D97706] font-bold underline underline-offset-2">Browse Files</span> from your device
                  </p>
                </div>
                
                {/* Format Pills */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  {[
                    { label: 'PDF Textbooks', icon: <FileText className="w-3 h-3" /> },
                    { label: 'JPG / PNG / WEBP Photos', icon: <ImageIcon className="w-3 h-3" /> },
                    { label: 'TXT Documents', icon: <FileCode className="w-3 h-3" /> },
                  ].map(fmt => (
                    <span 
                      key={fmt.label} 
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#FAF1DA] text-[#8C6D23] border border-[#E4D5AD] flex items-center gap-1.5 shadow-2xs"
                    >
                      {fmt.icon}
                      {fmt.label}
                    </span>
                  ))}
                </div>
              </div>
            </label>

            {/* Privacy Guarantee Banner */}
            <div className="flex items-center gap-2 p-3 bg-[#FAF3E0]/70 border border-[#E7DFCA] rounded-2xl text-[11px] text-[#706655]">
              <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>
                <strong>Zero-Distortion OCR</strong>: Preserves paragraph structures, equations, and headings while removing optical glare.
              </span>
            </div>
          </div>
        )}

        {(uploadStep === 'uploading' || uploadStep === 'processing' || uploadStep === 'extracting' || uploadStep === 'formatting') && (
          <div className="py-8 space-y-6 text-center">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF1DA] text-[#D97706] flex items-center justify-center border border-[#E4D5AD] shadow-inner">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-[#1E1B18] tracking-tight">
                {uploadStep === 'uploading' && 'Ingesting Document Data...'}
                {uploadStep === 'processing' && 'Running Multimodal Vision OCR...'}
                {uploadStep === 'extracting' && 'Extracting Words & Sentence Phonetics...'}
                {uploadStep === 'formatting' && 'Reflowing into Personalized Layout...'}
              </h4>
              <p className="text-xs font-mono text-[#706655]">
                {selectedFile?.name} ({(selectedFile?.size ? (selectedFile.size / 1024).toFixed(1) : '32')} KB)
              </p>
            </div>

            {/* Stepper Pipeline */}
            <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto text-xs font-semibold">
              {[
                { step: 'uploading', label: '1. Ingest' },
                { step: 'processing', label: '2. Vision OCR' },
                { step: 'extracting', label: '3. Tokenize' },
                { step: 'formatting', label: '4. Reflow' }
              ].map((s) => {
                const isActive = uploadStep === s.step;
                return (
                  <div 
                    key={s.step} 
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isActive 
                        ? 'bg-[#26231E] text-[#FEF9EB] border-[#26231E] shadow-md scale-105' 
                        : 'bg-[#FAF3E0] border-[#E7DFCA] text-[#706655]'
                    }`}
                  >
                    {s.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {uploadStep === 'success' && (
          <div className="py-4 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EDF5EC] text-[#047857] flex items-center justify-center mx-auto border border-[#CBDBCB] shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-[#1E1B18]">Digitisation Complete!</h4>
              <p className="text-xs text-[#706655]">
                Your material is tokenized and ready for personalized typography, TTS, and translation.
              </p>
            </div>

            <div className="p-4 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-xl bg-[#FEF9EB] border border-[#E7DFCA] text-[#D97706]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#1E1B18] truncate">{selectedFile?.name}</p>
                    <p className="text-[11px] text-[#706655]">Reflowed into Accessible Reading Format</p>
                  </div>
                </div>
                {extractedWordCount > 0 && (
                  <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#EDF5EC] text-[#1E3A2F] border border-[#CBDBCB]">
                    {extractedWordCount} words
                  </span>
                )}
              </div>

              {previewSnippet && (
                <div className="p-3.5 bg-[#FEF9EB] border border-[#E7DFCA] rounded-xl space-y-1.5 shadow-inner">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#706655]">
                    <span>Extracted Text Snippet</span>
                    <span className="text-[#D97706]">Ready for Speech</span>
                  </div>
                  <p className="text-xs text-[#524B40] leading-relaxed line-clamp-3 italic">
                    "{previewSnippet}..."
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Return to Library
              </Button>
              <Button
                variant="accent"
                icon={<BookOpen className="w-4 h-4" />}
                onClick={handleFinishAndRead}
              >
                Open in Reader Now
              </Button>
            </div>
          </div>
        )}

        {uploadStep === 'error' && (
          <div className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto border border-[#FECACA]">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#1E1B18]">Digitisation Incomplete</h4>
              <p className="text-xs text-[#DC2626] font-medium">{errorMessage}</p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setUploadStep('idle')}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

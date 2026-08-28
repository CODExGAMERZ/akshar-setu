'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DocumentUploaderModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, uploadAndDigitise, navigateToReader } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'processing' | 'extracting' | 'formatting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);
  const [previewSnippet, setPreviewSnippet] = useState<string>('');

  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setUploadStep('uploading');
    setErrorMessage(null);

    try {
      // Simulate realistic multi-stage mock OCR processing
      await new Promise(r => setTimeout(r, 400));
      setUploadStep('processing');
      
      await new Promise(r => setTimeout(r, 500));
      setUploadStep('extracting');
      
      await new Promise(r => setTimeout(r, 450));
      setUploadStep('formatting');

      const doc = await uploadAndDigitise(file);
      setCreatedDocId(doc.id);
      // Extract preview from first page content
      const firstPageText = doc.pages?.[0]?.content || '';
      setPreviewSnippet(firstPageText.slice(0, 250).trim());
      setUploadStep('success');
    } catch (err: any) {
      console.warn('OCR error:', err);
      setUploadStep('error');
      setErrorMessage(err?.message || 'Failed to digitize document. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
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
      title="Upload & Digitize Document"
      subtitle="Accepts textbook PDFs, lesson worksheets, and scanned learning sheets"
      maxWidth="lg"
    >
      <div className="space-y-5 text-[#26231E]">
        {uploadStep === 'idle' && (
          <div className="space-y-4">
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="block p-8 border-2 border-dashed border-[#D8CEB9] hover:border-[#D97706] rounded-2xl text-center bg-[#FAF3E0] hover:bg-[#FEF9EB] transition-all cursor-pointer group"
            >
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FEF9EB] text-[#D97706] flex items-center justify-center border border-[#E7DFCA] group-hover:scale-105 transition-transform shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#1E1B18]">
                    Drop your document or image here
                  </p>
                  <p className="text-xs text-[#706655]">
                    or <span className="text-[#D97706] font-semibold underline">Choose File</span> from your computer
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {['PDF', 'JPG', 'PNG', 'WEBP', 'TXT'].map(fmt => (
                    <span key={fmt} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAF1DA] text-[#8C6D23] border border-[#E4D5AD]">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </label>

          </div>
        )}


        {(uploadStep === 'uploading' || uploadStep === 'processing' || uploadStep === 'extracting' || uploadStep === 'formatting') && (
          <div className="py-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF1DA] text-[#D97706] flex items-center justify-center mx-auto border border-[#E4D5AD]">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-[#1E1B18]">
                {uploadStep === 'uploading' && 'Uploading Document...'}
                {uploadStep === 'processing' && 'Processing layout & structural elements...'}
                {uploadStep === 'extracting' && 'Extracting text and phonetic boundaries...'}
                {uploadStep === 'formatting' && 'Reflowing text to personalized preferences...'}
              </h4>
              <p className="text-xs text-[#706655]">
                {selectedFile?.name} ({(selectedFile?.size ? (selectedFile.size / 1024).toFixed(1) : '24')} KB)
              </p>
            </div>

            {/* Multi-step pipeline pill markers */}
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto text-[11px]">
              <div className={`p-1.5 rounded-lg border text-center ${
                uploadStep === 'uploading' ? 'bg-[#FAF1DA] border-[#D97706] font-bold text-[#8C6D23]' : 'bg-[#FAF3E0] border-[#E7DFCA] text-[#706655]'
              }`}>
                1. Upload
              </div>
              <div className={`p-1.5 rounded-lg border text-center ${
                uploadStep === 'processing' ? 'bg-[#FAF1DA] border-[#D97706] font-bold text-[#8C6D23]' : 'bg-[#FAF3E0] border-[#E7DFCA] text-[#706655]'
              }`}>
                2. OCR
              </div>
              <div className={`p-1.5 rounded-lg border text-center ${
                uploadStep === 'extracting' ? 'bg-[#FAF1DA] border-[#D97706] font-bold text-[#8C6D23]' : 'bg-[#FAF3E0] border-[#E7DFCA] text-[#706655]'
              }`}>
                3. Extract
              </div>
              <div className={`p-1.5 rounded-lg border text-center ${
                uploadStep === 'formatting' ? 'bg-[#FAF1DA] border-[#D97706] font-bold text-[#8C6D23]' : 'bg-[#FAF3E0] border-[#E7DFCA] text-[#706655]'
              }`}>
                4. Reflow
              </div>
            </div>
          </div>
        )}

        {uploadStep === 'success' && (
          <div className="py-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#EDF5EC] text-[#047857] flex items-center justify-center mx-auto border border-[#CBDBCB]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-[#1E1B18]">Digitisation Complete!</h4>
              <p className="text-xs text-[#706655]">
                Your document has been extracted into high-readability accessible format.
              </p>
            </div>

            <div className="p-4 bg-[#FAF3E0] border border-[#E7DFCA] rounded-xl space-y-2 text-left">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#D97706] shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#1E1B18] truncate">{selectedFile?.name}</p>
                  <p className="text-[11px] text-[#706655]">Ready for personalized reading, TTS & translation</p>
                </div>
              </div>
              {previewSnippet && (
                <div className="p-3 bg-[#FEF9EB] border border-[#E7DFCA] rounded-lg">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#706655] mb-1">Extracted Text Preview:</p>
                  <p className="text-xs text-[#524B40] leading-relaxed line-clamp-4">{previewSnippet}...</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Go to Library
              </Button>
              <Button
                variant="accent"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleFinishAndRead}
              >
                Open in Reader Now
              </Button>
            </div>
          </div>
        )}

        {uploadStep === 'error' && (
          <div className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#1E1B18]">Digitisation Failed</h4>
              <p className="text-xs text-[#DC2626]">{errorMessage}</p>
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

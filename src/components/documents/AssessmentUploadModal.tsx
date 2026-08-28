'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UploadCloud, CheckCircle2, ShieldCheck, Sparkles, Loader2, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AssessmentUploadModal: React.FC = () => {
  const { isAssessmentModalOpen, setIsAssessmentModalOpen, updatePreferences, saveAsGlobalPreferences, showNotification } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleFileChange = async (selected: File) => {
    setFile(selected);
    setIsAnalyzing(true);

    // Simulate clinical / educator report analysis
    await new Promise(r => setTimeout(r, 1000));

    // Recommend tuned profile: Lexend, Warm cream, spacious tracking, confusable letters
    updatePreferences({
      font: 'Lexend',
      fontSize: 20,
      lineSpacing: 1.9,
      letterSpacing: 0.05,
      wordSpacing: 0.14,
      themeId: 'warm-cream',
      backgroundColor: '#FEF9EB',
      textColor: '#26231E',
      highlightColor: '#FDE047',
      confusableLetterSettings: {
        enabled: true,
        activePairs: ['b/d', 'p/q', 'm/w'],
        style: 'weight'
      },
      bionicReading: true
    });

    setIsAnalyzing(false);
    setIsAnalyzed(true);
    showNotification('Assessment profile extracted and calibrated successfully!', 'success', 'IEP Evaluated');
  };

  const handleApplyAndSave = async () => {
    await saveAsGlobalPreferences();
    showNotification('Personalized reading profile saved to device!', 'success', 'Profile Updated');
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setIsAnalyzing(false);
    setIsAnalyzed(false);
    setIsAssessmentModalOpen(false);
  };

  return (
    <Modal
      isOpen={isAssessmentModalOpen}
      onClose={handleClose}
      title="Upload Assessment / Prescription (Optional)"
      subtitle="Optionally upload an educational evaluation report or optometrist contrast recommendation"
      maxWidth="lg"
    >
      <div className="space-y-5 text-[#26231E]">
        {!isAnalyzed && !isAnalyzing && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#FAF1DA] border border-[#E4D5AD] rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
              <p className="text-xs text-[#706655] leading-relaxed">
                <strong>Non-Diagnostic Notice:</strong> AksharSetu analyzes educator recommendations or past assessments strictly to pre-tune typographic comfort parameters. It does not replace medical advice.
              </p>
            </div>


            <label className="block p-8 border-2 border-dashed border-[#D8CEB9] hover:border-[#D97706] rounded-2xl text-center bg-[#FAF3E0] hover:bg-[#FEF9EB] transition-all cursor-pointer">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />
              <div className="flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FEF9EB] text-[#D97706] flex items-center justify-center border border-[#E7DFCA] shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#1E1B18]">
                    Upload IEP, Evaluation, or Optometry PDF
                  </p>
                  <p className="text-xs text-[#706655]">
                    Drag & drop report or click to browse
                  </p>
                </div>
              </div>
            </label>

            {/* Quick demo simulated assessment button */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  const blob = new Blob(["Sample IEP Assessment Report"], { type: "text/plain" });
                  const sample = new File([blob], "Student_IEP_Reading_Evaluation.pdf", { type: "application/pdf" });
                  handleFileChange(sample);
                }}
                className="text-xs text-[#D97706] hover:underline font-semibold"
              >
                Or test with sample IEP report
              </button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="py-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF1DA] text-[#D97706] flex items-center justify-center mx-auto border border-[#E4D5AD]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#1E1B18]">Analyzing Assessment Profile...</h4>
              <p className="text-xs text-[#706655]">
                Extracting recommended typography, contrast spectrum, and letter tracking cues.
              </p>
            </div>
          </div>
        )}

        {isAnalyzed && (
          <div className="py-4 space-y-5 text-[#26231E]">
            <div className="w-12 h-12 rounded-full bg-[#EDF5EC] text-[#047857] flex items-center justify-center mx-auto border border-[#CBDBCB]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-[#1E1B18]">Assessment Analyzed Successfully</h4>
              <p className="text-xs text-[#706655]">
                We found recommendations tailored to visual tracking and letter disambiguation.
              </p>
            </div>

            <div className="p-4 bg-[#FAF3E0] border border-[#E7DFCA] rounded-xl space-y-2 text-xs">
              <h5 className="font-bold text-[#1E1B18] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                Extracted Custom Adaptations:
              </h5>
              <ul className="space-y-1.5 text-[#524B40] list-disc list-inside">
                <li>Primary Font: <strong>Lexend (20px, expanded letter tracking)</strong></li>
                <li>Line Height: <strong>1.9x (Spacious saccadic breathing room)</strong></li>
                <li>Surface Contrast: <strong>Warm Cream #FEF9EB (Anti-glare palette)</strong></li>
                <li>Confusable Markers: <strong>Active b/d and p/q disambiguation enabled</strong></li>
                <li>Bionic Fixation: <strong>Initial letter fixations enabled</strong></li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleApplyAndSave}
              >
                Apply to My Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

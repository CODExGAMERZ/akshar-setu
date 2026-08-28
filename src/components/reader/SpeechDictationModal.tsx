'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { translationService } from '../../services/translationService';
import { SUPPORTED_LANGUAGES } from '../../data/themes';
import { 
  Mic, 
  MicOff, 
  Languages, 
  Volume2, 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  RotateCcw,
  Loader2,
  Radio,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const SpeechDictationModal: React.FC = () => {
  const { 
    isDictationModalOpen, 
    setIsDictationModalOpen, 
    startTTS, 
    uploadAndDigitise,
    navigateToReader,
    currentLanguage,
    showNotification
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-IN');
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [targetLang, setTargetLang] = useState(currentLanguage || 'hi');
  const [translatedResult, setTranslatedResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = speechLang;

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalChunk = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalChunk += event.results[i][0].transcript + ' ';
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (finalChunk) {
            setTranscript(prev => (prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim()));
          }
          setInterimText(currentInterim);
        };

        recognition.onerror = (e: any) => {
          console.warn('SpeechRecognition error:', e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [speechLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showNotification(
        'Speech recognition is not supported in this browser. You can type or paste notes directly into the box.',
        'warning',
        'Microphone Unsupported'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      showNotification('Microphone paused.', 'info');
    } else {
      try {
        recognitionRef.current.lang = speechLang;
        recognitionRef.current.start();
        setIsListening(true);
        showNotification('Listening... Speak into your microphone now.', 'info', 'Live Microphone');
      } catch (err) {
        console.warn('Speech start error:', err);
      }
    }
  };

  const handleTranslate = async () => {
    const textToTranslate = transcript || interimText;
    if (!textToTranslate.trim()) return;

    setIsTranslating(true);
    try {
      const res = await translationService.translate(textToTranslate, speechLang, targetLang);
      setTranslatedResult(res.translatedText);
      showNotification('Speech translated successfully via Sarvam AI Mayura!', 'success', 'Translation Complete');
    } catch (e) {
      console.warn('Dictation translation error:', e);
      showNotification('Translation failed. Please check network connectivity.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReadAloud = (text: string) => {
    if (!text.trim()) return;
    startTTS(text);
    showNotification('Playing synchronized audio...', 'info');
  };

  const handleSaveAsDocument = async () => {
    const text = translatedResult || transcript;
    if (!text.trim()) return;

    try {
      const file = new File([text], `Voice_Note_${new Date().toLocaleDateString().replace(/\//g, '-')}.txt`, {
        type: 'text/plain'
      });

      const newDoc = await uploadAndDigitise(file);
      setIsDictationModalOpen(false);
      navigateToReader(newDoc.id);
      showNotification('Saved to your library and reflowed in Accessible Reader!', 'success', 'Note Created');
    } catch (err) {
      showNotification('Failed to create document from voice notes.', 'error');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showNotification('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsDictationModalOpen(false);
  };

  const wordsCount = (transcript + (interimText ? ` ${interimText}` : '')).trim().split(/\s+/).filter(Boolean).length;

  return (
    <Modal
      isOpen={isDictationModalOpen}
      onClose={handleClose}
      title="Real-Time Speech Dictation & Voice Translation"
      subtitle="Speak in any Indian or global language, live transcribe, translate, and synthesize speech"
      maxWidth="2xl"
    >
      <div className="space-y-5 text-[#26231E]">
        {/* Controls Bar: Speech Language & Recording Button */}
        <div className="p-4 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-[#D97706]" />
            <label className="text-xs font-bold text-[#1E1B18]">Spoken Language:</label>
            <select
              value={speechLang}
              onChange={(e) => setSpeechLang(e.target.value)}
              disabled={isListening}
              className="bg-[#FEF9EB] border border-[#D8CEB9] rounded-xl px-3 py-1.5 text-xs font-bold text-[#26231E] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleListening}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-500/25 animate-pulse'
                : 'bg-[#D97706] hover:bg-[#B45309] text-white ring-2 ring-[#D97706]/20'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Stop Dictation</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Start Speaking</span>
              </>
            )}
          </button>
        </div>

        {/* Live Transcript Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider">
                Live Spoken Transcript
              </label>
              {wordsCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF1DA] text-[#8C6D23] border border-[#E4D5AD]">
                  {wordsCount} words
                </span>
              )}
            </div>
            {transcript && (
              <button
                onClick={() => setTranscript('')}
                className="text-xs text-[#706655] hover:text-[#DC2626] flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Text
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              value={transcript + (interimText ? ` ${interimText}` : '')}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={isListening ? "Listening... Speak naturally into your microphone." : "Click 'Start Speaking' or type your notes here..."}
              rows={4}
              className="w-full p-4 rounded-2xl bg-[#FEF9EB] border border-[#D8CEB9] text-sm text-[#26231E] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 leading-relaxed font-sans shadow-inner"
            />
            {isListening && (
              <div className="absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[10px] font-bold border border-[#FECACA] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
                Live Microphone Active
              </div>
            )}
          </div>
        </div>

        {/* Translation Action Toolbar */}
        <div className="p-4 bg-[#FAF3E0] border border-[#E7DFCA] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Languages className="w-4 h-4 text-[#D97706]" />
            <span className="text-xs font-bold text-[#1E1B18]">Target Language:</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-[#FEF9EB] border border-[#D8CEB9] rounded-xl px-3 py-1.5 text-xs font-bold text-[#26231E] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Volume2 className="w-4 h-4 text-[#D97706]" />}
              onClick={() => handleReadAloud(transcript)}
              disabled={!transcript.trim()}
            >
              Listen (Source)
            </Button>

            <Button
              variant="accent"
              size="sm"
              icon={isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              onClick={handleTranslate}
              disabled={!transcript.trim() || isTranslating}
            >
              {isTranslating ? 'Translating...' : 'Translate Voice'}
            </Button>
          </div>
        </div>

        {/* Translated Speech Output */}
        {translatedResult && (
          <div className="p-4.5 bg-[#FEF9EB] border-2 border-[#D97706]/40 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E7DFCA] pb-2.5">
              <span className="text-xs font-bold text-[#1E1B18] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                Translated Output (Sarvam Mayura Indic Engine):
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(translatedResult)}
                  className="p-1.5 rounded-xl text-[#706655] hover:text-[#1E1B18] hover:bg-[#FAF3E0] transition-colors border border-transparent hover:border-[#E7DFCA]"
                  title="Copy translation"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Volume2 className="w-3.5 h-3.5 text-[#D97706]" />}
                  onClick={() => handleReadAloud(translatedResult)}
                >
                  Listen Translated
                </Button>
              </div>
            </div>
            <p className="text-sm text-[#1E1B18] leading-relaxed font-sans font-medium">
              {translatedResult}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E7DFCA]">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {(transcript || translatedResult) && (
              <Button
                variant="accent"
                icon={<BookOpen className="w-4 h-4" />}
                onClick={handleSaveAsDocument}
              >
                Save as Accessible Document
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

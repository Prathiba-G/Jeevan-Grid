import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  AlertCircle,
  Clock,
  HeartPulse,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { ExtractedEmergency, PatientCase } from '../types';
import { PRESET_CASES } from '../data/mockHospitals';

interface IntakePanelProps {
  patientCase: PatientCase;
  extractedEmergency: ExtractedEmergency | null;
  isAnalyzing: boolean;
  onAnalyzeEmergency: (reportText: string) => void;
  onSelectPreset: (preset: (typeof PRESET_CASES)[0]) => void;
}

export const IntakePanel: React.FC<IntakePanelProps> = ({
  patientCase,
  extractedEmergency,
  isAnalyzing,
  onAnalyzeEmergency,
  onSelectPreset,
}) => {
  const [reportText, setReportText] = useState(patientCase.symptomsReported);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setReportText(patientCase.symptomsReported);
  }, [patientCase.symptomsReported]);

  // Optional Voice Input via Web Speech API
  const toggleRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type or use presets.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setReportText(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition', err);
        setIsRecording(false);
      }
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim() || isAnalyzing) return;
    onAnalyzeEmergency(reportText);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Paramedic Field Report Input Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              PARAMEDIC FIELD REPORT
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            AI Intake Layer
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRESET_CASES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setReportText(preset.report);
                onSelectPreset(preset);
              }}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all border ${
                reportText.trim().startsWith(preset.report.slice(0, 20))
                  ? 'bg-cyan-950 text-cyan-200 border-cyan-500/60 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Textarea Form */}
        <form onSubmit={handleAnalyze} className="space-y-2.5">
          <div className="relative">
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              rows={3}
              placeholder="Enter paramedic's verbal field report or patient assessment..."
              className="w-full text-xs font-sans rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 p-2.5 pr-10 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 resize-none leading-relaxed"
            />
            <button
              type="button"
              onClick={toggleRecording}
              title={isRecording ? 'Stop Recording' : 'Voice Input (Dictate Emergency)'}
              className={`absolute right-2.5 top-2.5 p-1.5 rounded-md transition-all ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-400 hover:text-cyan-300'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Reported: {patientCase.reportedAt}</span>
              <span className="text-slate-600">|</span>
              <span>Onset: ~{patientCase.onsetMinutesAgo}m ago</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !reportText.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all font-mono"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>INTERPRETING...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ANALYZE EMERGENCY</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI Interpretation Layer Results */}
      {extractedEmergency && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Header & Urgency */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  EXTRACTED REQUIREMENTS
                </span>
              </div>
              <span
                className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded tracking-wider ${
                  extractedEmergency.urgency === 'critical'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                }`}
              >
                URGENCY: {extractedEmergency.urgency}
              </span>
            </div>

            {/* Suspected Condition Display with MANDATORY Clinical Disclaimer */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1.5">
              <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
                Suspected Clinical Condition:
              </div>
              <div className="text-sm font-bold text-white tracking-wide">
                {extractedEmergency.suspected_condition_display}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {extractedEmergency.clinical_summary}
              </p>

              {/* Strict Medical Safety Notice */}
              <div className="flex items-start gap-2 pt-1 mt-1 text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-800/40 rounded p-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-tight font-medium">
                  <strong>Safety Notice:</strong> Suspected condition based on reported field symptoms — clinical assessment required. Does NOT replace definitive physician diagnosis.
                </span>
              </div>
            </div>

            {/* Required Hospital Capabilities Checklist */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
                <span>Required Hospital Capabilities:</span>
                <span className="text-cyan-400 font-bold font-mono">
                  {extractedEmergency.required_capabilities.length} Mandatory
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {extractedEmergency.required_capabilities.map((cap) => {
                  const labelMap: Record<string, string> = {
                    emergency_department: 'Emergency Dept (ED)',
                    ct: 'CT Imaging Scanner',
                    neurology: 'Neurology Specialist',
                    icu: 'ICU Escalation Bed',
                    cathLab: 'Cardiac Cath Lab',
                    traumaSurgery: 'Trauma Surgery OR',
                  };
                  return (
                    <div
                      key={cap}
                      className="flex items-center gap-2 p-2 rounded-md bg-slate-950/90 border border-cyan-900/40 text-slate-200 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{labelMap[cap] || cap}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Pre-Arrival Pathway Preparation */}
            {extractedEmergency.recommended_pre_arrival_actions?.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Pre-Arrival Hospital Pathway Protocol:
                </div>
                <ul className="space-y-1 text-[11px] text-slate-300 font-sans">
                  {extractedEmergency.recommended_pre_arrival_actions.slice(0, 3).map((action, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-mono text-[10px] mt-0.5">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* AI Layer Attestation Footer */}
          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <Cpu className="w-3 h-3" />
              Gemini 3.8 Flash (Structured Parsing)
            </span>
            <span className="text-slate-500">Deterministic Engine Handoff →</span>
          </div>
        </div>
      )}
    </div>
  );
};

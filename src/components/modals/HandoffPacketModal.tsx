import React from 'react';
import { X, Printer, CheckCircle2, AlertCircle, FileText, ShieldCheck, Clock, Hospital } from 'lucide-react';
import { ExtractedEmergency, Hospital as HospitalType, PatientCase } from '../../types';

interface HandoffPacketModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientCase: PatientCase;
  extractedEmergency: ExtractedEmergency | null;
  hospital: HospitalType | null;
  tcc: number;
}

export const HandoffPacketModal: React.FC<HandoffPacketModalProps> = ({
  isOpen,
  onClose,
  patientCase,
  extractedEmergency,
  hospital,
  tcc,
}) => {
  if (!isOpen || !hospital) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close & Print Buttons */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Print or Export Packet"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Header */}
        <div className="border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              JEEVANGRID PRE-ARRIVAL EMERGENCY HANDOFF PACKET
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1 font-mono tracking-tight">
            CASE #{patientCase.id}
          </h2>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 mt-1">
            <span>DISPATCH TIME: {patientCase.reportedAt}</span>
            <span>•</span>
            <span>TRANSMITTED VIA: SECURE CLINICAL HL7 / FHIR GRID</span>
          </div>
        </div>

        {/* Core Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Patient Details */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
              PATIENT & CLINICAL ASSESSMENT
            </div>
            <div className="text-sm font-bold text-white">
              {patientCase.patientAge}-Year-Old {patientCase.patientGender}
            </div>
            <div className="text-xs text-slate-300 font-sans leading-relaxed">
              <strong>Reported Symptoms:</strong> {patientCase.symptomsReported}
            </div>
            <div className="text-[11px] font-mono text-amber-300">
              Reported Symptom Onset: ~{patientCase.onsetMinutesAgo} mins ago
            </div>
            {patientCase.vitals && (
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-0.5">
                <div>BP: {patientCase.vitals.bp} | Pulse: {patientCase.vitals.pulse} bpm</div>
                <div>SpO2: {patientCase.vitals.spo2}% | GCS: {patientCase.vitals.gcs}</div>
              </div>
            )}
          </div>

          {/* Receiving Hospital & Routing */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-emerald-400 uppercase font-semibold flex items-center justify-between">
              <span>DESTINATION & COORDINATION</span>
              <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                CONFIRMED
              </span>
            </div>
            <div className="text-sm font-bold text-white">
              {hospital.name} ({hospital.code})
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {hospital.location.address}
            </div>
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Ambulance ETA</div>
                <div className="text-sm font-bold text-cyan-400">{hospital.travelTime} min</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Confirmed TCC</div>
                <div className="text-sm font-bold text-emerald-400">{tcc} min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Required Resources & Preparation Status */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            RECEIVING HOSPITAL RESOURCE PREPARATION STATUS
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Non-Contrast CT Scanner Bay</span>
              </span>
              <span className="text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                PREPARING (GANTRY CLEARED)
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Neurology / Acute Stroke Attending</span>
              </span>
              <span className="text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                NOTIFIED & ON-STANDBY ({hospital.staffing.attendingNeurologist})
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Emergency Department Resuscitation Bay</span>
              </span>
              <span className="text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                RESERVED (BAY 1 PRIORITY)
              </span>
            </div>
          </div>
        </div>

        {/* Pre-Arrival Actions */}
        {extractedEmergency?.recommended_pre_arrival_actions && (
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 mb-5">
            <div className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">
              PRE-ARRIVAL PROTOCOL CHECKLIST
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-sans">
              {extractedEmergency.recommended_pre_arrival_actions.map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="text-[11px] text-slate-500 font-mono text-center border-t border-slate-800 pt-3">
          Simulated clinical handoff packet for hackathon demonstration. Clinical diagnosis must be confirmed by attending physicians upon physical arrival.
        </div>
      </div>
    </div>
  );
};

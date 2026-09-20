import React from 'react';
import { X, Network, Server, Globe2, ShieldCheck, CheckCircle2, Layers, Cpu } from 'lucide-react';

interface ScalabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScalabilityModal: React.FC<ScalabilityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const phases = [
    {
      phase: 'PHASE 1 (ACTIVE PROTOTYPE)',
      title: 'Single-City Working Prototype',
      scope: 'Simulated hospital telemetry, Gemini AI natural-language intake, deterministic TCC algorithm, dynamic re-routing demonstration.',
      status: 'Implemented Today',
      active: true,
    },
    {
      phase: 'PHASE 2 (NEAR-TERM)',
      title: 'Direct Hospital EHR & Ambulance Telemetry Integration',
      scope: 'Direct HL7 / FHIR APIs connecting hospital PACS/CT scanners and CAD (Computer Aided Dispatch) automated GPS feeds.',
      status: 'Ready for Integration',
      active: false,
    },
    {
      phase: 'PHASE 3 (REGIONAL)',
      title: 'Multi-Hospital Regional Emergency Care Grid',
      scope: 'State / Metropolitan emergency operations center coordinating 50+ acute care facilities and trauma networks with automated mutual aid.',
      status: 'Planned Architecture',
      active: false,
    },
    {
      phase: 'PHASE 4 (INTER-CITY)',
      title: 'Multi-City Emergency Coordination & Aeromedical',
      scope: 'Cross-district trauma transfer balancing, helicopter EMS (HEMS) flight dispatch, and organ transplant pathway reservation.',
      status: 'Strategic Vision',
      active: false,
    },
    {
      phase: 'PHASE 5 (NATIONAL)',
      title: 'National Emergency-Care Coordination Infrastructure',
      scope: 'Federated sovereign emergency network resilience for mass casualty incidents, natural disasters, and zero-downtime national healthcare continuity.',
      status: 'Long-term Roadmap',
      active: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/60">
            ENGINEERING & SCALABILITY ROADMAP
          </span>
          <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
            Architectural Evolution from Prototype to National Grid
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Clearly delineating current competition prototype deliverables from production enterprise deployment.
          </p>
        </div>

        {/* Prototype vs Production Contrast Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
            <div className="text-xs font-mono font-bold text-cyan-300 uppercase mb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              What JeevanGrid Does Today
            </div>
            <ul className="text-xs text-slate-300 space-y-1 font-sans">
              <li>• Extracts structured clinical requirements via Gemini 3.8 Flash</li>
              <li>• Pure deterministic TCC calculation with zero AI hallucination</li>
              <li>• Dynamic re-routing when facility equipment fails in transit</li>
              <li>• Generates standardized pre-arrival handoff documentation</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-mono font-bold text-indigo-400 uppercase mb-1 flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              Production Deployment Requirements
            </div>
            <ul className="text-xs text-slate-400 space-y-1 font-sans">
              <li>• Integration with hospital PACS (radiology DICOM status)</li>
              <li>• Integration with National Ambulance Dispatch CAD systems</li>
              <li>• End-to-end HIPAA/DISHA encrypted biometric streaming</li>
              <li>• Redundant mesh networks for zero offline vulnerability</li>
            </ul>
          </div>
        </div>

        {/* Phase Timeline */}
        <div className="space-y-3">
          {phases.map((p, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border transition-all ${
                p.active
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-mono font-bold ${p.active ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {p.phase}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    p.active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">{p.scope}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

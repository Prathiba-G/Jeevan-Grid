import React from 'react';
import { X, ArrowRight, CheckCircle2, ShieldCheck, HeartPulse, Hospital, Users, Award, ShieldAlert } from 'lucide-react';

interface WhyJeevanGridModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyJeevanGridModal: React.FC<WhyJeevanGridModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/60">
            PARADIGM SHIFT IN EMERGENCY MEDICINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            From routing patients to orchestrating care.
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Why Time-to-Confirmed-Care (TCC) replaces distance-to-hospital in modern emergency logistics.
          </p>
        </div>

        {/* Comparison Graphic: Traditional vs JeevanGrid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Traditional Approach */}
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <h3 className="text-sm font-bold uppercase font-mono text-rose-300">
                Traditional Approach
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="p-2 rounded bg-slate-900/80 border border-rose-900/40">
                1. Nearest hospital chosen by pure GPS distance
              </div>
              <div className="text-center text-slate-500">↓</div>
              <div className="p-2 rounded bg-slate-900/80 border border-rose-900/40">
                2. Ambulance travels blind without facility readiness
              </div>
              <div className="text-center text-slate-500">↓</div>
              <div className="p-2 rounded bg-slate-900/80 border border-rose-900/40 text-rose-300">
                3. CT or Specialist found OFFLINE upon arrival
              </div>
              <div className="text-center text-slate-500">↓</div>
              <div className="p-2 rounded bg-rose-950/80 border border-rose-700/60 text-rose-200 font-bold">
                4. Critical delay, secondary inter-hospital transfer, lost golden hour
              </div>
            </div>
          </div>

          {/* JeevanGrid Closed-Loop Approach */}
          <div className="rounded-xl border border-cyan-500/50 bg-cyan-950/20 p-4 relative shadow-lg shadow-cyan-500/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 className="text-sm font-bold uppercase font-mono text-cyan-300">
                JeevanGrid Closed-Loop Network
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="p-2 rounded bg-slate-900/80 border border-cyan-900/40">
                1. AI extracts clinical needs (e.g. CT + Neuro) from verbal report
              </div>
              <div className="text-center text-cyan-500">↓</div>
              <div className="p-2 rounded bg-slate-900/80 border border-cyan-900/40">
                2. Deterministic engine verifies active equipment & specialist readiness
              </div>
              <div className="text-center text-cyan-500">↓</div>
              <div className="p-2 rounded bg-slate-900/80 border border-cyan-900/40 text-emerald-300">
                3. Hospital confirms acceptance; pathway prepared while in transit
              </div>
              <div className="text-center text-cyan-500">↓</div>
              <div className="p-2 rounded bg-emerald-950/80 border border-emerald-600/60 text-emerald-200 font-bold">
                4. Continuous monitoring: auto-reroutes if any capability fails
              </div>
            </div>
          </div>
        </div>

        {/* Qualitative Real-World Impact */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            QUALITATIVE REAL-WORLD IMPACT (NO FABRICATED STATISTICS)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono mb-1">
                <HeartPulse className="w-4 h-4" />
                PATIENTS
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Potentially reduces catastrophic, avoidable delays caused by routing to unsuitable facilities lacking required equipment (e.g., stroke without CT or cath lab).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs font-mono mb-1">
                <Users className="w-4 h-4" />
                AMBULANCE OPERATORS
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Replaces speculative radio calls with confirmed hospital readiness and pre-cleared reception pathways.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs font-mono mb-1">
                <Hospital className="w-4 h-4" />
                RECEIVING HOSPITALS
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Earlier visibility into incoming critical emergencies, enabling CT clearing, specialist mobilization, and blood bank prep before arrival.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono mb-1">
                <ShieldCheck className="w-4 h-4" />
                HEALTHCARE NETWORKS
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Provides health systems and city authorities with an orchestrated, real-time command picture of capacity, bottlenecks, and mutual aid across all facilities.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>
            JeevanGrid is a decision-support and emergency coordination prototype, not a diagnostic or autonomous medical decision system.
          </span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  RefreshCw,
  Send,
  Zap,
} from 'lucide-react';
import { Hospital, HospitalEvaluation } from '../types';

interface DecisionCardProps {
  evaluation: HospitalEvaluation | null;
  hospital: Hospital | null;
  isCoordinated: boolean;
  isSimulatingFailure: boolean;
  onConfirmCoordination: () => void;
  onToggleHospitalFailure: () => void;
  onOpenHandoffPacket: () => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  evaluation,
  hospital,
  isCoordinated,
  isSimulatingFailure,
  onConfirmCoordination,
  onToggleHospitalFailure,
  onOpenHandoffPacket,
}) => {
  if (!evaluation || !hospital) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col items-center justify-center text-center h-full">
        <Clock className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
        <h3 className="text-sm font-bold text-slate-300 font-mono">
          DECISION ENGINE STANDBY
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Enter an emergency report and run AI analysis to calculate deterministic Time-to-Confirmed-Care.
        </p>
      </div>
    );
  }

  const isB = hospital.id === 'HOSP_B';
  const isC = hospital.id === 'HOSP_C';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl flex flex-col justify-between h-full gap-4">
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              TARGET DESTINATION DECISION
            </span>
          </div>
          <span
            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded tracking-wide ${
              evaluation.isEligible
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                : 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
            }`}
          >
            {evaluation.isEligible ? 'STATUS: ELIGIBLE & CONFIRMED' : 'STATUS: NOT ELIGIBLE'}
          </span>
        </div>

        {/* Big Recommendation Banner */}
        <div
          className={`rounded-xl p-3.5 border relative overflow-hidden transition-all ${
            isSimulatingFailure && isC
              ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-cyan-950/60 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
              : 'bg-gradient-to-br from-cyan-950/60 via-slate-900 to-blue-950/60 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
          }`}
        >
          {/* Subtle watermarked label */}
          <div className="text-[10px] font-mono uppercase text-cyan-400/80 font-bold flex items-center justify-between mb-1">
            <span>RECOMMENDED RECEIVING HOSPITAL</span>
            <span className="text-slate-400">ID: {hospital.code}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            {hospital.name}
          </h2>
          <div className="text-[11px] text-slate-300 font-mono mt-0.5">
            {hospital.location.address} • {hospital.location.zone}
          </div>

          {/* Core TCC Value Box */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                TIME-TO-CONFIRMED-CARE (TCC)
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {evaluation.tcc}
                </span>
                <span className="text-sm font-bold text-cyan-400 font-mono">MINUTES</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono uppercase text-slate-400">
                Formula Breakdown
              </div>
              <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                <span className="text-cyan-300">{evaluation.travelTime}m</span> travel +{' '}
                <span className="text-amber-300">{evaluation.readinessDelay}m</span> delay +{' '}
                <span className="text-emerald-300">{evaluation.preparationDelay}m</span> prep
              </div>
            </div>
          </div>
        </div>

        {/* Checklist of Critical Readiness Factors */}
        <div className="space-y-1.5 bg-slate-950/80 border border-slate-800 rounded-lg p-3">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1 flex items-center justify-between">
            <span>Clinical Verification Checklist:</span>
            <span className="text-emerald-400 font-bold text-[10px]">ALL CRITICAL MET</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>CT Imaging Scanner</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-300 font-semibold">
                AVAILABLE (READY)
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Specialist Neurologist / Stroke Team</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-300 font-semibold">
                ON-DUTY ({hospital.staffing.attendingNeurologist.split(' ')[1] || 'Specialist'})
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>ICU / Escalation Bed Pathway</span>
              </span>
              <span
                className={`font-mono text-[11px] font-semibold ${
                  hospital.readiness.icu === 'constrained' ? 'text-amber-300' : 'text-emerald-300'
                }`}
              >
                {hospital.readiness.icu === 'constrained'
                  ? 'CONSTRAINED (1 Bed Buffer, +5m)'
                  : `AVAILABLE (${hospital.staffing.icuBedAvailable} Beds)`}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-900">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Emergency Department Bay</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-300 font-semibold">
                OPERATIONAL (RESUS 1)
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hospital Acceptance Status</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-300 font-semibold">
                {isCoordinated ? 'CONFIRMED' : 'AVAILABLE (PENDING DISPATCH)'}
              </span>
            </div>
          </div>
        </div>

        {/* Explainability Section: WHY THIS HOSPITAL? */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1">
          <div className="text-[11px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            WHY THIS HOSPITAL?
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {evaluation.explanation}
          </p>
        </div>
      </div>

      {/* Main Interactive Controls */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        {/* Coordination Confirm Button */}
        <div className="flex gap-2">
          <button
            onClick={onConfirmCoordination}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-all shadow-md ${
              isCoordinated
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 shadow-emerald-500/10'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isCoordinated ? 'CARE COORDINATION CONFIRMED' : 'CONFIRM COORDINATION & PREPARE CARE'}
            </span>
          </button>

          <button
            onClick={onOpenHandoffPacket}
            className="px-3 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-300 hover:text-white transition-all"
            title="View Official Emergency Handoff Packet"
          >
            HANDOFF
          </button>
        </div>

        {/* THE WOW MOMENT: DYNAMIC RE-COORDINATION TRIGGER */}
        <div className="pt-1">
          <button
            onClick={onToggleHospitalFailure}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono font-extrabold tracking-wider border transition-all ${
              isSimulatingFailure
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                : 'bg-gradient-to-r from-rose-950 via-rose-900 to-red-900 hover:from-rose-900 hover:to-red-800 text-rose-100 border-rose-600/80 shadow-lg shadow-rose-900/30 animate-pulse'
            }`}
          >
            {isSimulatingFailure ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RESTORE HOSPITAL B CT SCANNER (RESET FAILURE)</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 text-rose-400" />
                <span>SIMULATE HOSPITAL FAILURE (CT BREAKDOWN AT HOSP B)</span>
              </>
            )}
          </button>
          <div className="text-[10px] text-slate-400 text-center font-mono mt-1">
            {isSimulatingFailure
              ? 'Hospital B CT is Offline. System auto-recalculated & rerouted to Hospital C.'
              : 'Click to test dynamic re-coordination when Hospital B CT scanner fails in transit.'}
          </div>
        </div>
      </div>
    </div>
  );
};

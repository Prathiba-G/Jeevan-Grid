import React from 'react';
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { HospitalEvaluation } from '../types';

interface HospitalComparisonTableProps {
  evaluations: HospitalEvaluation[];
  selectedHospitalId: string;
  isSimulatingFailure: boolean;
  onSelectHospital: (id: string) => void;
}

export const HospitalComparisonTable: React.FC<HospitalComparisonTableProps> = ({
  evaluations,
  selectedHospitalId,
  isSimulatingFailure,
  onSelectHospital,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              HOSPITAL CANDIDATE EVALUATION MATRIX
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Transparent comparison of candidate facilities evaluated against real-time clinical readiness and Time-to-Confirmed-Care (TCC).
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Viable
          </span>
          <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Constrained
          </span>
          <span className="flex items-center gap-1 text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Ineligible
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
              <th className="py-2.5 px-3 font-semibold">Hospital Candidate</th>
              <th className="py-2.5 px-3 font-semibold">Ambulance Travel</th>
              <th className="py-2.5 px-3 font-semibold">Required Capabilities</th>
              <th className="py-2.5 px-3 font-semibold">Readiness Status</th>
              <th className="py-2.5 px-3 font-semibold">Acceptance</th>
              <th className="py-2.5 px-3 font-semibold text-right">Prep Delay</th>
              <th className="py-2.5 px-3 font-semibold text-right">TCC Metric</th>
              <th className="py-2.5 px-3 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {evaluations.map((ev) => {
              const { hospital } = ev;
              const isSelected = hospital.id === selectedHospitalId;
              const isRecommended = ev.isRecommended;

              let rowBg = 'hover:bg-slate-800/30';
              if (isSelected) {
                rowBg = 'bg-cyan-950/30 hover:bg-cyan-950/40 border-l-2 border-cyan-400';
              } else if (!ev.isEligible) {
                rowBg = 'bg-rose-950/10 hover:bg-rose-950/20';
              }

              return (
                <tr
                  key={hospital.id}
                  onClick={() => onSelectHospital(hospital.id)}
                  className={`cursor-pointer transition-colors ${rowBg}`}
                >
                  {/* Hospital */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{hospital.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {hospital.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                          {hospital.location.zone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Travel Time */}
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {hospital.travelTime} min
                    </span>
                  </td>

                  {/* Required Capability match */}
                  <td className="py-3 px-3">
                    {ev.missingCapabilities.length === 0 ? (
                      <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-mono font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>All 4 verified online</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-rose-400 text-[11px] font-mono">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[170px]" title={ev.missingCapabilities.map((m) => m.label).join(', ')}>
                          Missing: {ev.missingCapabilities.map((m) => m.label.split(' ')[0]).join(', ')}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Readiness Status */}
                  <td className="py-3 px-3">
                    {hospital.id === 'HOSP_A' && (
                      <span className="text-[11px] text-rose-400 font-mono">
                        CT Offline (Hardware repair)
                      </span>
                    )}
                    {hospital.id === 'HOSP_B' && (
                      <span
                        className={`text-[11px] font-mono font-semibold ${
                          hospital.readiness.ct === 'offline' ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {hospital.readiness.ct === 'offline'
                          ? 'CT SCANNER OFFLINE (HARDWARE)'
                          : 'Full acute stroke team ready'}
                      </span>
                    )}
                    {hospital.id === 'HOSP_C' && (
                      <span className="text-[11px] text-amber-300 font-mono">
                        ICU Constrained (+5 min wait)
                      </span>
                    )}
                  </td>

                  {/* Acceptance */}
                  <td className="py-3 px-3 font-mono text-[11px]">
                    {ev.isEligible ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        CONFIRMED
                      </span>
                    ) : (
                      <span className="text-rose-400 font-medium">UNAVAILABLE</span>
                    )}
                  </td>

                  {/* Preparation Delay */}
                  <td className="py-3 px-3 font-mono text-right text-slate-300">
                    {ev.isEligible ? `${ev.preparationDelay} min` : '—'}
                  </td>

                  {/* TCC Metric */}
                  <td className="py-3 px-3 font-mono text-right">
                    {ev.isEligible ? (
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-sm font-black ${
                            isRecommended ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {ev.tcc} min
                        </span>
                        <span className="text-[9px] text-slate-500">
                          ({hospital.travelTime}+{ev.readinessDelay}+{ev.preparationDelay})
                        </span>
                      </div>
                    ) : (
                      <span className="text-rose-400 font-bold">N/A</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    {isRecommended ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3" />
                        RECOMMENDED
                      </span>
                    ) : ev.isEligible ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        RUNNER-UP
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        INELIGIBLE
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Decision transparency footnote */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Formula: <strong className="text-white">TCC = Travel Time + Readiness Delay + Preparation Delay</strong>.
          </span>
        </div>
        <div className="text-slate-500 text-[10px]">
          Deterministic ranking logic — zero probabilistic hallucination.
        </div>
      </div>
    </div>
  );
};

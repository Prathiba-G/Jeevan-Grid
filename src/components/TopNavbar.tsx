import React from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  FileText,
  HelpCircle,
  Network,
  Radio,
} from 'lucide-react';

interface TopNavbarProps {
  systemState: 'normal' | 'rerouted';
  caseId: string;
  onOpenWhyModal: () => void;
  onOpenHandoffModal: () => void;
  onOpenScalabilityModal: () => void;
  onResetDemo: () => void;
  destinationHospitalName?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  systemState,
  caseId,
  onOpenWhyModal,
  onOpenHandoffModal,
  onOpenScalabilityModal,
  onResetDemo,
  destinationHospitalName,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-2.5">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 shadow-lg shadow-cyan-500/20 text-white font-bold text-lg">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-wider text-white font-['JetBrains_Mono',monospace]">
                JEEVAN<span className="text-cyan-400">GRID</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
                OPS COMMAND v1.0
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 hidden sm:block">
              Don't just route the ambulance. <span className="text-cyan-300 font-semibold">Prepare the care.</span>
            </p>
          </div>
        </div>

        {/* Real-time Status Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Network Health */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-medium transition-colors ${
              systemState === 'rerouted'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 animate-pulse'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>
              {systemState === 'rerouted'
                ? 'NETWORK ALERT: DYNAMIC RE-ROUTE ACTIVE'
                : 'NETWORK OPERATIONAL: CLOSED-LOOP READY'}
            </span>
          </div>

          {/* Active Case ID */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            <span className="text-slate-500">CASE:</span>
            <span className="font-bold text-white tracking-wide">{caseId}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
          </div>

          {destinationHospitalName && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-200 font-mono">
              <span className="text-cyan-500">TARGET:</span>
              <span className="font-semibold text-cyan-300 truncate max-w-[150px]">
                {destinationHospitalName}
              </span>
            </div>
          )}
        </div>

        {/* Global Controls & Modals */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onOpenWhyModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all"
            title="Why JeevanGrid vs Traditional Routing"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Why JeevanGrid?</span>
          </button>

          <button
            onClick={onOpenHandoffModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/60 rounded-lg transition-all"
            title="View Pre-Arrival Emergency Handoff Packet"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Handoff Packet</span>
          </button>

          <button
            onClick={onOpenScalabilityModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all"
            title="Scalability & Architectural Evolution Roadmap"
          >
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Architecture</span>
          </button>

          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
            title="Reset to Hero Demo Scenario"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};

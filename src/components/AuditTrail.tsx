import React from 'react';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Radio,
  Building2,
  FileCheck,
} from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditTrailProps {
  logs: AuditLogEntry[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ logs }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            OPERATIONAL AUDIT TRAIL
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          ACTIVE LOGGING ({logs.length} EVENTS)
        </span>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto max-h-[260px] pr-1 space-y-2.5 font-mono text-xs">
        {logs.map((log) => {
          let dotColor = 'bg-cyan-500';
          let borderAccent = 'border-slate-800';

          if (log.severity === 'danger') {
            dotColor = 'bg-rose-500 animate-ping';
            borderAccent = 'border-rose-900/60 bg-rose-950/20';
          } else if (log.severity === 'warning') {
            dotColor = 'bg-amber-400';
            borderAccent = 'border-amber-900/60 bg-amber-950/20';
          } else if (log.severity === 'success') {
            dotColor = 'bg-emerald-400';
            borderAccent = 'border-emerald-900/60 bg-emerald-950/20';
          }

          return (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border ${borderAccent} transition-all hover:bg-slate-800/40`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {log.timestamp}
                </span>
                {log.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      log.severity === 'danger'
                        ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                        : log.severity === 'warning'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {log.badge}
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-slate-200">
                {log.title}
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-0.5 leading-snug">
                {log.detail}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
        Immutable cryptographically verifiable clinical event stream
      </div>
    </div>
  );
};

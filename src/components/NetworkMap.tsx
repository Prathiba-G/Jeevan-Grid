import React, { useState } from 'react';
import {
  Navigation,
  Crosshair,
  Building2,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
} from 'lucide-react';
import { Hospital, HospitalEvaluation, PatientCase } from '../types';

interface NetworkMapProps {
  patientCase: PatientCase;
  hospitals: Hospital[];
  evaluations: HospitalEvaluation[];
  selectedHospitalId: string;
  isSimulatingFailure: boolean;
  onSelectHospital: (id: string) => void;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({
  patientCase,
  hospitals,
  evaluations,
  selectedHospitalId,
  isSimulatingFailure,
  onSelectHospital,
}) => {
  const [hoveredHospitalId, setHoveredHospitalId] = useState<string | null>(null);

  // Map coordinates percentage:
  // Patient origin: (20, 65)
  // Ambulance position in transit: between origin and Hospital B (~35, 52)
  const ambulancePos = isSimulatingFailure
    ? { x: 38, y: 55 }
    : { x: 36, y: 50 };

  const targetHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[1];
  const targetEval = evaluations.find((e) => e.hospital.id === selectedHospitalId);

  // SVG route path coordinates
  const origin = { x: patientCase.location.x, y: patientCase.location.y };
  const hospA = { x: 28, y: 35 };
  const hospB = { x: 74, y: 26 };
  const hospC = { x: 68, y: 78 };

  // Calculate waypoints for realistic road routing
  const routePointsB = `${ambulancePos.x},${ambulancePos.y} 48,44 60,34 ${hospB.x},${hospB.y}`;
  const routePointsC = `${ambulancePos.x},${ambulancePos.y} 46,62 58,72 ${hospC.x},${hospC.y}`;
  const activeRoutePoints = selectedHospitalId === 'HOSP_C' ? routePointsC : routePointsB;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl flex flex-col h-full relative overflow-hidden">
      {/* Top Map Bar */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
            TACTICAL CARE DISPATCH GRID
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-slate-500">SPEED:</span>
            <span className="text-white font-bold">54 km/h</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">GPS:</span>
            <span className="text-cyan-400">LOCK (12 SAT)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>TRANSMITTING TELEMETRY</span>
          </div>
        </div>
      </div>

      {/* SVG Tactical Map Canvas */}
      <div className="relative flex-1 w-full min-h-[360px] lg:min-h-[400px] bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden select-none">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#1e293b"
                strokeWidth="0.4"
                strokeDasharray="1,1"
              />
            </pattern>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="alertGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="100" height="100" fill="url(#gridPattern)" />

          {/* Concentric Radar Range Rings centered on emergency */}
          <circle cx="20" cy="65" r="20" fill="none" stroke="#0ea5e9" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.2" />
          <circle cx="20" cy="65" r="40" fill="none" stroke="#0ea5e9" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.15" />
          <circle cx="20" cy="65" r="60" fill="none" stroke="#0ea5e9" strokeWidth="0.2" strokeDasharray="1,2" opacity="0.1" />

          {/* Simulated Highway / Arterial Roads */}
          <path
            d="M 10,85 Q 30,60 50,50 T 90,20"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.8"
            opacity="0.6"
          />
          <path
            d="M 20,15 L 28,35 L 45,55 L 68,78 L 85,90"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.6"
            opacity="0.6"
          />
          <path
            d="M 10,40 L 90,40"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            opacity="0.4"
            strokeDasharray="2,2"
          />
          <path
            d="M 50,10 L 50,90"
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            opacity="0.4"
            strokeDasharray="2,2"
          />

          {/* Inactive secondary route guides */}
          <path
            d={`M ${origin.x},${origin.y} L ${hospA.x},${hospA.y}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.6"
            strokeDasharray="1.5,1.5"
            opacity="0.3"
          />

          {/* Dynamic Active Ambulance Route */}
          {selectedHospitalId === 'HOSP_B' && (
            <polyline
              points={routePointsB}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              strokeDasharray="3,2"
              className="animate-pulse"
            />
          )}

          {selectedHospitalId === 'HOSP_C' && (
            <>
              {/* Diverted old segment showing reroute transition */}
              <polyline
                points={`${ambulancePos.x},${ambulancePos.y} 48,44 55,38`}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="1.5,1.5"
                opacity="0.4"
              />
              {/* Active rerouted line to Hospital C */}
              <polyline
                points={routePointsC}
                fill="none"
                stroke="#10b981"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                strokeDasharray="3,2"
                className="animate-pulse"
              />
            </>
          )}

          {/* Emergency Incident Origin Point */}
          <g transform={`translate(${origin.x}, ${origin.y})`}>
            <circle r="4" fill="#f43f5e" fillOpacity="0.2" className="animate-ping" />
            <circle r="2" fill="#f43f5e" stroke="#fff" strokeWidth="0.5" />
            <text
              y="5.5"
              textAnchor="middle"
              className="text-[3px] font-mono fill-rose-300 font-bold"
            >
              INCIDENT (SECTOR 14)
            </text>
          </g>

          {/* Active Ambulance Marker */}
          <g transform={`translate(${ambulancePos.x}, ${ambulancePos.y})`}>
            {/* Pulse wave */}
            <circle r="5" fill="#38bdf8" fillOpacity="0.2" className="animate-ping" />
            {/* Ambient halo */}
            <circle r="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
            {/* Center beacon */}
            <circle r="1.2" fill="#ffffff" />
            <text
              x="5"
              y="1"
              className="text-[3px] font-mono fill-cyan-300 font-bold tracking-tight"
            >
              UNIT AMB-04 [ETA {targetEval?.travelTime || 10}m]
            </text>
          </g>

          {/* Hospital Nodes */}
          {hospitals.map((hosp) => {
            const ev = evaluations.find((e) => e.hospital.id === hosp.id);
            const isSelected = hosp.id === selectedHospitalId;
            const isA = hosp.id === 'HOSP_A';
            const isB = hosp.id === 'HOSP_B';
            const isC = hosp.id === 'HOSP_C';

            // Determine node color
            let haloColor = '#0ea5e9';
            let statusText = 'VIABLE';

            if (!ev?.isEligible) {
              haloColor = '#ef4444'; // Red
              statusText = isB ? 'CT OFFLINE' : 'NOT ELIGIBLE';
            } else if (ev?.status === 'constrained') {
              haloColor = isSelected ? '#10b981' : '#f59e0b'; // Amber / Emerald if selected
              statusText = isSelected ? 'REROUTED DESTINATION' : 'ICU CONSTRAINED';
            } else {
              haloColor = '#10b981'; // Green
              statusText = 'CONFIRMED CARE';
            }

            return (
              <g
                key={hosp.id}
                transform={`translate(${hosp.location.x}, ${hosp.location.y})`}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectHospital(hosp.id)}
                onMouseEnter={() => setHoveredHospitalId(hosp.id)}
                onMouseLeave={() => setHoveredHospitalId(null)}
              >
                {/* Selection target reticle */}
                {isSelected && (
                  <>
                    <circle
                      r="7.5"
                      fill="none"
                      stroke={haloColor}
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                      className="animate-spin-slow"
                    />
                    <circle r="6" fill={haloColor} fillOpacity="0.15" />
                  </>
                )}

                {/* Base Node */}
                <circle
                  r="3.5"
                  fill="#0f172a"
                  stroke={haloColor}
                  strokeWidth={isSelected ? '1.2' : '0.8'}
                />
                <circle r="1.5" fill={haloColor} />

                {/* Label & Details */}
                <text
                  y="-5"
                  textAnchor="middle"
                  className={`text-[3.2px] font-mono font-bold ${
                    isSelected ? 'fill-white' : 'fill-slate-300'
                  }`}
                >
                  {hosp.code}
                </text>

                <text
                  y="6.5"
                  textAnchor="middle"
                  className="text-[2.6px] font-mono fill-slate-400 font-semibold"
                >
                  {hosp.travelTime} min | {statusText}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Re-route Alert Overlay if failure simulated */}
        {isSimulatingFailure && selectedHospitalId === 'HOSP_C' && (
          <div className="absolute top-3 left-3 right-3 sm:right-auto bg-amber-950/95 border-2 border-amber-500/80 rounded-lg p-2.5 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce-short z-20">
            <div className="p-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-mono font-extrabold text-amber-200 tracking-wider">
                DESTINATION UPDATED: HOSPITAL B → HOSPITAL C
              </div>
              <div className="text-[11px] text-amber-300/90 font-medium">
                Reason: Required CT scanner went OFFLINE at Hospital B. Automatic closed-loop diversion engaged.
              </div>
            </div>
          </div>
        )}

        {/* Bottom Map Legend */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center justify-between gap-2 p-2 rounded-md bg-slate-950/90 border border-slate-800/80 text-[10px] font-mono text-slate-400 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Viable / Confirmed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Constrained (+Delay)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Ineligible / Offline</span>
            </span>
          </div>

          <div className="text-cyan-400 font-semibold">
            {targetHospital.name} (ETA: {targetHospital.travelTime}m)
          </div>
        </div>
      </div>

      {/* Hospital Quick Bar below map */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800">
        {hospitals.map((hosp) => {
          const ev = evaluations.find((e) => e.hospital.id === hosp.id);
          const isSelected = hosp.id === selectedHospitalId;
          const isB = hosp.id === 'HOSP_B';

          return (
            <button
              key={hosp.id}
              onClick={() => onSelectHospital(hosp.id)}
              className={`p-2 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                <span>{hosp.code}</span>
                <span
                  className={
                    !ev?.isEligible
                      ? 'text-rose-400'
                      : ev?.status === 'constrained'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }
                >
                  {hosp.travelTime}m travel
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                {hosp.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-1">
                {!ev?.isEligible
                  ? isB
                    ? '🔴 CT OFFLINE'
                    : '🔴 CT & Neuro Offline'
                  : ev.status === 'constrained'
                  ? `🟡 ICU +${ev.readinessDelay}m Delay`
                  : '🟢 All Systems Verified'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

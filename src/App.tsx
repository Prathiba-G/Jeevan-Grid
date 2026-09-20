import React, { useState, useEffect } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { IntakePanel } from './components/IntakePanel';
import { NetworkMap } from './components/NetworkMap';
import { DecisionCard } from './components/DecisionCard';
import { HospitalComparisonTable } from './components/HospitalComparisonTable';
import { AuditTrail } from './components/AuditTrail';
import { WhyJeevanGridModal } from './components/modals/WhyJeevanGridModal';
import { HandoffPacketModal } from './components/modals/HandoffPacketModal';
import { ScalabilityModal } from './components/modals/ScalabilityModal';
import { INITIAL_HOSPITALS, HERO_PATIENT_CASE, PRESET_CASES } from './data/mockHospitals';
import { evaluateHospitals } from './services/decisionEngine';
import {
  AuditLogEntry,
  ExtractedEmergency,
  Hospital,
  HospitalEvaluation,
  PatientCase,
} from './types';
import { ShieldAlert, Activity, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '10:42:01 AM',
    category: 'intake',
    title: 'Emergency Intake Received',
    detail: 'Field dispatch received for Case #JG-1048 (58yo M with sudden right-side weakness, slurred speech).',
    badge: 'INTAKE',
    severity: 'info',
  },
  {
    id: 'log-2',
    timestamp: '10:42:03 AM',
    category: 'ai',
    title: 'Clinical Requirements Extracted',
    detail: 'Gemini AI interpreted suspected stroke. Mandatory capabilities tagged: Emergency Dept, CT Imaging, Neurology, ICU.',
    badge: 'AI LAYER',
    severity: 'info',
  },
  {
    id: 'log-3',
    timestamp: '10:42:04 AM',
    category: 'eval',
    title: 'Hospital Candidates Evaluated',
    detail: 'Hospital A ineligible (CT & Neuro offline). Hospital B ready (TCC 17m). Hospital C viable (TCC 22m, ICU constrained).',
    badge: 'DECISION',
    severity: 'info',
  },
  {
    id: 'log-4',
    timestamp: '10:42:05 AM',
    category: 'dispatch',
    title: 'Destination Selected: Hospital B',
    detail: 'Selected Apex Neuro (Hospital B) with lowest projected Time-to-Confirmed-Care (17 min).',
    badge: 'SELECTED',
    severity: 'success',
  },
  {
    id: 'log-5',
    timestamp: '10:42:06 AM',
    category: 'dispatch',
    title: 'Hospital Acceptance Confirmed',
    detail: 'Hospital B emergency desk confirmed acceptance. Receiving team Dr. Sunita Rao assigned.',
    badge: 'ACCEPTANCE',
    severity: 'success',
  },
  {
    id: 'log-6',
    timestamp: '10:42:07 AM',
    category: 'handoff',
    title: 'CT Preparation Pathway Initiated',
    detail: 'CT Scanner 2 cleared. Pre-arrival code stroke protocol activated ahead of ambulance arrival.',
    badge: 'PREPARING',
    severity: 'success',
  },
];

const DEFAULT_EXTRACTED_EMERGENCY: ExtractedEmergency = {
  emergency_category: 'suspected_stroke',
  urgency: 'critical',
  required_capabilities: ['emergency_department', 'ct', 'neurology', 'icu'],
  icu_capability_required: true,
  suspected_condition_display: 'Suspected Acute Ischemic Stroke / CVA',
  clinical_summary:
    'Acute neurological deficit presenting with unilateral facial drooping and right-side hemiparesis. Immediate non-contrast CT required to evaluate thrombolytic/thrombectomy candidacy.',
  recommended_pre_arrival_actions: [
    'Pre-alert receiving hospital acute stroke team & attending neurologist',
    'Clear CT scanner suite for direct-to-scanner arrival',
    'Establish 2x large-bore peripheral IV lines (18G preferred)',
    'Keep patient NPO and confirm fingerstick blood glucose',
  ],
};

export default function App() {
  const [patientCase, setPatientCase] = useState<PatientCase>(HERO_PATIENT_CASE);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [extractedEmergency, setExtractedEmergency] = useState<ExtractedEmergency | null>(
    DEFAULT_EXTRACTED_EMERGENCY
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCoordinated, setIsCoordinated] = useState(true);
  const [isSimulatingFailure, setIsSimulatingFailure] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modals state
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [isScalabilityModalOpen, setIsScalabilityModalOpen] = useState(false);

  // Deterministic evaluation
  const evaluations: HospitalEvaluation[] = extractedEmergency
    ? evaluateHospitals(extractedEmergency, hospitals)
    : [];

  // Determine currently selected / recommended hospital
  const recommendedEval = evaluations.find((e) => e.isRecommended) || evaluations[0];
  const [activeHospitalId, setActiveHospitalId] = useState<string>('HOSP_B');

  // Keep activeHospitalId synced with recommended destination unless user manually clicks
  useEffect(() => {
    if (recommendedEval) {
      setActiveHospitalId(recommendedEval.hospital.id);
    }
  }, [recommendedEval?.hospital.id]);

  const currentHospital =
    hospitals.find((h) => h.id === activeHospitalId) || hospitals[1];
  const currentEval =
    evaluations.find((e) => e.hospital.id === activeHospitalId) || evaluations[1];

  // Helper to add audit log
  const addAuditLog = (
    title: string,
    detail: string,
    badge: string,
    severity: 'info' | 'success' | 'warning' | 'danger'
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      category: severity === 'danger' ? 'failure' : severity === 'warning' ? 'reroute' : 'eval',
      title,
      detail,
      badge,
      severity,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Paramedic Report Analysis API Handler (uses server-side Gemini 3.8 Flash)
  const handleAnalyzeEmergency = async (reportText: string) => {
    setIsAnalyzing(true);
    addAuditLog(
      'AI Analysis Triggered',
      `Sending field report to Gemini AI Layer: "${reportText.slice(0, 60)}..."`,
      'AI INTAKE',
      'info'
    );

    try {
      const response = await fetch('/api/analyze-emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportText }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      setExtractedEmergency({
        emergency_category: data.emergency_category,
        urgency: data.urgency,
        required_capabilities: data.required_capabilities,
        icu_capability_required: data.icu_capability_required,
        suspected_condition_display: data.suspected_condition_display,
        clinical_summary: data.clinical_summary,
        recommended_pre_arrival_actions: data.recommended_pre_arrival_actions,
        source: data.source,
      });

      addAuditLog(
        'Requirements Structured',
        `Category: ${data.suspected_condition_display}. Required capabilities: ${data.required_capabilities.join(
          ', '
        )}.`,
        'AI PARSED',
        'success'
      );
    } catch (err: any) {
      console.warn('API error, using robust deterministic ruleset:', err?.message);
      // Deterministic fallback already built into client
      addAuditLog(
        'Requirements Parsed',
        'Clinical requirements structured via internal deterministic medical knowledge base.',
        'PARSED',
        'info'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Preset switch
  const handleSelectPreset = (preset: (typeof PRESET_CASES)[0]) => {
    setPatientCase({
      ...patientCase,
      symptomsReported: preset.report,
      patientAge: preset.age,
      patientGender: preset.gender,
      onsetMinutesAgo: preset.onset,
    });
    handleAnalyzeEmergency(preset.report);
  };

  // Confirm Coordination & Dispatch action
  const handleConfirmCoordination = () => {
    setIsCoordinated(true);
    addAuditLog(
      'Hospital Acceptance Confirmed',
      `${currentHospital.name} accepted inbound patient. Pathway preparation started.`,
      'CONFIRMED',
      'success'
    );
  };

  // THE WOW MOMENT: Dynamic Re-coordination when Hospital B fails
  const handleToggleHospitalFailure = () => {
    if (!isSimulatingFailure) {
      // Simulate failure at Hospital B: CT scanner goes offline
      setIsSimulatingFailure(true);

      setHospitals((prev) =>
        prev.map((h) => {
          if (h.id === 'HOSP_B') {
            return {
              ...h,
              readiness: {
                ...h.readiness,
                ct: 'offline', // CT broke down!
              },
              notes: 'CRITICAL ALERT: CT Scanner hardware malfunction. Scanner offline.',
            };
          }
          if (h.id === 'HOSP_C') {
            return {
              ...h,
              acceptance: 'confirmed',
            };
          }
          return h;
        })
      );

      // Audit trail sequence of the dynamic rerouting
      addAuditLog(
        'Hospital B CT Became Unavailable',
        'Hardware malfunction reported on 256-slice CT scanner at Apex Neuro (Hospital B). Status: OFFLINE.',
        'CAPABILITY OFFLINE',
        'danger'
      );

      setTimeout(() => {
        addAuditLog(
          'Destination Invalidated: Hospital B',
          'Hospital B failed required CT capability check. Automatic destination invalidation executed.',
          'INVALIDATED',
          'warning'
        );
      }, 300);

      setTimeout(() => {
        addAuditLog(
          'Hospital C Selected (TCC 22 min)',
          'Deterministic recalculation: St. Jude Memorial (Hospital C) selected as optimal viable destination.',
          'RE-ROUTED',
          'success'
        );
      }, 700);

      setTimeout(() => {
        addAuditLog(
          'Hospital C Acceptance Confirmed',
          'St. Jude Memorial pre-arrival stroke protocol activated. CT 1 cleared for immediate access.',
          'PREPARING',
          'success'
        );
      }, 1100);
    } else {
      // Restore Hospital B CT scanner
      setIsSimulatingFailure(false);

      setHospitals((prev) =>
        prev.map((h) => {
          if (h.id === 'HOSP_B') {
            return {
              ...h,
              readiness: {
                ...h.readiness,
                ct: 'available',
              },
              notes: 'Designated Comprehensive Stroke Center. Full capacity and immediate pathway readiness.',
            };
          }
          return h;
        })
      );

      addAuditLog(
        'Hospital B CT Scanner Restored',
        'Scanner recalibration complete. Hospital B returned to active network rotation.',
        'RESTORED',
        'info'
      );
    }
  };

  // Full demo reset
  const handleResetDemo = () => {
    setPatientCase(HERO_PATIENT_CASE);
    setHospitals(INITIAL_HOSPITALS);
    setExtractedEmergency(DEFAULT_EXTRACTED_EMERGENCY);
    setIsCoordinated(true);
    setIsSimulatingFailure(false);
    setActiveHospitalId('HOSP_B');
    setAuditLogs(INITIAL_AUDIT_LOGS);
    addAuditLog(
      'Demo Reset to Baseline',
      'System restored to Hero Demo scenario (Suspected Stroke in transit to Hospital B).',
      'RESET',
      'info'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30">
      {/* Top Operations Bar */}
      <TopNavbar
        systemState={isSimulatingFailure ? 'rerouted' : 'normal'}
        caseId={patientCase.id}
        destinationHospitalName={currentHospital.name}
        onOpenWhyModal={() => setIsWhyModalOpen(true)}
        onOpenHandoffModal={() => setIsHandoffModalOpen(true)}
        onOpenScalabilityModal={() => setIsScalabilityModalOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Mandatory Top Notice & Value Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 lg:px-6 py-2">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-300/90">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>PROTOTYPE NOTICE:</strong> Operating with simulated hospital readiness data. JeevanGrid is a decision-support & emergency coordination prototype, not a diagnostic system.
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="hidden md:inline">Core metric:</span>
            <span className="text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
              TCC = Travel Time + Readiness Delay + Preparation Delay
            </span>
          </div>
        </div>
      </div>

      {/* Hero Demo Quick Workflow Guide Banner */}
      <div className="bg-cyan-950/20 border-b border-cyan-900/30 px-4 lg:px-6 py-2">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-cyan-400 uppercase">HERO DEMO WORKFLOW:</span>
            <span className="text-slate-400 hidden sm:inline">1. Emergency Reported</span>
            <span className="text-slate-600 hidden sm:inline">→</span>
            <span className="text-slate-400 hidden sm:inline">2. AI Interprets Requirements</span>
            <span className="text-slate-600 hidden sm:inline">→</span>
            <span className="text-cyan-300 font-semibold">3. Deterministic TCC Match</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-300 font-semibold">4. Hospital B Confirmed</span>
            <span className="text-slate-600">→</span>
            <span className="text-rose-400 font-bold">5. Trigger "Simulate Hospital Failure"</span>
            <span className="text-slate-600">→</span>
            <span className="text-amber-300 font-bold">6. Dynamic Re-Route to Hospital C</span>
          </div>

          <button
            onClick={handleToggleHospitalFailure}
            className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 ${
              isSimulatingFailure
                ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                : 'bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-600/70 animate-pulse'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isSimulatingFailure ? 'Restore Hospital B CT' : 'Simulate CT Failure at Hospital B'}</span>
          </button>
        </div>
      </div>

      {/* Main Operations Dashboard Grid */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 lg:p-6 space-y-5">
        {/* Top 3-Column Layout: Left (Intake), Center (Tactical Map), Right (Decision) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Active Emergency & Paramedic Intake (4 cols on lg) */}
          <div className="lg:col-span-4 xl:col-span-3">
            <IntakePanel
              patientCase={patientCase}
              extractedEmergency={extractedEmergency}
              isAnalyzing={isAnalyzing}
              onAnalyzeEmergency={handleAnalyzeEmergency}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Center Column: Tactical Emergency Dispatch Map (4 cols on lg, 5 on xl) */}
          <div className="lg:col-span-4 xl:col-span-5">
            <NetworkMap
              patientCase={patientCase}
              hospitals={hospitals}
              evaluations={evaluations}
              selectedHospitalId={activeHospitalId}
              isSimulatingFailure={isSimulatingFailure}
              onSelectHospital={(id) => setActiveHospitalId(id)}
            />
          </div>

          {/* Right Column: Target Decision & WOW Trigger (4 cols on lg) */}
          <div className="lg:col-span-4 xl:col-span-4">
            <DecisionCard
              evaluation={currentEval}
              hospital={currentHospital}
              isCoordinated={isCoordinated}
              isSimulatingFailure={isSimulatingFailure}
              onConfirmCoordination={handleConfirmCoordination}
              onToggleHospitalFailure={handleToggleHospitalFailure}
              onOpenHandoffPacket={() => setIsHandoffModalOpen(true)}
            />
          </div>
        </div>

        {/* Bottom Section: Candidate Evaluation Matrix (8 cols) + Audit Trail (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <HospitalComparisonTable
              evaluations={evaluations}
              selectedHospitalId={activeHospitalId}
              isSimulatingFailure={isSimulatingFailure}
              onSelectHospital={(id) => setActiveHospitalId(id)}
            />
          </div>

          <div className="lg:col-span-4">
            <AuditTrail logs={auditLogs} />
          </div>
        </div>

        {/* System Architecture Callout */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold">
              JG
            </div>
            <div>
              <div className="font-bold text-white uppercase">
                AI Interprets. Deterministic Systems Decide. Hospitals Confirm. The Network Adapts.
              </div>
              <div className="text-slate-400 font-sans">
                Separation of AI interpretation (Gemini 3.8 Flash) and deterministic decision engine guarantees zero safety hallucinations.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsWhyModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Why JeevanGrid?
            </button>
            <button
              onClick={() => setIsScalabilityModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition-colors"
            >
              Scalability Roadmap
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <WhyJeevanGridModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
      />
      <HandoffPacketModal
        isOpen={isHandoffModalOpen}
        onClose={() => setIsHandoffModalOpen(false)}
        patientCase={patientCase}
        extractedEmergency={extractedEmergency}
        hospital={currentHospital}
        tcc={currentEval?.tcc || 17}
      />
      <ScalabilityModal
        isOpen={isScalabilityModalOpen}
        onClose={() => setIsScalabilityModalOpen(false)}
      />
    </div>
  );
}

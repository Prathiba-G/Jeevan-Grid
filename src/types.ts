/**
 * JEEVANGRID - Core Types and Interfaces
 * Closed-Loop Emergency Care Orchestration Network
 */

export type UrgencyLevel = 'critical' | 'high' | 'moderate';

export type CapabilityKey =
  | 'emergency_department'
  | 'ct'
  | 'neurology'
  | 'icu'
  | 'cathLab'
  | 'traumaSurgery';

export type ReadinessState = 'available' | 'constrained' | 'offline' | 'preparing';

export type AcceptanceState = 'confirmed' | 'available' | 'constrained' | 'unavailable' | 'pending';

export interface Hospital {
  id: string;
  name: string;
  code: string;
  travelTime: number; // in minutes
  location: {
    x: number; // coordinates for the tactical SVG map (0-100 percentage)
    y: number;
    address: string;
    zone: string;
  };
  capabilities: {
    emergency_department: boolean;
    ct: boolean;
    neurology: boolean;
    icu: boolean;
    cathLab: boolean;
    traumaSurgery: boolean;
  };
  readiness: {
    emergency_department: ReadinessState;
    ct: ReadinessState;
    neurology: ReadinessState;
    icu: ReadinessState;
    cathLab: ReadinessState;
    traumaSurgery: ReadinessState;
  };
  acceptance: AcceptanceState;
  preparationTimes: {
    stroke_pathway: number; // minutes
    trauma_pathway: number;
    cardiac_pathway: number;
    general_ed: number;
  };
  readinessDelays: {
    icuConstrained: number; // e.g. +5 min delay if ICU is constrained
    ctQueue: number;
  };
  staffing: {
    attendingNeurologist: string;
    neuroStatus: ReadinessState;
    edPhysicianOnDuty: string;
    ctTechnologist: string;
    icuBedAvailable: number;
  };
  notes?: string;
}

export interface ExtractedEmergency {
  emergency_category: string;
  urgency: UrgencyLevel;
  required_capabilities: CapabilityKey[];
  icu_capability_required: boolean;
  suspected_condition_display: string;
  clinical_summary: string;
  recommended_pre_arrival_actions: string[];
  source?: string;
  note?: string;
}

export interface PatientCase {
  id: string;
  patientAge: number;
  patientGender: string;
  symptomsReported: string;
  onsetMinutesAgo: number;
  reportedAt: string;
  location: {
    address: string;
    x: number;
    y: number;
  };
  vitals?: {
    bp: string;
    pulse: number;
    spo2: number;
    gcs: string;
    bloodGlucose: string;
  };
}

export interface HospitalEvaluation {
  hospital: Hospital;
  isEligible: boolean;
  missingCapabilities: { key: CapabilityKey; label: string; reason: string }[];
  travelTime: number;
  readinessDelay: number;
  preparationDelay: number;
  tcc: number; // Time-to-Confirmed-Care
  status: 'viable' | 'constrained' | 'ineligible';
  readinessFactors: {
    label: string;
    status: ReadinessState;
    delayContribution: number;
  }[];
  explanation: string;
  isRecommended: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'intake' | 'ai' | 'eval' | 'dispatch' | 'network' | 'failure' | 'reroute' | 'handoff';
  title: string;
  detail: string;
  badge?: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
}

export interface EmergencyHandoffPacket {
  caseId: string;
  timestamp: string;
  emergencyCategory: string;
  suspectedCondition: string;
  urgency: UrgencyLevel;
  reportedSymptoms: string;
  onsetTime: string;
  requiredCapabilities: string[];
  destinationHospital: {
    id: string;
    name: string;
    code: string;
  };
  ambulanceEta: number; // minutes
  tcc: number; // minutes
  acceptanceStatus: AcceptanceState;
  resourcePreparation: {
    resource: string;
    status: string;
    team: string;
  }[];
  preArrivalActions: string[];
}

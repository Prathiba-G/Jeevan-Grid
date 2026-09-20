import { Hospital, PatientCase } from '../types';

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'HOSP_A',
    name: 'Metro Central District Hospital',
    code: 'HOSPITAL A',
    travelTime: 6,
    location: {
      x: 28,
      y: 35,
      address: '42 Sector 4, Metro Ring Road',
      zone: 'North Corridor',
    },
    capabilities: {
      emergency_department: true,
      ct: true, // Has scanner physically, but status is currently OFFLINE (hardware recalibration)
      neurology: false, // No on-call neurologist
      icu: true,
      cathLab: true,
      traumaSurgery: false,
    },
    readiness: {
      emergency_department: 'available',
      ct: 'offline', // CT Scanner down for urgent recalibration
      neurology: 'offline', // Attending neurologist off-site / in surgery
      icu: 'available',
      cathLab: 'available',
      traumaSurgery: 'offline',
    },
    acceptance: 'unavailable',
    preparationTimes: {
      stroke_pathway: 12,
      trauma_pathway: 15,
      cardiac_pathway: 8,
      general_ed: 3,
    },
    readinessDelays: {
      icuConstrained: 0,
      ctQueue: 45, // Major downtime
    },
    staffing: {
      attendingNeurologist: 'None On-Duty (Unstaffed)',
      neuroStatus: 'offline',
      edPhysicianOnDuty: 'Dr. R. Verma (Level 2 ED)',
      ctTechnologist: 'Maintenance in Progress',
      icuBedAvailable: 4,
    },
    notes: 'Nearest physical facility (6 min), but lacking active CT and Neurology coverage for stroke care.',
  },
  {
    id: 'HOSP_B',
    name: 'Apex Super-Specialty & Neuro Institute',
    code: 'HOSPITAL B',
    travelTime: 10,
    location: {
      x: 72,
      y: 26,
      address: '108 Healthcare Blvd, Eastern Tech Zone',
      zone: 'East Care Hub',
    },
    capabilities: {
      emergency_department: true,
      ct: true,
      neurology: true,
      icu: true,
      cathLab: true,
      traumaSurgery: true,
    },
    readiness: {
      emergency_department: 'available',
      ct: 'available', // 256-Slice CT scanner open
      neurology: 'available', // Stroke Neurologist on-site & scrubbed
      icu: 'available', // 6 Neuro-ICU beds ready
      cathLab: 'available',
      traumaSurgery: 'available',
    },
    acceptance: 'available',
    preparationTimes: {
      stroke_pathway: 7, // 7 min to clear CT gantry + mobilize neuro team
      trauma_pathway: 8,
      cardiac_pathway: 10,
      general_ed: 3,
    },
    readinessDelays: {
      icuConstrained: 0,
      ctQueue: 0,
    },
    staffing: {
      attendingNeurologist: 'Dr. Sunita Rao (Interventional Neuro)',
      neuroStatus: 'available',
      edPhysicianOnDuty: 'Dr. K. Nair (Triage Lead)',
      ctTechnologist: 'Scanner 2 Reserved for Code Stroke',
      icuBedAvailable: 6,
    },
    notes: 'Designated Comprehensive Stroke Center. Full capacity and immediate pathway readiness.',
  },
  {
    id: 'HOSP_C',
    name: 'St. Jude Memorial Tertiary Care',
    code: 'HOSPITAL C',
    travelTime: 13,
    location: {
      x: 65,
      y: 78,
      address: '88 South Crossway, Outer Ring',
      zone: 'South Medical Cluster',
    },
    capabilities: {
      emergency_department: true,
      ct: true,
      neurology: true,
      icu: true,
      cathLab: false,
      traumaSurgery: true,
    },
    readiness: {
      emergency_department: 'available',
      ct: 'available', // CT 1 active
      neurology: 'available', // On-call neurologist available via ED
      icu: 'constrained', // High occupancy (+5 min triage delay)
      cathLab: 'offline',
      traumaSurgery: 'available',
    },
    acceptance: 'available',
    preparationTimes: {
      stroke_pathway: 4, // Fast 4-minute pre-alert readiness
      trauma_pathway: 6,
      cardiac_pathway: 15,
      general_ed: 4,
    },
    readinessDelays: {
      icuConstrained: 5, // +5 minutes estimated bed transition delay
      ctQueue: 0,
    },
    staffing: {
      attendingNeurologist: 'Dr. Anand Mehta (On-Call Specialist)',
      neuroStatus: 'available',
      edPhysicianOnDuty: 'Dr. P. Deshmukh',
      ctTechnologist: 'CT Ready on Standby',
      icuBedAvailable: 1, // Only 1 bed remaining
    },
    notes: 'Comprehensive care available. ICU is constrained with 1 bed remaining (+5 min readiness delay).',
  },
];

export const HERO_PATIENT_CASE: PatientCase = {
  id: 'JG-1048',
  patientAge: 58,
  patientGender: 'Male',
  symptomsReported:
    '58-year-old male with sudden facial drooping, slurred speech and weakness on the right side. Symptoms reportedly began approximately 18 minutes ago.',
  onsetMinutesAgo: 18,
  reportedAt: '10:42:01 AM',
  location: {
    address: 'Sector 14 Residential Block, West Avenue',
    x: 20,
    y: 65,
  },
  vitals: {
    bp: '168/98 mmHg',
    pulse: 88,
    spo2: 97,
    gcs: '13 (E4 V4 M5)',
    bloodGlucose: '112 mg/dL',
  },
};

export const PRESET_CASES: {
  title: string;
  category: string;
  report: string;
  age: number;
  gender: string;
  onset: number;
}[] = [
  {
    title: 'Hero Demo: Suspected Stroke',
    category: 'suspected_stroke',
    report:
      '58-year-old male with sudden facial drooping, slurred speech and weakness on the right side. Symptoms reportedly began approximately 18 minutes ago.',
    age: 58,
    gender: 'Male',
    onset: 18,
  },
  {
    title: 'Cardiac: Acute STEMI / Chest Pain',
    category: 'suspected_stemi',
    report:
      '62-year-old female experiencing severe crushing retrosternal chest pain radiating to left jaw, accompanied by profuse cold diaphoresis. Onset 35 minutes ago.',
    age: 62,
    gender: 'Female',
    onset: 35,
  },
  {
    title: 'Trauma: Highway High-Speed Collision',
    category: 'severe_polytrauma',
    report:
      '34-year-old male unrestrained driver involved in high-speed rollover collision. Significant blunt thoracic trauma, paradoxical chest wall movement, abdominal guarding. SBP 90.',
    age: 34,
    gender: 'Male',
    onset: 22,
  },
];

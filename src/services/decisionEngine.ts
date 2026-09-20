import { CapabilityKey, ExtractedEmergency, Hospital, HospitalEvaluation } from '../types';

const CAPABILITY_LABELS: Record<CapabilityKey, string> = {
  emergency_department: 'Emergency Department (ED)',
  ct: 'Non-Contrast CT Scanner',
  neurology: 'Neurology / Stroke Team',
  icu: 'ICU / Escalation Pathway',
  cathLab: 'Cardiac Cath Lab (PCI)',
  traumaSurgery: 'Trauma Surgery Suite',
};

/**
 * Deterministic Decision Engine
 * Never allows the LLM to determine hospital ranking or eligibility.
 * Pure mathematical, rule-based clinical operations engine.
 */
export function evaluateHospitals(
  emergency: ExtractedEmergency,
  hospitals: Hospital[]
): HospitalEvaluation[] {
  const evaluations: HospitalEvaluation[] = hospitals.map((hospital) => {
    const missingCapabilities: { key: CapabilityKey; label: string; reason: string }[] = [];
    const readinessFactors: {
      label: string;
      status: 'available' | 'constrained' | 'offline' | 'preparing';
      delayContribution: number;
    }[] = [];

    let readinessDelay = 0;

    // 1. Check each required capability
    for (const capKey of emergency.required_capabilities) {
      const hasCapability = hospital.capabilities[capKey];
      const currentReadiness = hospital.readiness[capKey];

      if (!hasCapability) {
        missingCapabilities.push({
          key: capKey,
          label: CAPABILITY_LABELS[capKey] || capKey,
          reason: 'Facility does not provide this specialized clinical service',
        });
      } else if (currentReadiness === 'offline') {
        missingCapabilities.push({
          key: capKey,
          label: CAPABILITY_LABELS[capKey] || capKey,
          reason: 'Required equipment or clinical specialist is currently OFFLINE / UNAVAILABLE',
        });
      } else if (currentReadiness === 'constrained') {
        // Constrained capability causes a deterministic readiness delay
        let delay = 0;
        if (capKey === 'icu') {
          delay = hospital.readinessDelays.icuConstrained || 5;
        } else if (capKey === 'ct') {
          delay = hospital.readinessDelays.ctQueue || 10;
        } else {
          delay = 5;
        }
        readinessDelay += delay;
        readinessFactors.push({
          label: `${CAPABILITY_LABELS[capKey] || capKey} (Constrained)`,
          status: 'constrained',
          delayContribution: delay,
        });
      } else {
        readinessFactors.push({
          label: `${CAPABILITY_LABELS[capKey] || capKey} (Active)`,
          status: 'available',
          delayContribution: 0,
        });
      }
    }

    // 2. Check ICU if specifically flagged
    if (emergency.icu_capability_required && !emergency.required_capabilities.includes('icu')) {
      if (!hospital.capabilities.icu || hospital.readiness.icu === 'offline') {
        missingCapabilities.push({
          key: 'icu',
          label: 'ICU / Critical Care Bed',
          reason: 'No critical care or ICU beds available for post-procedure escalation',
        });
      } else if (hospital.readiness.icu === 'constrained') {
        const icuDelay = hospital.readinessDelays.icuConstrained || 5;
        readinessDelay += icuDelay;
        readinessFactors.push({
          label: 'ICU Bed Scarcity (1 bed buffer remaining)',
          status: 'constrained',
          delayContribution: icuDelay,
        });
      }
    }

    const isEligible = missingCapabilities.length === 0;

    // 3. Compute Preparation Delay based on emergency category
    let preparationDelay = 5; // default
    if (emergency.emergency_category.includes('stroke')) {
      preparationDelay = hospital.preparationTimes.stroke_pathway;
    } else if (emergency.emergency_category.includes('trauma')) {
      preparationDelay = hospital.preparationTimes.trauma_pathway;
    } else if (emergency.emergency_category.includes('stemi') || emergency.emergency_category.includes('cardiac')) {
      preparationDelay = hospital.preparationTimes.cardiac_pathway;
    } else {
      preparationDelay = hospital.preparationTimes.general_ed;
    }

    // 4. Compute TCC: Time-to-Confirmed-Care
    // TCC = Travel Time + Readiness Delay + Preparation Delay
    const travelTime = hospital.travelTime;
    const tcc = isEligible ? travelTime + readinessDelay + preparationDelay : 999;

    let status: 'viable' | 'constrained' | 'ineligible' = 'viable';
    if (!isEligible) {
      status = 'ineligible';
    } else if (readinessDelay > 0) {
      status = 'constrained';
    }

    // 5. Generate transparent reason
    let explanation = '';
    if (!isEligible) {
      const missingList = missingCapabilities.map((m) => m.label).join(', ');
      explanation = `NOT ELIGIBLE: Missing critical care capability (${missingList}). Cannot provide required emergency intervention.`;
    } else if (status === 'constrained') {
      explanation = `VIABLE BUT CONSTRAINED: All required capabilities verified. Travel: ${travelTime}m + Prep: ${preparationDelay}m + Readiness Delay: +${readinessDelay}m (ICU constrained) = TCC ${tcc}m.`;
    } else {
      explanation = `CONFIRMED OPTIMAL: All required capabilities online and confirmed. Lowest projected Time-to-Confirmed-Care (${tcc} min = ${travelTime}m travel + ${preparationDelay}m pathway prep).`;
    }

    return {
      hospital,
      isEligible,
      missingCapabilities,
      travelTime,
      readinessDelay,
      preparationDelay,
      tcc,
      status,
      readinessFactors,
      explanation,
      isRecommended: false,
    };
  });

  // Filter eligible hospitals and sort deterministically by TCC ascending
  const eligibleHospitals = evaluations.filter((e) => e.isEligible);
  eligibleHospitals.sort((a, b) => a.tcc - b.tcc);

  // Mark best viable hospital as recommended
  if (eligibleHospitals.length > 0) {
    const winnerId = eligibleHospitals[0].hospital.id;
    for (const ev of evaluations) {
      if (ev.hospital.id === winnerId) {
        ev.isRecommended = true;
      }
    }
  }

  return evaluations;
}

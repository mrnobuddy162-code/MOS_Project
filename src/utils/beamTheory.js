/**
 * Rigorous Euler-Bernoulli Beam Theory Simulation Engine
 * Handles Simply Supported and Cantilever beams with Point Load and UDL via exact analytical superposition.
 */

export function calculateBeamProperties({
  beamType,      // 'simplySupported' | 'cantilever'
  length,        // L in meters (m)
  pointLoad,     // P in kiloNewtons (kN)
  pointLoadPos,  // a in meters (m)
  udl,           // w in kN/m
  width,         // b in millimeters (mm)
  height,        // h in millimeters (mm)
  youngsModulus, // E in GigaPascals (GPa)
  yieldStrength, // sigma_y in MegaPascals (MPa)
  sampleCount = 300
}) {
  // Ensure valid numerical parameters
  const L = Math.max(0.1, Number(length) || 5.0);
  const a = Math.min(L, Math.max(0, Number(pointLoadPos) || 0));
  const b_1 = L - a; // distance from point load to right support
  const P_kN = Number(pointLoad) || 0;
  const P = P_kN * 1000; // Newtons (N)
  const w_kNm = Number(udl) || 0;
  const w = w_kNm * 1000; // N/m

  // Cross section in meters
  const b = Math.max(0.001, (Number(width) || 150) / 1000); // m
  const h = Math.max(0.001, (Number(height) || 300) / 1000); // m
  const A = b * h; // m²
  const I = (b * Math.pow(h, 3)) / 12; // m⁴
  const S = (b * Math.pow(h, 2)) / 6;  // m³
  const c = h / 2; // m (neutral axis to extreme fiber)

  // Material properties in Pa
  const E_GPa = Math.max(0.1, Number(youngsModulus) || 200);
  const E = E_GPa * 1e9; // Pa (N/m²)
  const EI = E * I; // N·m² (Flexural rigidity)
  const sigma_y_MPa = Math.max(1, Number(yieldStrength) || 250);
  const sigma_y = sigma_y_MPa * 1e6; // Pa

  // Support Reactions
  let RA = 0; // N (vertical reaction at A, x=0)
  let RB = 0; // N (vertical reaction at B, x=L, for simply supported)
  let MA = 0; // N·m (reaction moment at A for cantilever)

  if (beamType === 'simplySupported') {
    // Point load contribution
    const RA_p = (P * b_1) / L;
    const RB_p = (P * a) / L;

    // UDL contribution
    const RA_u = (w * L) / 2;
    const RB_u = (w * L) / 2;

    RA = RA_p + RA_u;
    RB = RB_p + RB_u;
  } else {
    // Cantilever beam (fixed at x=0, free at x=L)
    RA = P + (w * L);
    MA = (P * a) + (w * Math.pow(L, 2)) / 2; // Hogging reaction moment at wall
  }

  // Exact function evaluators at any position x (0 <= x <= L)
  function evaluateAt(x) {
    // Clamp x to [0, L]
    const clampedX = Math.max(0, Math.min(L, x));
    let V = 0;  // Shear Force (N)
    let M = 0;  // Bending Moment (N·m)
    let delta = 0; // Deflection (m), downward positive
    let theta = 0; // Slope (radians)

    if (beamType === 'simplySupported') {
      // 1. Point Load components
      let V_p = 0;
      let M_p = 0;
      let delta_p = 0;
      let theta_p = 0;

      if (P !== 0) {
        if (clampedX < a) {
          V_p = (P * b_1) / L;
          M_p = ((P * b_1) / L) * clampedX;
          delta_p = (P * b_1 * clampedX / (6 * EI * L)) * (L * L - b_1 * b_1 - clampedX * clampedX);
          theta_p = (P * b_1 / (6 * EI * L)) * (L * L - b_1 * b_1 - 3 * clampedX * clampedX);
        } else if (clampedX === a) {
          // Average shear or step point
          V_p = (P * b_1) / L - P / 2;
          M_p = (P * a * b_1) / L;
          delta_p = (P * b_1 * a / (6 * EI * L)) * (L * L - b_1 * b_1 - a * a);
          theta_p = (P * b_1 / (6 * EI * L)) * (L * L - b_1 * b_1 - 3 * a * a);
        } else {
          V_p = -(P * a) / L;
          M_p = ((P * a) / L) * (L - clampedX);
          const x_prime = L - clampedX;
          delta_p = (P * a * x_prime / (6 * EI * L)) * (L * L - a * a - x_prime * x_prime);
          theta_p = -(P * a / (6 * EI * L)) * (2 * L * L - 6 * L * clampedX + 3 * clampedX * clampedX + a * a);
        }
      }

      // 2. Full UDL components
      let V_u = 0;
      let M_u = 0;
      let delta_u = 0;
      let theta_u = 0;

      if (w !== 0) {
        V_u = (w * L / 2) - (w * clampedX);
        M_u = (w * clampedX / 2) * (L - clampedX);
        delta_u = (w * clampedX / (24 * EI)) * (Math.pow(L, 3) - 2 * L * Math.pow(clampedX, 2) + Math.pow(clampedX, 3));
        theta_u = (w / (24 * EI)) * (Math.pow(L, 3) - 6 * L * Math.pow(clampedX, 2) + 4 * Math.pow(clampedX, 3));
      }

      V = V_p + V_u;
      M = M_p + M_u;
      delta = delta_p + delta_u;
      theta = theta_p + theta_u;

    } else {
      // Cantilever Beam (Fixed at x=0, Free at x=L)
      let V_p = 0;
      let M_p = 0;
      let delta_p = 0;
      let theta_p = 0;

      if (P !== 0) {
        if (clampedX <= a) {
          V_p = P;
          M_p = -P * (a - clampedX);
          delta_p = (P * Math.pow(clampedX, 2) / (6 * EI)) * (3 * a - clampedX);
          theta_p = (P * clampedX / (2 * EI)) * (2 * a - clampedX);
        } else {
          V_p = 0;
          M_p = 0;
          delta_p = (P * Math.pow(a, 2) / (6 * EI)) * (3 * clampedX - a);
          theta_p = (P * Math.pow(a, 2)) / (2 * EI);
        }
      }

      let V_u = 0;
      let M_u = 0;
      let delta_u = 0;
      let theta_u = 0;

      if (w !== 0) {
        V_u = w * (L - clampedX);
        M_u = - (w * Math.pow(L - clampedX, 2)) / 2;
        delta_u = (w * Math.pow(clampedX, 2) / (24 * EI)) * (Math.pow(clampedX, 2) - 4 * L * clampedX + 6 * Math.pow(L, 2));
        theta_u = (w * clampedX / (6 * EI)) * (3 * Math.pow(L, 2) - 3 * L * clampedX + Math.pow(clampedX, 2));
      }

      V = V_p + V_u;
      M = M_p + M_u;
      delta = delta_p + delta_u;
      theta = theta_p + theta_u;
    }

    // Normal bending stress at extreme fibers (MPa)
    const sigma_b_Pa = (Math.abs(M) * c) / I;
    // Transverse shear stress at neutral axis for rectangle (MPa)
    const tau_Pa = (1.5 * Math.abs(V)) / A;

    return {
      x: clampedX,
      V_kN: V / 1000,
      M_kNm: M / 1000,
      delta_mm: delta * 1000,
      theta_rad: theta,
      theta_deg: theta * (180 / Math.PI),
      sigma_b_MPa: sigma_b_Pa / 1e6,
      tau_MPa: tau_Pa / 1e6,
      V_N: V,
      M_Nm: M,
      delta_m: delta
    };
  }

  // Generate discrete samples along the beam
  const points = [];
  const dx = L / (sampleCount - 1);

  // Critical locations to guarantee inclusion in sampled points
  const criticalXs = new Set([0, L]);
  if (a >= 0 && a <= L) criticalXs.add(a);

  // If simply supported with UDL + Point load, find where V(x) = 0
  if (beamType === 'simplySupported' && w > 0) {
    // V(x) = RA - w*x - P (if x > a)
    const x_zero1 = RA / w;
    if (x_zero1 >= 0 && x_zero1 <= a) criticalXs.add(x_zero1);
    const x_zero2 = (RA - P) / w;
    if (x_zero2 >= a && x_zero2 <= L) criticalXs.add(x_zero2);
  }

  // Build sorted x values array
  const rawXs = [];
  for (let i = 0; i < sampleCount; i++) {
    rawXs.push(i * dx);
  }
  criticalXs.forEach(cx => rawXs.push(cx));
  const sortedXs = Array.from(new Set(rawXs.map(x => Number(x.toFixed(6))))).sort((m, n) => m - n);

  let maxV = 0;
  let maxM = 0;
  let maxM_Signed = 0;
  let maxDelta = 0;
  let x_maxDelta = 0;
  let x_maxM = 0;
  let x_maxV = 0;

  for (let i = 0; i < sortedXs.length; i++) {
    const pt = evaluateAt(sortedXs[i]);
    points.push(pt);

    if (Math.abs(pt.V_kN) > Math.abs(maxV)) {
      maxV = pt.V_kN;
      x_maxV = pt.x;
    }
    if (Math.abs(pt.M_kNm) > Math.abs(maxM)) {
      maxM = Math.abs(pt.M_kNm);
      maxM_Signed = pt.M_kNm;
      x_maxM = pt.x;
    }
    if (Math.abs(pt.delta_mm) > Math.abs(maxDelta)) {
      maxDelta = pt.delta_mm;
      x_maxDelta = pt.x;
    }
  }

  // Global Extremes
  const maxBendingStress_MPa = (maxM * 1000 * c) / (I * 1e6); // from kNm to N*m, divided by 1e6
  const maxShearStress_MPa = (1.5 * Math.abs(maxV) * 1000) / (A * 1e6);
  const factorOfSafety = maxBendingStress_MPa > 0.0001 ? sigma_y_MPa / maxBendingStress_MPa : 999;
  
  // Serviceability limit: standard structural building code deflection limit L / 250
  const deflectionLimit_mm = (L * 1000) / 250;
  const isDeflectionAcceptable = Math.abs(maxDelta) <= deflectionLimit_mm;
  const isStressAcceptable = factorOfSafety >= 1.0;

  return {
    config: {
      beamType,
      L,
      a,
      b_1,
      P_kN,
      w_kNm,
      width_mm: Number(width) || 150,
      height_mm: Number(height) || 300,
      youngsModulus_GPa: E_GPa,
      yieldStrength_MPa: sigma_y_MPa,
      b,
      h,
      A,
      I,
      S,
      c,
      E,
      EI,
      sigma_y
    },
    reactions: {
      RA_kN: RA / 1000,
      RB_kN: RB / 1000,
      MA_kNm: MA / 1000,
      RA_N: RA,
      RB_N: RB,
      MA_Nm: MA
    },
    extrema: {
      maxV_kN: maxV,
      absMaxV_kN: Math.abs(maxV),
      x_maxV,
      maxM_kNm: maxM_Signed,
      absMaxM_kNm: maxM,
      x_maxM,
      maxDelta_mm: maxDelta,
      absMaxDelta_mm: Math.abs(maxDelta),
      x_maxDelta,
      maxBendingStress_MPa,
      maxShearStress_MPa,
      factorOfSafety,
      deflectionLimit_mm,
      isDeflectionAcceptable,
      isStressAcceptable
    },
    points,
    evaluateAt
  };
}

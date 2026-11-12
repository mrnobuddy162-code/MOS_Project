import React, { useState } from 'react';
import MathFormula from '../Common/MathFormula';
import { formatNumber, formatScientific } from '../../utils/formatters';
import { Calculator, ChevronDown, ChevronUp, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';

export default function StepByStepMath({ beamData }) {
  const [openSections, setOpenSections] = useState({
    properties: true,
    equilibrium: true,
    moment: true,
    deflection: true,
    stress: true
  });

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const { config, reactions, extrema } = beamData;
  const {
    beamType,
    L,
    a,
    b_1,
    P_kN,
    w_kNm,
    width_mm,
    height_mm,
    youngsModulus_GPa,
    yieldStrength_MPa,
    b,
    h,
    A,
    I,
    S,
    c,
    E,
    EI
  } = config;

  const P_N = P_kN * 1000;
  const w_Nm = w_kNm * 1000;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-6 transition-all space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <BookOpen size={20} className="text-cyan-400" />
          <div>
            <h2 className="text-base font-bold font-mono text-slate-100">
              Mathematical Derivations & Step-by-Step Calculations
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Rigorous Euler-Bernoulli beam theory with exact numerical substitution
            </p>
          </div>
        </div>
      </div>

      {/* 1. Cross-Section & Material Properties */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('properties')}
          className="w-full px-4 py-3 bg-slate-800/60 flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
        >
          <span className="font-mono text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs">
              1
            </span>
            Cross-Sectional Mechanics & Flexural Rigidity (EI)
          </span>
          {openSections.properties ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSections.properties && (
          <div className="p-4 space-y-4 text-xs font-mono text-slate-300">
            <p className="text-slate-400">
              For a rectangular cross-section of width <span className="text-cyan-300">b = {width_mm} mm ({b} m)</span> and height <span className="text-cyan-300">h = {height_mm} mm ({h} m)</span>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div>
                <MathFormula
                  math={`I = \\frac{b \\cdot h^3}{12} = \\frac{${b} \\times (${h})^3}{12} = ${formatScientific(I, 3)} \\text{ m}^4`}
                  display
                />
              </div>
              <div>
                <MathFormula
                  math={`S = \\frac{b \\cdot h^2}{6} = \\frac{${b} \\times (${h})^2}{6} = ${formatScientific(S, 3)} \\text{ m}^3`}
                  display
                />
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <MathFormula
                math={`EI = E \\times I = (${youngsModulus_GPa} \\times 10^9 \\text{ Pa}) \\times (${formatScientific(I, 3)} \\text{ m}^4) = ${formatScientific(EI, 3)} \\text{ N}\\cdot\\text{m}^2`}
                display
              />
              <p className="text-center text-[11px] text-slate-400 mt-1">
                Flexural rigidity (EI) determines the beam's resistance to rotational bending curvature.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Static Equilibrium & Support Reactions */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('equilibrium')}
          className="w-full px-4 py-3 bg-slate-800/60 flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
        >
          <span className="font-mono text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs">
              2
            </span>
            Static Equilibrium & Support Reactions
          </span>
          {openSections.equilibrium ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSections.equilibrium && (
          <div className="p-4 space-y-4 text-xs font-mono text-slate-300">
            {beamType === 'simplySupported' ? (
              <>
                <p className="text-slate-400">
                  Applying rotational equilibrium about pin support A (<MathFormula math="\sum M_A = 0" />):
                </p>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
                  <MathFormula
                    math={`R_B \\cdot L - P \\cdot a - w \\cdot L \\cdot \\frac{L}{2} = 0`}
                    display
                  />
                  <MathFormula
                    math={`R_B = \\frac{P \\cdot a + \\frac{1}{2} w L^2}{L} = \\frac{(${P_kN} \\times ${a}) + (0.5 \\times ${w_kNm} \\times ${L}^2)}{${L}} = ${formatNumber(reactions.RB_kN, 3)} \\text{ kN}`}
                    display
                  />
                </div>

                <p className="text-slate-400">
                  Applying vertical translational equilibrium (<MathFormula math="\sum F_y = 0" />):
                </p>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
                  <MathFormula
                    math={`R_A + R_B - P - w \\cdot L = 0`}
                    display
                  />
                  <MathFormula
                    math={`R_A = (${P_kN} + ${w_kNm} \\times ${L}) - ${formatNumber(reactions.RB_kN, 3)} = ${formatNumber(reactions.RA_kN, 3)} \\text{ kN}`}
                    display
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-400">
                  For a cantilever beam fixed at x = 0, the fixed wall supplies vertical reaction <MathFormula math="R_A" /> and clamping moment <MathFormula math="M_A" />:
                </p>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
                  <MathFormula
                    math={`\\sum F_y = 0 \\implies R_A = P + w L = ${P_kN} + (${w_kNm} \\times ${L}) = ${formatNumber(reactions.RA_kN, 3)} \\text{ kN}`}
                    display
                  />
                  <MathFormula
                    math={`\\sum M_A = 0 \\implies M_A = P \\cdot a + \\frac{w L^2}{2} = (${P_kN} \\times ${a}) + \\frac{${w_kNm} \\times ${L}^2}{2} = ${formatNumber(reactions.MA_kNm, 3)} \\text{ kN}\\cdot\\text{m}`}
                    display
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 3. Shear Force & Bending Moment Formulations */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('moment')}
          className="w-full px-4 py-3 bg-slate-800/60 flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
        >
          <span className="font-mono text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs">
              3
            </span>
            Shear Force V(x) & Bending Moment M(x) Piecewise Functions
          </span>
          {openSections.moment ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSections.moment && (
          <div className="p-4 space-y-4 text-xs font-mono text-slate-300">
            <p className="text-slate-400">
              Differential relationships from mechanics of solids: <MathFormula math="\frac{dV}{dx} = -w(x)" /> and <MathFormula math="\frac{dM}{dx} = V(x)" />.
            </p>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-3">
              <div className="font-semibold text-slate-200">Maximum Bending Moment Location:</div>
              <p className="text-slate-400">
                The extreme bending moment occurs where shear force changes sign (<MathFormula math="V(x) = 0" />) or at fixed supports.
              </p>
              <MathFormula
                math={`|M|_{max} = ${formatNumber(extrema.absMaxM_kNm, 3)} \\text{ kN}\\cdot\\text{m} \\quad \\text{at } x = ${formatNumber(extrema.x_maxM, 2)} \\text{ m}`}
                display
              />
              <MathFormula
                math={`|V|_{max} = ${formatNumber(extrema.absMaxV_kN, 3)} \\text{ kN} \\quad \\text{at } x = ${formatNumber(extrema.x_maxV, 2)} \\text{ m}`}
                display
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Elastic Curve Deflection Derivation */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('deflection')}
          className="w-full px-4 py-3 bg-slate-800/60 flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
        >
          <span className="font-mono text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs">
              4
            </span>
            Euler-Bernoulli Elastic Deflection Equation & Evaluation
          </span>
          {openSections.deflection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSections.deflection && (
          <div className="p-4 space-y-4 text-xs font-mono text-slate-300">
            <p className="text-slate-400">
              The fundamental governing 4th-order Euler-Bernoulli equation is <MathFormula math="EI \\frac{d^4 v}{dx^4} = q(x)" />, integrated with beam boundary conditions:
            </p>

            {beamType === 'simplySupported' ? (
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-3">
                <div className="text-slate-200 font-semibold">Analytical Superposition Formulas:</div>
                {P_kN > 0 && (
                  <div>
                    <span className="text-cyan-400">Point Load Component (for x ≤ a):</span>
                    <MathFormula
                      math={`\\delta_p(x) = \\frac{P \\cdot b_1 \\cdot x}{6 E I L} (L^2 - b_1^2 - x^2) \\quad \\text{where } b_1 = L - a = ${formatNumber(b_1, 2)} \\text{ m}`}
                      display
                    />
                  </div>
                )}
                {w_kNm > 0 && (
                  <div>
                    <span className="text-cyan-400">Uniformly Distributed Load Component:</span>
                    <MathFormula
                      math={`\\delta_u(x) = \\frac{w \\cdot x}{24 E I} (L^3 - 2 L x^2 + x^3)`}
                      display
                    />
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800">
                  <MathFormula
                    math={`\\delta_{max} = \\delta_p(x_{max}) + \\delta_u(x_{max}) = ${formatNumber(extrema.absMaxDelta_mm, 4)} \\text{ mm} \\quad \\text{at } x = ${formatNumber(extrema.x_maxDelta, 2)} \\text{ m}`}
                    display
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-3">
                <div className="text-slate-200 font-semibold">Cantilever Superposition Formulas:</div>
                {P_kN > 0 && (
                  <div>
                    <span className="text-cyan-400">Point Load Component (for 0 ≤ x ≤ a):</span>
                    <MathFormula
                      math={`\\delta_p(x) = \\frac{P x^2}{6 E I} (3 a - x)`}
                      display
                    />
                  </div>
                )}
                {w_kNm > 0 && (
                  <div>
                    <span className="text-cyan-400">Uniformly Distributed Load Component:</span>
                    <MathFormula
                      math={`\\delta_u(x) = \\frac{w x^2}{24 E I} (x^2 - 4 L x + 6 L^2)`}
                      display
                    />
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800">
                  <MathFormula
                    math={`\\delta_{max} = \\delta_p(L) + \\delta_u(L) = ${formatNumber(extrema.absMaxDelta_mm, 4)} \\text{ mm} \\quad \\text{at free tip } x = ${L} \\text{ m}`}
                    display
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Flexure Formula & Safety Evaluation */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <button
          onClick={() => toggleSection('stress')}
          className="w-full px-4 py-3 bg-slate-800/60 flex items-center justify-between hover:bg-slate-800 transition-colors text-left"
        >
          <span className="font-mono text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs">
              5
            </span>
            Flexure Formula, Maximum Bending Stress & Safety Factor
          </span>
          {openSections.stress ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openSections.stress && (
          <div className="p-4 space-y-4 text-xs font-mono text-slate-300">
            <p className="text-slate-400">
              According to the Navier-Bernoulli flexure formula, the maximum normal bending stress occurs at the extreme outer fibers (<MathFormula math="c = h/2 = " /> {formatNumber(c * 1000, 1)} mm):
            </p>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
              <MathFormula
                math={`\\sigma_{max} = \\frac{|M|_{max} \\cdot c}{I} = \\frac{|M|_{max}}{S} = \\frac{${formatNumber(extrema.absMaxM_kNm * 1000, 1)} \\text{ N}\\cdot\\text{m}}{${formatScientific(S, 3)} \\text{ m}^3} = ${formatNumber(extrema.maxBendingStress_MPa, 2)} \\text{ MPa}`}
                display
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Factor of Safety */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-emerald-400" />
                  Yield Safety Factor (FoS):
                </div>
                <MathFormula
                  math={`\\text{FoS} = \\frac{\\sigma_{yield}}{\\sigma_{max}} = \\frac{${yieldStrength_MPa} \\text{ MPa}}{${formatNumber(extrema.maxBendingStress_MPa, 2)} \\text{ MPa}} = ${formatNumber(extrema.factorOfSafety, 2)}`}
                  display
                />
                <p className="text-[11px] text-slate-400">
                  {extrema.factorOfSafety >= 1.0
                    ? `FoS ≥ 1.0: Structure remains within linear-elastic regime without yielding.`
                    : `FoS < 1.0: Yield strength exceeded! Plastic deformation occurs.`}
                </p>
              </div>

              {/* Deflection Limit Check */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-cyan-400" />
                  Serviceability Deflection Check (L/250):
                </div>
                <MathFormula
                  math={`\\delta_{allow} = \\frac{L}{250} = \\frac{${L * 1000} \\text{ mm}}{250} = ${formatNumber(extrema.deflectionLimit_mm, 1)} \\text{ mm}`}
                  display
                />
                <p className="text-[11px] text-slate-400">
                  Actual δ_max = {formatNumber(extrema.absMaxDelta_mm, 2)} mm vs Limit = {formatNumber(extrema.deflectionLimit_mm, 1)} mm:{' '}
                  <span className={extrema.isDeflectionAcceptable ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {extrema.isDeflectionAcceptable ? 'PASSED (Deflection acceptable)' : 'EXCEEDED (Excessive sag)'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

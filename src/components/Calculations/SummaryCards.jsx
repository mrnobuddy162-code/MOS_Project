import React from 'react';
import ValueBadge from '../Common/ValueBadge';
import { formatNumber } from '../../utils/formatters';
import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowDown, MoveRight, Gauge } from 'lucide-react';

export default function SummaryCards({ beamData }) {
  const { config, reactions, extrema } = beamData;
  const { beamType, L, youngsModulus_GPa, yieldStrength_MPa } = config;
  const {
    absMaxV_kN,
    x_maxV,
    absMaxM_kNm,
    x_maxM,
    absMaxDelta_mm,
    x_maxDelta,
    maxBendingStress_MPa,
    factorOfSafety,
    deflectionLimit_mm,
    isDeflectionAcceptable,
    isStressAcceptable
  } = extrema;

  // Reaction text depending on beam type
  const reactionsText = beamType === 'simplySupported'
    ? `RA = ${formatNumber(reactions.RA_kN, 2)} kN  |  RB = ${formatNumber(reactions.RB_kN, 2)} kN`
    : `RA = ${formatNumber(reactions.RA_kN, 2)} kN  |  MA = ${formatNumber(reactions.MA_kNm, 2)} kN·m`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Support Reactions */}
      <ValueBadge
        label="Reactions"
        value={formatNumber(reactions.RA_kN, 1)}
        unit="kN"
        subtext={beamType === 'simplySupported' ? `RB = ${formatNumber(reactions.RB_kN, 1)} kN` : `MA = ${formatNumber(reactions.MA_kNm, 1)} kNm`}
        status="info"
      />

      {/* 2. Max Shear Force */}
      <ValueBadge
        label="Max Shear |V|"
        value={formatNumber(absMaxV_kN, 2)}
        unit="kN"
        subtext={`At x = ${formatNumber(x_maxV, 2)} m`}
        status="default"
      />

      {/* 3. Max Bending Moment */}
      <ValueBadge
        label="Max Moment |M|"
        value={formatNumber(absMaxM_kNm, 2)}
        unit="kN·m"
        subtext={`At x = ${formatNumber(x_maxM, 2)} m`}
        status="default"
      />

      {/* 4. Max Deflection */}
      <ValueBadge
        label="Max Deflection δ"
        value={formatNumber(absMaxDelta_mm, 3)}
        unit="mm"
        subtext={`Limit L/250 = ${formatNumber(deflectionLimit_mm, 1)} mm`}
        status={isDeflectionAcceptable ? 'success' : 'warning'}
      />

      {/* 5. Max Bending Stress */}
      <ValueBadge
        label="Max Stress σ_b"
        value={formatNumber(maxBendingStress_MPa, 1)}
        unit="MPa"
        subtext={`Yield σ_y = ${yieldStrength_MPa} MPa`}
        status={isStressAcceptable ? 'default' : 'danger'}
      />

      {/* 6. Safety Factor & Status */}
      <div className={`p-3 rounded-xl border backdrop-blur-sm transition-all duration-200 flex flex-col justify-between ${
        isStressAcceptable
          ? factorOfSafety >= 2.0
            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
            : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
          : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
      }`}>
        <div className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
          <span>Safety Factor</span>
          {isStressAcceptable ? (
            <ShieldCheck size={14} className="text-emerald-400" />
          ) : (
            <ShieldAlert size={14} className="text-rose-400" />
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono tracking-tight">
            {factorOfSafety > 50 ? '> 50' : formatNumber(factorOfSafety, 2)}
          </span>
          <span className="text-xs font-semibold text-slate-400">FoS</span>
        </div>
        <div className="text-[11px] font-mono mt-1 font-semibold">
          {!isStressAcceptable
            ? 'PLASTIC YIELDING'
            : !isDeflectionAcceptable
            ? 'EXCEEDS L/250'
            : 'STRUCTURALLY SAFE'}
        </div>
      </div>
    </div>
  );
}

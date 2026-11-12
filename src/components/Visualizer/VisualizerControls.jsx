import React from 'react';
import { Play, Pause, Eye, EyeOff, Layers, ZoomIn } from 'lucide-react';

export default function VisualizerControls({
  isAnimating,
  setIsAnimating,
  deflectionScale,
  setDeflectionScale,
  showNeutralAxis,
  setShowNeutralAxis,
  showUndeformed,
  setShowUndeformed,
  showForces,
  setShowForces,
  showDimensions,
  setShowDimensions,
  showStressColors,
  setShowStressColors
}) {
  const scaleOptions = [
    { label: 'Auto Scale', value: 'auto' },
    { label: '1× (True)', value: 1 },
    { label: '10×', value: 10 },
    { label: '50×', value: 50 },
    { label: '100×', value: 100 },
    { label: '500×', value: 500 }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 dark:bg-slate-900/80 border border-slate-800 rounded-xl text-sm">
      {/* Left: Play/Pause and Scale */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all shadow-sm ${
            isAnimating
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white'
          }`}
          title="Toggle dynamic oscillation animation"
        >
          {isAnimating ? <Pause size={14} /> : <Play size={14} />}
          {isAnimating ? 'Pause Dynamics' : 'Animate Load'}
        </button>

        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2 py-1">
          <ZoomIn size={14} className="text-slate-400" />
          <span className="text-xs text-slate-400 font-mono">Deflection Scale:</span>
          <select
            value={deflectionScale}
            onChange={(e) => setDeflectionScale(e.target.value === 'auto' ? 'auto' : Number(e.target.value))}
            className="bg-transparent text-xs font-mono font-semibold text-cyan-300 focus:outline-none cursor-pointer"
          >
            {scaleOptions.map(opt => (
              <option key={opt.label} value={opt.value} className="bg-slate-900 text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Layer Toggles */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setShowNeutralAxis(!showNeutralAxis)}
          className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
            showNeutralAxis
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
              : 'bg-slate-800/40 border-slate-700 text-slate-500 line-through'
          }`}
          title="Toggle Neutral Axis line"
        >
          Neutral Axis
        </button>

        <button
          onClick={() => setShowForces(!showForces)}
          className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
            showForces
              ? 'bg-rose-500/20 border-rose-500/60 text-rose-300'
              : 'bg-slate-800/40 border-slate-700 text-slate-500 line-through'
          }`}
          title="Toggle Force and Reaction vectors"
        >
          Forces & Reactions
        </button>

        <button
          onClick={() => setShowStressColors(!showStressColors)}
          className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
            showStressColors
              ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
              : 'bg-slate-800/40 border-slate-700 text-slate-500'
          }`}
          title="Toggle Bending Stress Color Gradient"
        >
          Stress Gradient
        </button>

        <button
          onClick={() => setShowUndeformed(!showUndeformed)}
          className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
            showUndeformed
              ? 'bg-slate-800 border-slate-600 text-slate-300'
              : 'bg-slate-800/40 border-slate-700 text-slate-500 line-through'
          }`}
          title="Toggle Undeformed Reference Beam"
        >
          Reference Line
        </button>

        <button
          onClick={() => setShowDimensions(!showDimensions)}
          className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
            showDimensions
              ? 'bg-slate-800 border-slate-600 text-slate-300'
              : 'bg-slate-800/40 border-slate-700 text-slate-500 line-through'
          }`}
          title="Toggle Dimension Markers"
        >
          Dimensions
        </button>
      </div>
    </div>
  );
}

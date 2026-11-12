import React from 'react';
import { ArrowDown, Layers, Crosshair } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export default function LoadControls({
  length,
  pointLoad,
  setPointLoad,
  pointLoadPos,
  setPointLoadPos,
  udl,
  setUdl,
  beamType
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-all space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <ArrowDown size={14} className="text-rose-400" />
          3. Applied Loads (Euler-Bernoulli)
        </label>
        <span className="text-[10px] font-mono text-slate-400">
          Superposition Enabled
        </span>
      </div>

      {/* Point Load Magnitude P */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Point Load Magnitude (P):
          </span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="250"
              step="1"
              value={pointLoad}
              onChange={(e) => setPointLoad(Math.max(0, Math.min(500, Number(e.target.value) || 0)))}
              className="w-16 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-right text-rose-300 font-semibold focus:outline-none focus:border-rose-500"
            />
            <span className="text-slate-400 text-[11px]">kN</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={pointLoad}
          onChange={(e) => setPointLoad(Number(e.target.value))}
          className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
      </div>

      {/* Point Load Position a */}
      {pointLoad > 0 && (
        <div className="space-y-1.5 pl-3 border-l-2 border-rose-500/50">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Load Position (a):</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max={length}
                step="0.1"
                value={pointLoadPos}
                onChange={(e) => setPointLoadPos(Math.max(0, Math.min(length, Number(e.target.value) || 0)))}
                className="w-16 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-right text-rose-300 font-semibold focus:outline-none focus:border-rose-500"
              />
              <span className="text-slate-400 text-[11px]">m</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max={length}
            step="0.05"
            value={pointLoadPos}
            onChange={(e) => setPointLoadPos(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          {/* Quick position presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setPointLoadPos(0)}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              x = 0
            </button>
            <button
              type="button"
              onClick={() => setPointLoadPos(Number((length / 2).toFixed(2)))}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              Midspan (L/2)
            </button>
            <button
              type="button"
              onClick={() => setPointLoadPos(length)}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              {beamType === 'cantilever' ? 'Free Tip (x = L)' : 'Right Support (x = L)'}
            </button>
          </div>
        </div>
      )}

      {/* Uniformly Distributed Load w */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Uniform Distributed Load (w):
          </span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={udl}
              onChange={(e) => setUdl(Math.max(0, Math.min(200, Number(e.target.value) || 0)))}
              className="w-16 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-right text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500"
            />
            <span className="text-slate-400 text-[11px]">kN/m</span>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="0.5"
          value={udl}
          onChange={(e) => setUdl(Number(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>0 kN/m</span>
          <span>25 kN/m</span>
          <span>50 kN/m</span>
        </div>
      </div>
    </div>
  );
}

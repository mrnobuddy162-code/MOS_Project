import React from 'react';
import { Ruler, Maximize2 } from 'lucide-react';
import { formatScientific, formatNumber } from '../../utils/formatters';

export default function GeometryControls({
  length,
  setLength,
  width,
  setWidth,
  height,
  setHeight,
  pointLoadPos,
  setPointLoadPos
}) {
  const handleLengthChange = (newVal) => {
    const val = Math.max(0.5, Math.min(20, Number(newVal) || 5));
    setLength(val);
    // Auto clamp point load position if it exceeds new beam length
    if (pointLoadPos > val) {
      setPointLoadPos(val);
    }
  };

  const I_val = ((width / 1000) * Math.pow(height / 1000, 3)) / 12;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-all space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Ruler size={14} className="text-cyan-400" />
          2. Geometry & Cross-Section
        </label>
        <span className="text-[10px] font-mono text-slate-400">
          I = {formatScientific(I_val, 2)} m⁴
        </span>
      </div>

      {/* Beam Length Slider & Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">Beam Span (L):</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0.5"
              max="20"
              step="0.1"
              value={length}
              onChange={(e) => handleLengthChange(e.target.value)}
              className="w-16 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-right text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500"
            />
            <span className="text-slate-400 text-[11px]">m</span>
          </div>
        </div>
        <input
          type="range"
          min="1"
          max="12"
          step="0.1"
          value={length}
          onChange={(e) => handleLengthChange(e.target.value)}
          className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>1.0 m</span>
          <span>6.0 m</span>
          <span>12.0 m</span>
        </div>
      </div>

      {/* Cross-section width and height */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
        {/* Width b */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Width (b):</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="20"
                max="600"
                step="5"
                value={width}
                onChange={(e) => setWidth(Math.max(10, Math.min(800, Number(e.target.value) || 150)))}
                className="w-14 px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded text-right text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500 text-xs"
              />
              <span className="text-slate-400 text-[10px]">mm</span>
            </div>
          </div>
          <input
            type="range"
            min="50"
            max="400"
            step="10"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Height h */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Height (h):</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="40"
                max="1000"
                step="10"
                value={height}
                onChange={(e) => setHeight(Math.max(20, Math.min(1200, Number(e.target.value) || 300)))}
                className="w-14 px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded text-right text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500 text-xs"
              />
              <span className="text-slate-400 text-[10px]">mm</span>
            </div>
          </div>
          <input
            type="range"
            min="100"
            max="600"
            step="10"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

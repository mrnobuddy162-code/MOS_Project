import React from 'react';
import { MATERIALS } from '../../constants/materials';
import { Layers, HelpCircle } from 'lucide-react';

export default function MaterialSelector({
  materialId,
  setMaterialId,
  customE,
  setCustomE,
  customYield,
  setCustomYield
}) {
  const currentMaterial = MATERIALS[materialId] || MATERIALS.steel;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-all space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers size={14} className="text-cyan-400" />
          4. Material Selection
        </label>
        <span className="text-[10px] font-mono text-cyan-400">
          E = {materialId === 'custom' ? customE : currentMaterial.E} GPa
        </span>
      </div>

      {/* Material Dropdown Selection */}
      <select
        value={materialId}
        onChange={(e) => setMaterialId(e.target.value)}
        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
      >
        {Object.values(MATERIALS).map((mat) => (
          <option key={mat.id} value={mat.id} className="bg-slate-900 text-slate-200">
            {mat.name} ({mat.E} GPa, σ_y = {mat.yieldStrength} MPa)
          </option>
        ))}
      </select>

      {/* Material Description Note */}
      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
        {currentMaterial.description}
      </p>

      {/* Custom Material Inputs if selected */}
      {materialId === 'custom' && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 font-mono text-xs">
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Modulus E (GPa):</label>
            <input
              type="number"
              min="1"
              max="1000"
              step="1"
              value={customE}
              onChange={(e) => setCustomE(Math.max(0.1, Number(e.target.value) || 100))}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-slate-400 text-[11px] block mb-1">Yield σ_y (MPa):</label>
            <input
              type="number"
              min="1"
              max="2500"
              step="5"
              value={customYield}
              onChange={(e) => setCustomYield(Math.max(1, Number(e.target.value) || 200))}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

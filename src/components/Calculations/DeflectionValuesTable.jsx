import React, { useState } from 'react';
import { formatNumber } from '../../utils/formatters';
import { Download, Table as TableIcon, Filter } from 'lucide-react';

export default function DeflectionValuesTable({ beamData }) {
  const [stepInterval, setStepInterval] = useState(0.5); // meters
  const { config, evaluateAt } = beamData;
  const { L, beamType } = config;

  // Generate table rows based on stepInterval
  const rows = [];
  const count = Math.round(L / stepInterval);
  for (let i = 0; i <= count; i++) {
    const x = Math.min(L, i * stepInterval);
    const pt = evaluateAt(x);
    rows.push(pt);
  }
  // Guarantee L is included if not exact match
  if (rows[rows.length - 1].x < L - 0.001) {
    rows.push(evaluateAt(L));
  }

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'Position x (m)',
      'Shear Force V (kN)',
      'Bending Moment M (kN·m)',
      'Deflection delta (mm)',
      'Slope theta (deg)',
      'Bending Stress sigma (MPa)',
      'Shear Stress tau (MPa)'
    ];

    const csvRows = [headers.join(',')];
    rows.forEach(r => {
      csvRows.push([
        r.x.toFixed(3),
        r.V_kN.toFixed(3),
        r.M_kNm.toFixed(3),
        r.delta_mm.toFixed(4),
        r.theta_deg.toFixed(4),
        r.sigma_b_MPa.toFixed(2),
        r.tau_MPa.toFixed(3)
      ].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `beam_deflection_${beamType}_L${L}m.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-all space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TableIcon size={18} className="text-cyan-400" />
          <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-200">
            Deflection & Internal Forces Table
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Interval selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Step Δx:</span>
            <select
              value={stepInterval}
              onChange={(e) => setStepInterval(Number(e.target.value))}
              className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value={0.25} className="bg-slate-900 text-slate-200">0.25 m</option>
              <option value={0.5} className="bg-slate-900 text-slate-200">0.50 m</option>
              <option value={1.0} className="bg-slate-900 text-slate-200">1.00 m</option>
            </select>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors shadow-sm"
          >
            <Download size={13} className="text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[300px] border border-slate-800 rounded-xl">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead className="bg-slate-950/90 text-slate-400 sticky top-0 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Position x (m)</th>
              <th className="py-2.5 px-3">Shear V (kN)</th>
              <th className="py-2.5 px-3">Moment M (kN·m)</th>
              <th className="py-2.5 px-3">Deflection δ (mm)</th>
              <th className="py-2.5 px-3">Slope θ (deg)</th>
              <th className="py-2.5 px-3">Stress σ_b (MPa)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2 px-3 font-semibold text-slate-100">{formatNumber(row.x, 2)}</td>
                <td className="py-2 px-3">{formatNumber(row.V_kN, 2)}</td>
                <td className={`py-2 px-3 ${row.M_kNm >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatNumber(row.M_kNm, 2)}
                </td>
                <td className="py-2 px-3 text-cyan-300 font-semibold">{formatNumber(row.delta_mm, 3)}</td>
                <td className="py-2 px-3">{formatNumber(row.theta_deg, 3)}°</td>
                <td className="py-2 px-3 text-amber-300">{formatNumber(row.sigma_b_MPa, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

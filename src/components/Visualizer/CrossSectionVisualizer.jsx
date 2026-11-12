import React, { useRef, useEffect } from 'react';
import { formatNumber, formatScientific } from '../../utils/formatters';

export default function CrossSectionVisualizer({ config, extrema, isDarkMode = true }) {
  const canvasRef = useRef(null);
  const { width_mm, height_mm, A, I, S, c } = config;
  const { maxBendingStress_MPa, maxShearStress_MPa } = extrema;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const colors = isDarkMode
      ? {
          stroke: '#94a3b8',
          fill: 'rgba(56, 189, 248, 0.15)',
          na: '#f59e0b',
          tension: '#ef4444',
          compression: '#3b82f6',
          shear: '#10b981',
          text: '#94a3b8',
          textLight: '#f8fafc',
          grid: '#334155'
        }
      : {
          stroke: '#64748b',
          fill: 'rgba(2, 132, 199, 0.15)',
          na: '#d97706',
          tension: '#dc2626',
          compression: '#2563eb',
          shear: '#059669',
          text: '#64748b',
          textLight: '#0f172a',
          grid: '#e2e8f0'
        };

    // Calculate aspect-preserving box for rectangular section
    const maxBoxW = 90;
    const maxBoxH = 140;
    const aspectRatio = width_mm / height_mm;

    let drawW, drawH;
    if (aspectRatio > maxBoxW / maxBoxH) {
      drawW = maxBoxW;
      drawH = maxBoxW / aspectRatio;
    } else {
      drawH = maxBoxH;
      drawW = maxBoxH * aspectRatio;
    }
    drawW = Math.max(30, drawW);
    drawH = Math.max(50, drawH);

    const cx = 80;
    const cy = height / 2;
    const left = cx - drawW / 2;
    const top = cy - drawH / 2;

    // 1. Draw Rectangular Cross-Section
    ctx.fillStyle = colors.fill;
    ctx.fillRect(left, top, drawW, drawH);

    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(left, top, drawW, drawH);

    // Dimension labels
    ctx.fillStyle = colors.text;
    ctx.font = '10px "JetBrains Mono", monospace';
    // Width label on top
    const bText = `b = ${width_mm} mm`;
    ctx.fillText(bText, cx - ctx.measureText(bText).width / 2, top - 8);
    // Height label on right
    ctx.save();
    ctx.translate(left + drawW + 14, cy);
    ctx.rotate(Math.PI / 2);
    const hText = `h = ${height_mm} mm`;
    ctx.fillText(hText, -ctx.measureText(hText).width / 2, 0);
    ctx.restore();

    // 2. Neutral Axis
    ctx.strokeStyle = colors.na;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(left - 15, cy);
    ctx.lineTo(left + drawW + 15, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = colors.na;
    ctx.fillText('N.A.', left - 36, cy + 3);

    // 3. Normal Bending Stress Distribution Diagram (Linear)
    const stressDiagramX = 185;
    const maxStressW = 45;

    // Vertical centerline for stress diagram
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(stressDiagramX, top);
    ctx.lineTo(stressDiagramX, top + drawH);
    ctx.stroke();

    // Linear profile: Top in compression, Bottom in tension (for positive moment)
    ctx.beginPath();
    ctx.moveTo(stressDiagramX - maxStressW, top);
    ctx.lineTo(stressDiagramX + maxStressW, top + drawH);
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arrows on stress distribution
    const drawStressArrows = () => {
      // Top compression arrows pointing right toward axis
      ctx.strokeStyle = colors.compression;
      ctx.fillStyle = colors.compression;
      ctx.lineWidth = 1;
      for (let y = top + 5; y < cy - 4; y += 14) {
        const factor = (cy - y) / (drawH / 2);
        const arrowLen = maxStressW * factor;
        ctx.beginPath();
        ctx.moveTo(stressDiagramX - arrowLen, y);
        ctx.lineTo(stressDiagramX, y);
        ctx.stroke();
      }

      // Bottom tension arrows pointing left away from axis
      ctx.strokeStyle = colors.tension;
      ctx.fillStyle = colors.tension;
      for (let y = cy + 12; y <= top + drawH - 5; y += 14) {
        const factor = (y - cy) / (drawH / 2);
        const arrowLen = maxStressW * factor;
        ctx.beginPath();
        ctx.moveTo(stressDiagramX, y);
        ctx.lineTo(stressDiagramX + arrowLen, y);
        ctx.stroke();
      }
    };
    drawStressArrows();

    // Stress diagram labels
    ctx.fillStyle = colors.text;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('Bending Stress σ', stressDiagramX - 35, top - 8);
    ctx.fillStyle = colors.compression;
    ctx.fillText(`-σ_max`, stressDiagramX - maxStressW - 10, top + 10);
    ctx.fillStyle = colors.tension;
    ctx.fillText(`+σ_max`, stressDiagramX + maxStressW - 25, top + drawH - 2);

    // 4. Parabolic Shear Stress Distribution Diagram
    const shearDiagramX = 295;
    const maxShearW = 38;

    ctx.strokeStyle = colors.grid;
    ctx.beginPath();
    ctx.moveTo(shearDiagramX, top);
    ctx.lineTo(shearDiagramX, top + drawH);
    ctx.stroke();

    // Parabolic curve: max at cy, 0 at top and bottom
    ctx.beginPath();
    ctx.moveTo(shearDiagramX, top);
    for (let y = top; y <= top + drawH; y += 2) {
      const distFromCenter = Math.abs(y - cy) / (drawH / 2);
      const shearVal = maxShearW * (1 - distFromCenter * distFromCenter);
      ctx.lineTo(shearDiagramX + shearVal, y);
    }
    ctx.lineTo(shearDiagramX, top + drawH);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fill();
    ctx.strokeStyle = colors.shear;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = colors.text;
    ctx.fillText('Shear Stress τ', shearDiagramX - 25, top - 8);
    ctx.fillStyle = colors.shear;
    ctx.fillText('τ_max = 1.5 V/A', shearDiagramX + maxShearW + 4, cy + 3);

    ctx.restore();
  }, [config, extrema, isDarkMode, width_mm, height_mm]);

  return (
    <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-300">
          Cross-Section Mechanics & Stress Distribution
        </h3>
        <span className="text-[11px] font-mono text-cyan-400">
          Rectangular Solid
        </span>
      </div>

      <div className="w-full h-[180px] relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Cross section properties grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">AREA A</span>
          <span className="font-semibold text-slate-200">{formatNumber(A * 1e4, 1)} cm²</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">INERTIA I</span>
          <span className="font-semibold text-cyan-300">{formatScientific(I, 2)} m⁴</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">SECTION MODULUS S</span>
          <span className="font-semibold text-slate-200">{formatScientific(S, 2)} m³</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span className="text-slate-500 block text-[10px]">FIBER DISTANCE c</span>
          <span className="font-semibold text-amber-300">{formatNumber(c * 1000, 1)} mm</span>
        </div>
      </div>
    </div>
  );
}

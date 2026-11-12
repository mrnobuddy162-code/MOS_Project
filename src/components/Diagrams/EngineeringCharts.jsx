import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatNumber } from '../../utils/formatters';
import { TrendingDown, Activity, Layers, Maximize2 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function EngineeringCharts({ beamData, isDarkMode = true }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'sfd' | 'bmd' | 'deflection'
  const { config, extrema, points } = beamData;
  const { L, beamType } = config;

  // Downsample points slightly for optimal chart rendering performance (e.g. 100 points)
  const step = Math.max(1, Math.floor(points.length / 100));
  const sampledPoints = points.filter((_, idx) => idx % step === 0 || idx === points.length - 1);

  const xLabels = sampledPoints.map(p => `${p.x.toFixed(2)} m`);
  const xData = sampledPoints.map(p => p.x);

  // Common Theme Styling
  const gridColor = isDarkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(203, 213, 225, 0.6)';
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const zeroLineColor = isDarkMode ? '#e2e8f0' : '#0f172a';

  // Common Chart Options Builder
  const getOptions = (title, yAxisLabel, unit) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 350,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title,
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        font: {
          family: '"JetBrains Mono", monospace',
          size: 13,
          weight: '600'
        },
        padding: {
          bottom: 12
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#38bdf8' : '#0284c7',
        bodyColor: isDarkMode ? '#f8fafc' : '#0f172a',
        borderColor: isDarkMode ? '#334155' : '#cbd5e1',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        titleFont: {
          family: '"JetBrains Mono", monospace',
          size: 12,
          weight: 'bold'
        },
        bodyFont: {
          family: '"JetBrains Mono", monospace',
          size: 11
        },
        callbacks: {
          title: (items) => `Beam Position: ${xData[items[0].dataIndex].toFixed(2)} m`,
          label: (item) => `${yAxisLabel}: ${formatNumber(item.raw, 3)} ${unit}`
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: L,
        title: {
          display: true,
          text: 'Position along span x (m)',
          color: textColor,
          font: { family: '"JetBrains Mono", monospace', size: 11 }
        },
        grid: {
          color: gridColor,
          drawBorder: false
        },
        ticks: {
          color: textColor,
          font: { family: '"JetBrains Mono", monospace', size: 10 },
          maxTicksLimit: 11
        }
      },
      y: {
        title: {
          display: true,
          text: `${yAxisLabel} (${unit})`,
          color: textColor,
          font: { family: '"JetBrains Mono", monospace', size: 11 }
        },
        grid: {
          color: (context) => (context.tick.value === 0 ? zeroLineColor : gridColor),
          lineWidth: (context) => (context.tick.value === 0 ? 1.5 : 1)
        },
        ticks: {
          color: textColor,
          font: { family: '"JetBrains Mono", monospace', size: 10 }
        }
      }
    }
  });

  // 1. Shear Force Diagram (SFD) Dataset
  const sfdData = {
    datasets: [
      {
        label: 'Shear Force V(x)',
        data: sampledPoints.map(p => ({ x: p.x, y: p.V_kN })),
        borderColor: '#3b82f6',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
          return gradient;
        },
        borderWidth: 2,
        fill: 'origin',
        tension: 0.05,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#3b82f6'
      }
    ]
  };

  // 2. Bending Moment Diagram (BMD) Dataset
  const bmdData = {
    datasets: [
      {
        label: 'Bending Moment M(x)',
        data: sampledPoints.map(p => ({ x: p.x, y: p.M_kNm })),
        borderColor: '#10b981',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
          return gradient;
        },
        borderWidth: 2,
        fill: 'origin',
        tension: 0.15,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#10b981'
      }
    ]
  };

  // 3. Elastic Deflection Curve Dataset (plotted downwards)
  const deflData = {
    datasets: [
      {
        label: 'Elastic Deflection v(x)',
        // Negative so visual deflection goes downward on standard chart
        data: sampledPoints.map(p => ({ x: p.x, y: -p.delta_mm })),
        borderColor: '#f43f5e',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
          gradient.addColorStop(0, 'rgba(244, 63, 94, 0.02)');
          gradient.addColorStop(1, 'rgba(244, 63, 94, 0.25)');
          return gradient;
        },
        borderWidth: 2.5,
        fill: 'origin',
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#f43f5e'
      }
    ]
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-all">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-cyan-400" />
          <h2 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-200">
            Interactive Engineering Diagrams (SFD & BMD)
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Stacked
          </button>
          <button
            onClick={() => setActiveTab('sfd')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'sfd'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SFD (V)
          </button>
          <button
            onClick={() => setActiveTab('bmd')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'bmd'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BMD (M)
          </button>
          <button
            onClick={() => setActiveTab('deflection')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeTab === 'deflection'
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deflection (δ)
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="space-y-6">
        {(activeTab === 'all' || activeTab === 'sfd') && (
          <div className="relative">
            <div className="h-[210px] w-full">
              <Line
                data={sfdData}
                options={getOptions('Shear Force Diagram (SFD)', 'Shear Force V', 'kN')}
              />
            </div>
            <div className="absolute top-2 right-3 text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60 pointer-events-none">
              |V|_max = {formatNumber(extrema.absMaxV_kN, 2)} kN at x = {formatNumber(extrema.x_maxV, 2)} m
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'bmd') && (
          <div className="relative">
            <div className="h-[210px] w-full">
              <Line
                data={bmdData}
                options={getOptions('Bending Moment Diagram (BMD)', 'Bending Moment M', 'kN·m')}
              />
            </div>
            <div className="absolute top-2 right-3 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 pointer-events-none">
              |M|_max = {formatNumber(extrema.absMaxM_kNm, 2)} kN·m at x = {formatNumber(extrema.x_maxM, 2)} m
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'deflection') && (
          <div className="relative">
            <div className="h-[210px] w-full">
              <Line
                data={deflData}
                options={getOptions('Elastic Deflection Profile (Downwards)', 'Deflection -δ', 'mm')}
              />
            </div>
            <div className="absolute top-2 right-3 text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60 pointer-events-none">
              δ_max = {formatNumber(extrema.absMaxDelta_mm, 3)} mm at x = {formatNumber(extrema.x_maxDelta, 2)} m
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

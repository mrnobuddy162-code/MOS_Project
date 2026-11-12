import React from 'react';

export default function ValueBadge({
  label,
  value,
  unit = '',
  status = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info'
  subtext = '',
  className = ''
}) {
  const statusStyles = {
    default: 'bg-slate-800/80 text-slate-200 border-slate-700/80',
    info: 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60',
    success: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/40 text-amber-300 border-amber-800/60',
    danger: 'bg-rose-950/40 text-rose-300 border-rose-800/60'
  };

  return (
    <div className={`p-3 rounded-xl border backdrop-blur-sm transition-all duration-200 ${statusStyles[status]} ${className}`}>
      <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold font-mono tracking-tight">{value}</span>
        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
      </div>
      {subtext && <div className="text-[11px] text-slate-400 mt-1 leading-snug">{subtext}</div>}
    </div>
  );
}

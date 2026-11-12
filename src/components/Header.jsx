import React from 'react';
import { Sun, Moon, RotateCcw, Beaker, Printer, Activity } from 'lucide-react';

export default function Header({
  isDarkMode,
  setIsDarkMode,
  onReset,
  onOpenPresets
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight font-mono text-slate-100 flex items-center gap-2">
              Beam Deflection Simulator
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Euler-Bernoulli v2.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-sans -mt-0.5 hidden xs:block">
              Mechanics of Solids Virtual Lab • Finite Analytical Engine
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Sample Experiments button */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-all shadow-sm"
            title="Explore sample experiments and benchmark problems"
          >
            <Beaker size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Sample Experiments</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono border border-slate-800 transition-all"
            title="Reset to default experiment parameters"
          >
            <RotateCcw size={14} />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Print / Report button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono border border-slate-800 transition-all"
            title="Print laboratory calculation report"
          >
            <Printer size={14} className="text-slate-400" />
            <span className="hidden sm:inline">Print Report</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-all"
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

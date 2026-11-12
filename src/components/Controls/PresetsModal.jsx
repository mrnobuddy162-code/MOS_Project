import React from 'react';
import { SAMPLE_EXPERIMENTS } from '../../constants/experiments';
import { X, Play, Beaker, CheckCircle } from 'lucide-react';

export default function PresetsModal({ isOpen, onClose, onSelectExperiment }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Beaker size={22} className="text-cyan-400" />
            <div>
              <h2 className="text-base font-bold font-mono text-slate-100">
                Sample Mechanics of Solids Experiments
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Curated laboratory benchmark problems from structural engineering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Experiments List */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_EXPERIMENTS.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-cyan-500/80 hover:bg-slate-800/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {exp.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      L = {exp.length} m
                    </span>
                  </div>

                  <h3 className="font-mono text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors mb-2">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3">
                    {exp.description}
                  </p>

                  <div className="text-[11px] text-amber-300/90 font-mono bg-amber-950/20 p-2 rounded-lg border border-amber-900/40 mb-4">
                    🎯 {exp.learningObjective}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectExperiment(exp);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-all shadow-sm"
                >
                  <Play size={14} />
                  Load Experiment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

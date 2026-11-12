import React from 'react';

export default function BeamTypeSelector({ beamType, setBeamType }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 transition-all">
      <label className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400 block mb-3">
        1. Beam Support Configuration
      </label>

      <div className="grid grid-cols-2 gap-3">
        {/* Simply Supported Beam Option */}
        <button
          type="button"
          onClick={() => setBeamType('simplySupported')}
          className={`flex flex-col items-center p-3.5 rounded-xl border-2 text-left transition-all ${
            beamType === 'simplySupported'
              ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950/50'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
          }`}
        >
          <div className="w-full h-12 flex items-center justify-center mb-2 px-2">
            <svg viewBox="0 0 160 48" className="w-full h-full stroke-current">
              {/* Beam line */}
              <line x1="20" y1="20" x2="140" y2="20" strokeWidth="4" className={beamType === 'simplySupported' ? 'stroke-cyan-400' : 'stroke-slate-400'} />
              {/* Left Pin support */}
              <polygon points="20,22 10,40 30,40" fill="none" strokeWidth="2" className={beamType === 'simplySupported' ? 'stroke-cyan-400' : 'stroke-slate-500'} />
              <line x1="5" y1="40" x2="35" y2="40" strokeWidth="2" className="stroke-slate-500" />
              {/* Right Roller support */}
              <polygon points="140,22 130,34 150,34" fill="none" strokeWidth="2" className={beamType === 'simplySupported' ? 'stroke-cyan-400' : 'stroke-slate-500'} />
              <circle cx="134" cy="38" r="3" fill="none" strokeWidth="1.5" className="stroke-slate-500" />
              <circle cx="146" cy="38" r="3" fill="none" strokeWidth="1.5" className="stroke-slate-500" />
              <line x1="125" y1="42" x2="155" y2="42" strokeWidth="2" className="stroke-slate-500" />
            </svg>
          </div>
          <span className="font-mono text-xs font-bold text-slate-100">Simply Supported</span>
          <span className="text-[10px] text-slate-400 mt-0.5 text-center">Pin & Roller (Zero end moments)</span>
        </button>

        {/* Cantilever Beam Option */}
        <button
          type="button"
          onClick={() => setBeamType('cantilever')}
          className={`flex flex-col items-center p-3.5 rounded-xl border-2 text-left transition-all ${
            beamType === 'cantilever'
              ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950/50'
              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
          }`}
        >
          <div className="w-full h-12 flex items-center justify-center mb-2 px-2">
            <svg viewBox="0 0 160 48" className="w-full h-full stroke-current">
              {/* Left Fixed Wall */}
              <line x1="20" y1="4" x2="20" y2="44" strokeWidth="4" className="stroke-slate-400" />
              <line x1="20" y1="8" x2="10" y2="16" strokeWidth="1.5" className="stroke-slate-600" />
              <line x1="20" y1="18" x2="10" y2="26" strokeWidth="1.5" className="stroke-slate-600" />
              <line x1="20" y1="28" x2="10" y2="36" strokeWidth="1.5" className="stroke-slate-600" />
              <line x1="20" y1="38" x2="10" y2="46" strokeWidth="1.5" className="stroke-slate-600" />
              {/* Beam line extending right */}
              <line x1="20" y1="20" x2="145" y2="20" strokeWidth="4" className={beamType === 'cantilever' ? 'stroke-cyan-400' : 'stroke-slate-400'} />
              {/* Free tip marker */}
              <circle cx="145" cy="20" r="3" className="fill-cyan-400 stroke-none" />
            </svg>
          </div>
          <span className="font-mono text-xs font-bold text-slate-100">Cantilever Beam</span>
          <span className="text-[10px] text-slate-400 mt-0.5 text-center">Fixed root & Free tip (Zero tip moment)</span>
        </button>
      </div>
    </div>
  );
}

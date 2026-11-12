export const MATERIALS = {
  steel: {
    id: 'steel',
    name: 'Structural Steel (ASTM A36)',
    E: 200, // GPa
    yieldStrength: 250, // MPa
    density: 7850, // kg/m³
    poisson: 0.30,
    color: '#38bdf8',
    description: 'High strength, standard structural steel widely used in civil and mechanical engineering.'
  },
  aluminium: {
    id: 'aluminium',
    name: 'Aluminium Alloy (6061-T6)',
    E: 69, // GPa
    yieldStrength: 276, // MPa
    density: 2700, // kg/m³
    poisson: 0.33,
    color: '#94a3b8',
    description: 'Lightweight, corrosion resistant alloy common in aerospace and lightweight structures.'
  },
  wood: {
    id: 'wood',
    name: 'Structural Timber (Douglas Fir)',
    E: 12, // GPa
    yieldStrength: 14, // MPa (Allowable bending stress)
    density: 550, // kg/m³
    poisson: 0.35,
    color: '#fbbf24',
    description: 'Natural fibrous anisotropic material; modulus parallel to grain used for joists and timber frames.'
  },
  stainless: {
    id: 'stainless',
    name: 'Stainless Steel (AISI 304)',
    E: 193, // GPa
    yieldStrength: 215, // MPa
    density: 8000, // kg/m³
    poisson: 0.29,
    color: '#cbd5e1',
    description: 'Austenitic chromium-nickel alloy offering exceptional oxidation and corrosion resistance.'
  },
  titanium: {
    id: 'titanium',
    name: 'Titanium Alloy (Ti-6Al-4V)',
    E: 114, // GPa
    yieldStrength: 880, // MPa
    density: 4430, // kg/m³
    poisson: 0.34,
    color: '#a78bfa',
    description: 'Exceptional strength-to-weight ratio and fatigue resistance, vital in aerospace engineering.'
  },
  custom: {
    id: 'custom',
    name: 'Custom Material',
    E: 150, // GPa
    yieldStrength: 200, // MPa
    density: 5000, // kg/m³
    poisson: 0.30,
    color: '#ec4899',
    description: 'User-specified Young\'s Modulus and Yield Strength for experimental research.'
  }
};

export const SAMPLE_EXPERIMENTS = [
  {
    id: 'exp-ss-midpoint',
    title: 'Benchmark Lab 1: Simply Supported Beam with Midspan Load',
    category: 'Simply Supported',
    beamType: 'simplySupported',
    length: 5.0, // m
    pointLoad: 25.0, // kN
    pointLoadPos: 2.5, // m (midspan)
    udl: 0.0, // kN/m
    width: 150, // mm
    height: 300, // mm
    materialId: 'steel',
    customE: 200,
    customYield: 250,
    description: 'Classic textbook case: Maximum bending moment M_max = P*L/4 occurs at center; maximum deflection delta_max = P*L^3 / (48*E*I) at midspan.',
    learningObjective: 'Observe symmetric shear force distribution and parabolic elastic deformation.'
  },
  {
    id: 'exp-ss-udl',
    title: 'Benchmark Lab 2: Uniform Floor Joist under Distributed Dead Load',
    category: 'Simply Supported',
    beamType: 'simplySupported',
    length: 6.0, // m
    pointLoad: 0.0,
    pointLoadPos: 3.0,
    udl: 8.0, // kN/m
    width: 200, // mm
    height: 400, // mm
    materialId: 'wood',
    customE: 12,
    customYield: 14,
    description: 'A timber floor joist subjected to continuous distributed floor load. M_max = w*L^2/8 at center; delta_max = 5*w*L^4 / (384*E*I).',
    learningObjective: 'Analyze quadratic moment curve and 4th-degree polynomial elastic deflection profile.'
  },
  {
    id: 'exp-ss-combined-asymmetric',
    title: 'Lab 3: Asymmetric Combined Loading & Deflection Shift',
    category: 'Simply Supported',
    beamType: 'simplySupported',
    length: 6.0, // m
    pointLoad: 35.0, // kN
    pointLoadPos: 1.8, // m (asymmetric point load)
    udl: 12.0, // kN/m
    width: 180, // mm
    height: 350, // mm
    materialId: 'steel',
    customE: 200,
    customYield: 250,
    description: 'Demonstrates the principle of Superposition. Notice that the point of maximum deflection shifts away from the concentrated load position towards midspan.',
    learningObjective: 'Verify superposition of shear, bending moments, and elastic deflection curves.'
  },
  {
    id: 'exp-cant-tip',
    title: 'Benchmark Lab 4: Cantilever Crane Boom with Tip Load',
    category: 'Cantilever',
    beamType: 'cantilever',
    length: 3.5, // m
    pointLoad: 15.0, // kN
    pointLoadPos: 3.5, // m (at free tip)
    udl: 0.0,
    width: 120, // mm
    height: 250, // mm
    materialId: 'steel',
    customE: 200,
    customYield: 250,
    description: 'A cantilever boom carrying a hoist load at the free tip. Maximum bending moment is at the fixed root M_max = P*L; tip deflection delta_max = P*L^3 / (3*E*I).',
    learningObjective: 'Observe zero slope and zero deflection at the wall fixture, with extreme bending stress at root.'
  },
  {
    id: 'exp-cant-udl-wing',
    title: 'Lab 5: Aircraft Wing Spar Idealization (Cantilever UDL)',
    category: 'Cantilever',
    beamType: 'cantilever',
    length: 4.2, // m
    pointLoad: 8.0, // kN (engine/wingtip pod)
    pointLoadPos: 4.2, // m
    udl: 6.5, // kN/m (aerodynamic lift)
    width: 140, // mm
    height: 280, // mm
    materialId: 'aluminium',
    customE: 69,
    customYield: 276,
    description: 'Idealized aircraft main wing spar subjected to distributed aerodynamic lift and an engine nacelle concentrated load at the tip.',
    learningObjective: 'Explore lightweight aluminium deflection and compare Factor of Safety under aerospace loading.'
  },
  {
    id: 'exp-cant-intermediate',
    title: 'Lab 6: Balcony Overhang with Intermediate Point Load',
    category: 'Cantilever',
    beamType: 'cantilever',
    length: 4.0, // m
    pointLoad: 20.0, // kN
    pointLoadPos: 2.2, // m (intermediate position)
    udl: 4.0, // kN/m
    width: 160, // mm
    height: 320, // mm
    materialId: 'steel',
    customE: 200,
    customYield: 250,
    description: 'Cantilever with concentrated load placed midway. Note that beyond the point load (x > a), the point load produces zero additional shear and linear deflection (constant slope).',
    learningObjective: 'Understand piecewise boundary equations in Euler-Bernoulli beam theory.'
  }
];

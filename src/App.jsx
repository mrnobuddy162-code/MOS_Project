import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import BeamTypeSelector from './components/Controls/BeamTypeSelector';
import GeometryControls from './components/Controls/GeometryControls';
import LoadControls from './components/Controls/LoadControls';
import MaterialSelector from './components/Controls/MaterialSelector';
import PresetsModal from './components/Controls/PresetsModal';
import BeamCanvas from './components/Visualizer/BeamCanvas';
import VisualizerControls from './components/Visualizer/VisualizerControls';
import CrossSectionVisualizer from './components/Visualizer/CrossSectionVisualizer';
import EngineeringCharts from './components/Diagrams/EngineeringCharts';
import SummaryCards from './components/Calculations/SummaryCards';
import StepByStepMath from './components/Calculations/StepByStepMath';
import DeflectionValuesTable from './components/Calculations/DeflectionValuesTable';
import { calculateBeamProperties } from './utils/beamTheory';
import { MATERIALS } from './constants/materials';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Beam configuration state
  const [beamType, setBeamType] = useState('simplySupported');
  const [length, setLength] = useState(5.0);
  const [pointLoad, setPointLoad] = useState(25.0);
  const [pointLoadPos, setPointLoadPos] = useState(2.5);
  const [udl, setUdl] = useState(8.0);
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(300);
  const [materialId, setMaterialId] = useState('steel');
  const [customE, setCustomE] = useState(200);
  const [customYield, setCustomYield] = useState(250);

  // Visualizer options
  const [deflectionScale, setDeflectionScale] = useState('auto');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNeutralAxis, setShowNeutralAxis] = useState(true);
  const [showUndeformed, setShowUndeformed] = useState(true);
  const [showForces, setShowForces] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showStressColors, setShowStressColors] = useState(true);

  // Presets modal state
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Active material properties
  const activeMaterial = MATERIALS[materialId] || MATERIALS.steel;
  const youngsModulus = materialId === 'custom' ? customE : activeMaterial.E;
  const yieldStrength = materialId === 'custom' ? customYield : activeMaterial.yieldStrength;

  // Compute beam mechanics via Euler-Bernoulli engine
  const beamData = useMemo(() => {
    return calculateBeamProperties({
      beamType,
      length,
      pointLoad,
      pointLoadPos,
      udl,
      width,
      height,
      youngsModulus,
      yieldStrength,
      sampleCount: 300
    });
  }, [
    beamType,
    length,
    pointLoad,
    pointLoadPos,
    udl,
    width,
    height,
    youngsModulus,
    yieldStrength
  ]);

  // Reset to default laboratory experiment
  const handleReset = () => {
    setBeamType('simplySupported');
    setLength(5.0);
    setPointLoad(25.0);
    setPointLoadPos(2.5);
    setUdl(8.0);
    setWidth(150);
    setHeight(300);
    setMaterialId('steel');
    setCustomE(200);
    setCustomYield(250);
    setDeflectionScale('auto');
    setIsAnimating(false);
  };

  // Load a preset sample experiment
  const handleSelectExperiment = (exp) => {
    setBeamType(exp.beamType);
    setLength(exp.length);
    setPointLoad(exp.pointLoad);
    setPointLoadPos(exp.pointLoadPos);
    setUdl(exp.udl);
    setWidth(exp.width);
    setHeight(exp.height);
    setMaterialId(exp.materialId);
    if (exp.customE) setCustomE(exp.customE);
    if (exp.customYield) setCustomYield(exp.customYield);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* Header Bar */}
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onReset={handleReset}
        onOpenPresets={() => setIsPresetsOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Summary Cards */}
        <SummaryCards beamData={beamData} />

        {/* Core Workspace Layout: 2-Column Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Engineering Controls (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5 no-print">
            <BeamTypeSelector
              beamType={beamType}
              setBeamType={setBeamType}
            />

            <GeometryControls
              length={length}
              setLength={setLength}
              width={width}
              setWidth={setWidth}
              height={height}
              setHeight={setHeight}
              pointLoadPos={pointLoadPos}
              setPointLoadPos={setPointLoadPos}
            />

            <LoadControls
              length={length}
              pointLoad={pointLoad}
              setPointLoad={setPointLoad}
              pointLoadPos={pointLoadPos}
              setPointLoadPos={setPointLoadPos}
              udl={udl}
              setUdl={setUdl}
              beamType={beamType}
            />

            <MaterialSelector
              materialId={materialId}
              setMaterialId={setMaterialId}
              customE={customE}
              setCustomE={setCustomE}
              customYield={customYield}
              setCustomYield={setCustomYield}
            />
          </div>

          {/* Right Column: Visual Simulation & Analytical Graphs (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Visual Simulation Canvas */}
            <div className="space-y-3">
              <BeamCanvas
                beamData={beamData}
                deflectionScale={deflectionScale}
                isAnimating={isAnimating}
                showNeutralAxis={showNeutralAxis}
                showUndeformed={showUndeformed}
                showForces={showForces}
                showDimensions={showDimensions}
                showStressColors={showStressColors}
                onPointLoadChange={setPointLoadPos}
                isDarkMode={isDarkMode}
              />

              <VisualizerControls
                isAnimating={isAnimating}
                setIsAnimating={setIsAnimating}
                deflectionScale={deflectionScale}
                setDeflectionScale={setDeflectionScale}
                showNeutralAxis={showNeutralAxis}
                setShowNeutralAxis={setShowNeutralAxis}
                showUndeformed={showUndeformed}
                setShowUndeformed={setShowUndeformed}
                showForces={showForces}
                setShowForces={setShowForces}
                showDimensions={showDimensions}
                setShowDimensions={setShowDimensions}
                showStressColors={showStressColors}
                setShowStressColors={setShowStressColors}
              />
            </div>

            {/* Cross Section 2D Mechanics Visualizer */}
            <CrossSectionVisualizer
              config={beamData.config}
              extrema={beamData.extrema}
              isDarkMode={isDarkMode}
            />

            {/* Interactive Engineering Diagrams (SFD & BMD) */}
            <EngineeringCharts
              beamData={beamData}
              isDarkMode={isDarkMode}
            />

            {/* Step-by-Step Mathematical Derivations */}
            <StepByStepMath
              beamData={beamData}
            />

            {/* Deflection & Internal Forces Table with CSV Export */}
            <DeflectionValuesTable
              beamData={beamData}
            />
          </div>
        </div>
      </main>

      {/* Sample Experiments Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectExperiment={handleSelectExperiment}
      />
    </div>
  );
}

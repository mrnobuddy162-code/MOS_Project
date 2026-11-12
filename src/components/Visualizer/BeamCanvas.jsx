import React, { useRef, useEffect, useState, useCallback } from 'react';
import { formatNumber } from '../../utils/formatters';

export default function BeamCanvas({
  beamData,
  deflectionScale = 'auto', // 'auto' | 1 | 10 | 50 | 100 | 500
  isAnimating = false,
  showNeutralAxis = true,
  showUndeformed = true,
  showForces = true,
  showDimensions = true,
  showStressColors = true,
  onPointLoadChange, // optional drag callback
  isDarkMode = true
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoverData, setHoverData] = useState(null);
  const [isDraggingPointLoad, setIsDraggingPointLoad] = useState(false);
  const animTimeRef = useRef(0);
  const animFrameRef = useRef(null);

  const { config, reactions, extrema, evaluateAt } = beamData;
  const { beamType, L, a, P_kN, w_kNm, height_mm, width_mm } = config;

  // Compute effective deflection scale
  const getScaleFactor = useCallback(() => {
    if (deflectionScale === 'auto') {
      const maxD = extrema.absMaxDelta_mm;
      if (maxD <= 0.0001) return 1;
      // Target a maximum visual displacement of around 55 pixels
      return Math.min(10000, Math.max(1, 55 / maxD));
    }
    return Number(deflectionScale) || 50;
  }, [deflectionScale, extrema.absMaxDelta_mm]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      // Handle resizing with DPI scaling
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

      // Animation factor: if animating, oscillate with sine wave
      let loadFactor = 1.0;
      if (isAnimating) {
        animTimeRef.current += 0.025;
        // Smooth oscillation between 0.1 and 1.0
        loadFactor = 0.55 + 0.45 * Math.sin(animTimeRef.current);
      }

      const scaleMultiplier = getScaleFactor() * loadFactor;

      // Coordinate System Layout
      const margin = {
        left: beamType === 'cantilever' ? 90 : 80,
        right: 80,
        top: 130,
        bottom: 95
      };

      const beamDrawWidth = width - margin.left - margin.right;
      const scaleX = beamDrawWidth / L;
      const baselineY = margin.top + 50;

      // Map beam x (m) to canvas pixel X
      const toPx = (xVal) => margin.left + xVal * scaleX;
      // Map canvas pixel X back to beam x (m)
      const toX = (pxVal) => (pxVal - margin.left) / scaleX;

      // Proportional beam thickness on screen
      const beamThickPx = Math.min(42, Math.max(18, (height_mm / 400) * 28));

      // Color Palette based on theme
      const colors = isDarkMode
        ? {
            bg: '#0f172a',
            grid: '#1e293b',
            beamUndeformed: 'rgba(71, 85, 105, 0.35)',
            beamBody: '#38bdf8',
            beamStroke: '#0284c7',
            neutralAxis: '#f59e0b',
            supportFill: '#64748b',
            supportStroke: '#94a3b8',
            groundLine: '#475569',
            forceArrow: '#f43f5e',
            reactionArrow: '#10b981',
            dimLine: '#64748b',
            text: '#94a3b8',
            textBright: '#f8fafc',
            hudBg: 'rgba(15, 23, 42, 0.92)',
            hudBorder: '#334155'
          }
        : {
            bg: '#ffffff',
            grid: '#f1f5f9',
            beamUndeformed: 'rgba(203, 213, 225, 0.6)',
            beamBody: '#0284c7',
            beamStroke: '#0369a1',
            neutralAxis: '#d97706',
            supportFill: '#94a3b8',
            supportStroke: '#64748b',
            groundLine: '#cbd5e1',
            forceArrow: '#e11d48',
            reactionArrow: '#059669',
            dimLine: '#94a3b8',
            text: '#64748b',
            textBright: '#0f172a',
            hudBg: 'rgba(255, 255, 255, 0.95)',
            hudBorder: '#cbd5e1'
          };

      // 1. Draw Subtle Grid
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Supports
      const drawGroundHatch = (cx, cy, hatchWidth) => {
        ctx.strokeStyle = colors.groundLine;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - hatchWidth / 2, cy);
        ctx.lineTo(cx + hatchWidth / 2, cy);
        ctx.stroke();

        ctx.lineWidth = 1;
        const count = 6;
        const step = hatchWidth / count;
        for (let i = 0; i <= count; i++) {
          const hx = cx - hatchWidth / 2 + i * step;
          ctx.beginPath();
          ctx.moveTo(hx, cy);
          ctx.lineTo(hx - 5, cy + 7);
          ctx.stroke();
        }
      };

      if (beamType === 'simplySupported') {
        const pinX = toPx(0);
        const pinY = baselineY + beamThickPx / 2;
        const rollerX = toPx(L);
        const rollerY = baselineY + beamThickPx / 2;

        // --- Left Pin Support ---
        ctx.fillStyle = colors.supportFill;
        ctx.strokeStyle = colors.supportStroke;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pinX, pinY);
        ctx.lineTo(pinX - 14, pinY + 24);
        ctx.lineTo(pinX + 14, pinY + 24);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pin hinge dot
        ctx.fillStyle = isDarkMode ? '#0f172a' : '#ffffff';
        ctx.beginPath();
        ctx.arc(pinX, pinY + 4, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pin ground
        drawGroundHatch(pinX, pinY + 24, 38);

        // --- Right Roller Support ---
        ctx.fillStyle = colors.supportFill;
        ctx.strokeStyle = colors.supportStroke;
        ctx.beginPath();
        ctx.moveTo(rollerX, rollerY);
        ctx.lineTo(rollerX - 14, rollerY + 16);
        ctx.lineTo(rollerX + 14, rollerY + 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Roller hinge dot
        ctx.fillStyle = isDarkMode ? '#0f172a' : '#ffffff';
        ctx.beginPath();
        ctx.arc(rollerX, rollerY + 3.5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Roller wheels
        ctx.fillStyle = colors.supportStroke;
        ctx.beginPath();
        ctx.arc(rollerX - 7, rollerY + 21, 4, 0, Math.PI * 2);
        ctx.arc(rollerX + 7, rollerY + 21, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Roller ground
        drawGroundHatch(rollerX, rollerY + 26, 38);

      } else {
        // --- Cantilever Fixed Wall Support ---
        const wallX = toPx(0);
        const wallTop = baselineY - 45;
        const wallBottom = baselineY + 55;

        // Solid vertical fixture bar
        ctx.strokeStyle = colors.supportStroke;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(wallX, wallTop);
        ctx.lineTo(wallX, wallBottom);
        ctx.stroke();

        // Hatched lines into the wall
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = colors.groundLine;
        for (let y = wallTop; y <= wallBottom; y += 8) {
          ctx.beginPath();
          ctx.moveTo(wallX, y);
          ctx.lineTo(wallX - 14, y + 10);
          ctx.stroke();
        }

        // Bracket flanges
        ctx.fillStyle = colors.supportFill;
        ctx.fillRect(wallX - 4, baselineY - beamThickPx / 2 - 8, 8, beamThickPx + 16);
      }

      // 3. Draw Undeformed Beam (Ghost Outline)
      if (showUndeformed) {
        ctx.strokeStyle = colors.beamUndeformed;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(
          toPx(0),
          baselineY - beamThickPx / 2,
          beamDrawWidth,
          beamThickPx
        );
        ctx.setLineDash([]);
      }

      // 4. Sample and Draw Deformed Beam
      const numSegments = 120;
      const topFiberPts = [];
      const botFiberPts = [];
      const naPts = [];

      for (let i = 0; i <= numSegments; i++) {
        const segX = (i / numSegments) * L;
        const evalPt = evaluateAt(segX);
        const screenX = toPx(segX);
        // Deflection in pixels = delta_mm * (scaleMultiplier / 1000) * (pixel conversion)
        // Note: delta_mm is in mm.
        const deflPx = evalPt.delta_mm * (scaleMultiplier / 10); // visual displacement in px

        const curCenterY = baselineY + deflPx;
        naPts.push({ x: screenX, y: curCenterY, val: evalPt });
        topFiberPts.push({ x: screenX, y: curCenterY - beamThickPx / 2 });
        botFiberPts.push({ x: screenX, y: curCenterY + beamThickPx / 2 });
      }

      // Render Deformed Beam Body
      ctx.beginPath();
      ctx.moveTo(topFiberPts[0].x, topFiberPts[0].y);
      for (let i = 1; i < topFiberPts.length; i++) {
        ctx.lineTo(topFiberPts[i].x, topFiberPts[i].y);
      }
      // Right edge cap
      ctx.lineTo(botFiberPts[botFiberPts.length - 1].x, botFiberPts[botFiberPts.length - 1].y);
      // Bottom edge reverse
      for (let i = botFiberPts.length - 2; i >= 0; i--) {
        ctx.lineTo(botFiberPts[i].x, botFiberPts[i].y);
      }
      ctx.closePath();

      // Stress Color Gradient or Solid Fill
      if (showStressColors && extrema.absMaxM_kNm > 0.001) {
        // Create horizontal gradient mapping bending moment distribution
        const beamGrad = ctx.createLinearGradient(toPx(0), 0, toPx(L), 0);
        const stops = [0, 0.25, 0.5, 0.75, 1.0];
        stops.forEach(s => {
          const sX = s * L;
          const ev = evaluateAt(sX);
          const ratio = Math.min(1, Math.abs(ev.M_kNm) / (extrema.absMaxM_kNm || 1));
          // Color interpolate from base blue to amber/red under high moment
          const r = Math.round(14 + ratio * 220);
          const g = Math.round(165 - ratio * 100);
          const b = Math.round(233 - ratio * 150);
          beamGrad.addColorStop(s, `rgba(${r}, ${g}, ${b}, ${isDarkMode ? 0.45 : 0.65})`);
        });
        ctx.fillStyle = beamGrad;
      } else {
        ctx.fillStyle = isDarkMode ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.4)';
      }
      ctx.fill();

      // Beam Border Outline
      ctx.strokeStyle = colors.beamStroke;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 5. Draw Neutral Axis
      if (showNeutralAxis) {
        ctx.strokeStyle = colors.neutralAxis;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(naPts[0].x, naPts[0].y);
        for (let i = 1; i < naPts.length; i++) {
          ctx.lineTo(naPts[i].x, naPts[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Neutral axis tag at midspan or free end
        const tagPt = naPts[Math.floor(naPts.length * 0.48)];
        ctx.fillStyle = colors.neutralAxis;
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText('N.A.', tagPt.x - 12, tagPt.y - 6);
      }

      // 6. Draw Applied Loads & Reaction Vectors
      if (showForces) {
        const drawArrow = (fromX, fromY, toX, toY, color, headLen = 10) => {
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();

          const angle = Math.atan2(toY - fromY, toX - fromX);
          ctx.beginPath();
          ctx.moveTo(toX, toY);
          ctx.lineTo(
            toX - headLen * Math.cos(angle - Math.PI / 6),
            toY - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            toX - headLen * Math.cos(angle + Math.PI / 6),
            toY - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        };

        // --- UDL Distributed Load (Series of arrows + top bar) ---
        if (w_kNm > 0) {
          const udlArrowSpacing = 32;
          const udlHeight = 44;
          const numUdlArrows = Math.max(3, Math.floor(beamDrawWidth / udlArrowSpacing));
          const topBarY = baselineY - beamThickPx / 2 - udlHeight;

          // Translucent load area fill
          ctx.fillStyle = isDarkMode ? 'rgba(244, 63, 94, 0.12)' : 'rgba(225, 29, 72, 0.12)';
          ctx.fillRect(toPx(0), topBarY, beamDrawWidth, udlHeight);

          // Top distribution bar
          ctx.strokeStyle = colors.forceArrow;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(toPx(0), topBarY);
          ctx.lineTo(toPx(L), topBarY);
          ctx.stroke();

          // Small downward arrows
          for (let i = 0; i <= numUdlArrows; i++) {
            const arrX = toPx((i / numUdlArrows) * L);
            drawArrow(arrX, topBarY, arrX, baselineY - beamThickPx / 2, colors.forceArrow, 7);
          }

          // UDL Label pill
          ctx.fillStyle = colors.forceArrow;
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          const udlLabel = `w = ${formatNumber(w_kNm, 1)} kN/m`;
          const textMetrics = ctx.measureText(udlLabel);
          const badgeX = toPx(L * 0.5) - textMetrics.width / 2 - 8;
          const badgeY = topBarY - 22;

          ctx.fillStyle = isDarkMode ? '#1e293b' : '#ffffff';
          ctx.strokeStyle = colors.forceArrow;
          ctx.lineWidth = 1;
          ctx.fillRect(badgeX, badgeY, textMetrics.width + 16, 18);
          ctx.strokeRect(badgeX, badgeY, textMetrics.width + 16, 18);

          ctx.fillStyle = colors.forceArrow;
          ctx.fillText(udlLabel, badgeX + 8, badgeY + 13);
        }

        // --- Concentrated Point Load P ---
        if (P_kN > 0) {
          const pointX = toPx(a);
          // Find beam top surface at point load position
          const ptEval = evaluateAt(a);
          const ptDeflPx = ptEval.delta_mm * (scaleMultiplier / 10);
          const ptBeamTopY = baselineY + ptDeflPx - beamThickPx / 2;
          const arrowLength = 65;
          const arrowStartY = ptBeamTopY - arrowLength;

          // Draw prominent force arrow
          drawArrow(pointX, arrowStartY, pointX, ptBeamTopY, colors.forceArrow, 14);

          // Load tag badge
          const pLabel = `P = ${formatNumber(P_kN, 1)} kN`;
          ctx.font = 'bold 12px "JetBrains Mono", monospace';
          const pMetrics = ctx.measureText(pLabel);
          const pBadgeX = pointX - pMetrics.width / 2 - 8;
          const pBadgeY = arrowStartY - 22;

          ctx.fillStyle = isDarkMode ? '#1e293b' : '#ffffff';
          ctx.strokeStyle = colors.forceArrow;
          ctx.lineWidth = 1.5;
          ctx.fillRect(pBadgeX, pBadgeY, pMetrics.width + 16, 20);
          ctx.strokeRect(pBadgeX, pBadgeY, pMetrics.width + 16, 20);

          ctx.fillStyle = colors.forceArrow;
          ctx.fillText(pLabel, pBadgeX + 8, pBadgeY + 14);

          // Load point indicator on beam
          ctx.fillStyle = colors.forceArrow;
          ctx.beginPath();
          ctx.arc(pointX, ptBeamTopY, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // --- Support Reaction Arrows (Green) ---
        if (beamType === 'simplySupported') {
          // RA at x=0
          const raY = baselineY + beamThickPx / 2 + 52;
          drawArrow(toPx(0), raY, toPx(0), baselineY + beamThickPx / 2 + 25, colors.reactionArrow, 9);
          ctx.fillStyle = colors.reactionArrow;
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.fillText(`RA=${formatNumber(reactions.RA_kN, 1)}kN`, toPx(0) - 24, raY + 14);

          // RB at x=L
          const rbY = baselineY + beamThickPx / 2 + 54;
          drawArrow(toPx(L), rbY, toPx(L), baselineY + beamThickPx / 2 + 27, colors.reactionArrow, 9);
          ctx.fillText(`RB=${formatNumber(reactions.RB_kN, 1)}kN`, toPx(L) - 24, rbY + 14);
        } else {
          // Cantilever wall reactions: RA upward and MA moment
          const raY = baselineY + beamThickPx / 2 + 45;
          drawArrow(toPx(0), raY, toPx(0), baselineY + beamThickPx / 2 + 10, colors.reactionArrow, 9);
          ctx.fillStyle = colors.reactionArrow;
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.fillText(`RA=${formatNumber(reactions.RA_kN, 1)}kN`, toPx(0) - 52, raY + 12);

          // Curved moment arrow for MA
          ctx.strokeStyle = colors.reactionArrow;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(toPx(0) - 18, baselineY, 18, Math.PI * 0.4, Math.PI * 1.5, false);
          ctx.stroke();
          // Moment arrowhead
          drawArrow(toPx(0) - 18, baselineY - 18, toPx(0) - 24, baselineY - 18, colors.reactionArrow, 7);
          ctx.fillText(`MA=${formatNumber(reactions.MA_kNm, 1)}kNm`, toPx(0) - 86, baselineY - 24);
        }
      }

      // 7. Dimension Lines
      if (showDimensions) {
        const dimY = baselineY + beamThickPx / 2 + 76;
        ctx.strokeStyle = colors.dimLine;
        ctx.lineWidth = 1;
        ctx.fillStyle = colors.text;
        ctx.font = '11px "JetBrains Mono", monospace';

        // Overall Beam Length Dimension
        ctx.beginPath();
        // Left tick
        ctx.moveTo(toPx(0), dimY - 6);
        ctx.lineTo(toPx(0), dimY + 6);
        // Right tick
        ctx.moveTo(toPx(L), dimY - 6);
        ctx.lineTo(toPx(L), dimY + 6);
        // Dimension bar
        ctx.moveTo(toPx(0), dimY);
        ctx.lineTo(toPx(L), dimY);
        ctx.stroke();

        const lenText = `Span L = ${formatNumber(L, 2)} m`;
        const lenW = ctx.measureText(lenText).width;
        ctx.fillStyle = colors.bg;
        ctx.fillRect(toPx(L / 2) - lenW / 2 - 4, dimY - 8, lenW + 8, 16);
        ctx.fillStyle = colors.textBright;
        ctx.fillText(lenText, toPx(L / 2) - lenW / 2, dimY + 4);

        // Point load position dimension if point load exists
        if (P_kN > 0 && a > 0.05 && a < L - 0.05) {
          const ptDimY = baselineY + beamThickPx / 2 + 94;
          ctx.strokeStyle = colors.dimLine;
          ctx.beginPath();
          ctx.moveTo(toPx(0), ptDimY - 4);
          ctx.lineTo(toPx(0), ptDimY + 4);
          ctx.moveTo(toPx(a), ptDimY - 4);
          ctx.lineTo(toPx(a), ptDimY + 4);
          ctx.moveTo(toPx(0), ptDimY);
          ctx.lineTo(toPx(a), ptDimY);
          ctx.stroke();

          const aText = `a = ${formatNumber(a, 2)} m`;
          const aW = ctx.measureText(aText).width;
          ctx.fillStyle = colors.bg;
          ctx.fillRect(toPx(a / 2) - aW / 2 - 4, ptDimY - 7, aW + 8, 14);
          ctx.fillStyle = colors.text;
          ctx.fillText(aText, toPx(a / 2) - aW / 2, ptDimY + 4);
        }
      }

      // 8. Max Deflection Marker & Callout
      if (extrema.absMaxDelta_mm > 0.001) {
        const maxPt = evaluateAt(extrema.x_maxDelta);
        const maxDeflPx = maxPt.delta_mm * (scaleMultiplier / 10);
        const maxScrnX = toPx(extrema.x_maxDelta);
        const maxScrnY = baselineY + maxDeflPx + beamThickPx / 2;

        // Glow circle at max deflection point
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(maxScrnX, maxScrnY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(maxScrnX, baselineY + beamThickPx / 2);
        ctx.lineTo(maxScrnX, maxScrnY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 9. Interactive Hover HUD Crosshair
      if (hoverData) {
        const hoverScrnX = toPx(hoverData.x);
        const hoverPt = evaluateAt(hoverData.x);
        const hoverDeflPx = hoverPt.delta_mm * (scaleMultiplier / 10);
        const hoverScrnY = baselineY + hoverDeflPx;

        // Vertical probe line
        ctx.strokeStyle = isDarkMode ? 'rgba(56, 189, 248, 0.85)' : 'rgba(2, 132, 199, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(hoverScrnX, margin.top - 20);
        ctx.lineTo(hoverScrnX, height - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Intersection point on deformed beam
        ctx.fillStyle = isDarkMode ? '#38bdf8' : '#0284c7';
        ctx.beginPath();
        ctx.arc(hoverScrnX, hoverScrnY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Render sleek HUD box
        const hudWidth = 180;
        const hudHeight = 115;
        let hudX = hoverScrnX + 16;
        if (hudX + hudWidth > width - 10) {
          hudX = hoverScrnX - hudWidth - 16;
        }
        let hudY = Math.max(margin.top - 30, Math.min(height - hudHeight - 20, hoverScrnY - 50));

        // Glassmorphism HUD Card
        ctx.fillStyle = colors.hudBg;
        ctx.strokeStyle = colors.hudBorder;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(hudX, hudY, hudWidth, hudHeight, 10);
        ctx.fill();
        ctx.stroke();

        // HUD Content Lines
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = isDarkMode ? '#38bdf8' : '#0284c7';
        ctx.fillText(`LOCATION: x = ${formatNumber(hoverData.x, 2)} m`, hudX + 10, hudY + 20);

        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = colors.text;
        ctx.fillText(`Deflection:`, hudX + 10, hudY + 40);
        ctx.fillStyle = isDarkMode ? '#f8fafc' : '#0f172a';
        ctx.fillText(`${formatNumber(hoverPt.delta_mm, 3)} mm`, hudX + 90, hudY + 40);

        ctx.fillStyle = colors.text;
        ctx.fillText(`Bending M:`, hudX + 10, hudY + 58);
        ctx.fillStyle = hoverPt.M_kNm >= 0 ? '#10b981' : '#f43f5e';
        ctx.fillText(`${formatNumber(hoverPt.M_kNm, 2)} kN·m`, hudX + 90, hudY + 58);

        ctx.fillStyle = colors.text;
        ctx.fillText(`Shear V:`, hudX + 10, hudY + 76);
        ctx.fillStyle = isDarkMode ? '#f8fafc' : '#0f172a';
        ctx.fillText(`${formatNumber(hoverPt.V_kN, 2)} kN`, hudX + 90, hudY + 76);

        ctx.fillStyle = colors.text;
        ctx.fillText(`Bending σ:`, hudX + 10, hudY + 94);
        ctx.fillStyle = hoverPt.sigma_b_MPa > (config.yieldStrength_MPa || 250) ? '#f43f5e' : (isDarkMode ? '#38bdf8' : '#0284c7');
        ctx.fillText(`${formatNumber(hoverPt.sigma_b_MPa, 1)} MPa`, hudX + 90, hudY + 94);
      }

      ctx.restore();

      if (isRunning && isAnimating) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    beamData,
    deflectionScale,
    isAnimating,
    showNeutralAxis,
    showUndeformed,
    showForces,
    showDimensions,
    showStressColors,
    hoverData,
    isDarkMode,
    getScaleFactor
  ]);

  // Handle Mouse Events for Hover HUD and Dragging
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const margin = {
      left: beamType === 'cantilever' ? 90 : 80,
      right: 80
    };
    const beamDrawWidth = rect.width - margin.left - margin.right;
    const scaleX = beamDrawWidth / L;

    const beamX = (mouseX - margin.left) / scaleX;

    if (beamX >= 0 && beamX <= L) {
      setHoverData({ x: beamX });

      if (isDraggingPointLoad && onPointLoadChange) {
        const roundedX = Math.round(beamX * 10) / 10;
        onPointLoadChange(Math.max(0, Math.min(L, roundedX)));
      }
    } else {
      setHoverData(null);
    }
  };

  const handleMouseDown = (e) => {
    if (!hoverData || P_kN === 0 || !onPointLoadChange) return;
    // Check if clicked near point load position 'a'
    if (Math.abs(hoverData.x - a) <= L * 0.05) {
      setIsDraggingPointLoad(true);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingPointLoad(false);
  };

  const handleMouseLeave = () => {
    setHoverData(null);
    setIsDraggingPointLoad(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[430px] rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-md shadow-2xl transition-all select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair block"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />

      {/* Top Overlay Badges */}
      <div className="absolute top-3 left-4 flex flex-wrap items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold font-mono bg-cyan-950/60 border border-cyan-700/60 text-cyan-300">
          {beamType === 'simplySupported' ? 'SIMPLY SUPPORTED BEAM' : 'CANTILEVER BEAM'}
        </span>
        <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800/80 border border-slate-700/80 text-slate-300">
          Scale: {deflectionScale === 'auto' ? 'Auto-Exaggerated' : `${deflectionScale}×`}
        </span>
        {isAnimating && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-950/70 border border-emerald-700/70 text-emerald-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Dynamic Oscillation
          </span>
        )}
      </div>

      {/* Interactive Drag Hint */}
      {P_kN > 0 && onPointLoadChange && (
        <div className="absolute bottom-3 right-4 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/60 pointer-events-none">
          Tip: Hover to probe values • Click & drag load arrow to reposition
        </div>
      )}
    </div>
  );
}

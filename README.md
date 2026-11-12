# Beam Deflection Simulator – Mechanics of Solids Virtual Lab

A high-precision, interactive engineering simulation application built with **React**, **Vite**, **Tailwind CSS**, **HTML5 Canvas**, and **Chart.js**, rigorously modeling **Euler-Bernoulli Beam Theory**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure **Node.js** (v18 or higher) is installed on your Mac:
```bash
node -v
npm -v
```

### 2. Navigate to the Project
Open your Terminal and enter:
```bash
cd ~/Desktop/beam-deflection-simulator
```

### 3. Start the Development Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Features

* **Dual Support Configurations**: Simply Supported Beam (Pin & Roller) and Cantilever Beam (Fixed root & Free tip).
* **Load Superposition**: Simultaneous Concentrated Point Loads ($P, a$) and Uniformly Distributed Loads ($w$).
* **Cross-Section Mechanics**: Real-time rectangular section visualizer ($b \times h$) displaying the Neutral Axis, linear Navier bending stress profile ($\pm \sigma$), and parabolic shear stress distribution ($\tau$).
* **Interactive Canvas**: High-DPI animation with deformed elastic curves, dynamic load vectors, reaction forces, deflection scaling ($1\times - 500\times$, Auto), dynamic oscillation, and mouse hover probe HUD.
* **Engineering Diagrams (Chart.js)**: Shear Force Diagram (SFD), Bending Moment Diagram (BMD), and Elastic Deflection profiles.
* **Step-by-Step Derivations**: Mathematical equilibrium, integration, and flexure formula evaluations rendered with KaTeX.
* **Laboratory Data Export**: Tabular data inspection with one-click **CSV Export** and printable engineering report layout.
* **6 Benchmark Experiments**: Textbook problems for structural steel, aluminium alloy, and timber joists.
# MOS_Project

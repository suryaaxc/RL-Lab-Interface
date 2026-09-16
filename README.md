# 🧪 Aperture RL Test Bed: Advanced Agent Simulation Dashboard

> **Proprietary Software** • **All Rights Reserved**

A high-fidelity, real-time reinforcement learning (RL) simulation dashboard. This application provides a sterile, clinical diagnostics interface for monitoring autonomous agents, complete with telemetry data, Monte Carlo Tree Search (MCTS) pathfinding visualization, and live neural network activation monitoring.

---

## ✨ Key Features

- **Real-Time Agent Telemetry:** Live FPS tracking, episode steps (`ENV_TICK`), dynamic epsilon decay simulation, and reward signals.
- **MCTS Ghost Pathing:** Predictive Monte Carlo Tree Search lookahead rendered via transient ghost trails on a custom 2D canvas.
- **Neural Pathway Visualizer:** Real-time forward-pass layer activations of the agent's policy network, dynamically mapped to current high-reward decision branches.
- **Diagnostics Control Unit:** Frame-by-frame debugging controls (Pause, Resume, Step Forward) to granularly inspect agent decision boundaries.
- **Clinical Design Language:** An advanced, clean-room aesthetic utilizing CSS grid blueprints, glass-morphic panels, and sterile amber alert states.

---

## 🛠️ Technology Stack

- **Framework:** [React 18](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom Blueprint & Glassmorphism extensions)
- **Visualization:** HTML5 Canvas API (Emulator Render) & [D3.js](https://d3js.org/) (MCTS Tree)
- **Icons & Animation:** [Lucide React](https://lucide.dev/) & [Motion](https://motion.dev/)

---

## 🚀 Getting Started

To run the simulation locally, ensure you have Node.js installed, then execute the following commands:

```bash
# Install required dependencies
npm install

# Start the development server
npm run dev
```

The application will bind to `http://localhost:3000` by default.

---

## ⚙️ Configuration

The dashboard includes a built-in configuration modal (`LAB CONFIGURATION`) accessible via the settings icon in the top right. Here you can adjust:
1. **Blueprint Grid Opacity:** Tune the sterile environment background intensity.
2. **Simulation Multiplier:** Adjust the execution speed (`0.5x`, `1x`, `2x`) of the RL agent's tick rate.

Settings are persisted directly to your browser's local storage.

---

## ⚖️ License & Copyright

**© 2026. All Rights Reserved.**

This repository and its contents are **proprietary and confidential**. 

You may not copy, reproduce, distribute, publish, display, perform, modify, create derivative works, transmit, or in any way exploit any such content, nor may you distribute any part of this content over any network, including a local area network, sell or offer it for sale, or use such content to construct any kind of database.

*Unauthorized copying, modification, or distribution of this software, via any medium, is strictly prohibited.* See the `LICENSE` file for full details.

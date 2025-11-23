<div align="center">

# Binary Adder Simulator (BinSim)

An interactive visual simulator for understanding binary addition and digital logic circuits.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://copy-of-binary-logic-o8elxmy0t-arijit2772-devs-projects.vercel.app)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

---

### Scan to Open

<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://copy-of-binary-logic-o8elxmy0t-arijit2772-devs-projects.vercel.app" alt="QR Code" width="200"/>

**Live URL:** [https://copy-of-binary-logic-o8elxmy0t-arijit2772-devs-projects.vercel.app](https://copy-of-binary-logic-o8elxmy0t-arijit2772-devs-projects.vercel.app)

</div>

---

## Features

| Module | Description |
|--------|-------------|
| **Half Adder** | Visualize XOR and AND gate operations for single-bit addition |
| **Full Adder** | Understand carry propagation with interactive 3-input adder |
| **N-Bit Adder** | Build and simulate multi-bit ripple carry adders |
| **Documentation** | In-app reference for binary arithmetic concepts |

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Hosting:** Vercel

## Run Locally

**Prerequisites:** Node.js 18+

```bash
# Clone the repository
git clone https://github.com/Arijit2772-dev/computer-architechture-projects-.git

# Navigate to project
cd computer-architechture-projects-/copy-of-binary-logic-sim

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
copy-of-binary-logic-sim/
├── components/
│   ├── HalfAdder.tsx      # Half adder visualization
│   ├── FullAdder.tsx      # Full adder visualization
│   ├── NBitAdder.tsx      # N-bit ripple carry adder
│   ├── TruthTables.tsx    # Truth table displays
│   └── Documentation.tsx  # In-app docs
├── services/
│   └── adderCore.ts       # Core logic functions
├── App.tsx                # Main application
├── types.ts               # TypeScript definitions
└── index.tsx              # Entry point
```

## Concepts Covered

- **Binary Addition** - How computers add numbers at the bit level
- **Logic Gates** - AND, OR, XOR gate operations
- **Half Adder** - Sum = A XOR B, Carry = A AND B
- **Full Adder** - Handles carry-in for cascading
- **Ripple Carry Adder** - Chaining full adders for multi-bit addition

## License

MIT License - Feel free to use for educational purposes.

---

<div align="center">

**Made for Computer Architecture Course**

</div>

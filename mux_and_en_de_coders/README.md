# Digital Logic Circuit Simulator

An interactive visualizer for fundamental digital logic circuits used in Computer Architecture.

## Features

- **Multiplexers (MUX):** 2x1, 4x1, and 8x1 multiplexer simulations
- **Demultiplexers (DEMUX):** 1x2, 1x4, and 1x8 demultiplexer simulations
- **Encoders:** 4-to-2 and 8-to-3 encoder implementations
- **Decoders:** 2-to-4 and 3-to-8 decoder with enable control
- **Adders:** Half Adder, Full Adder, and Ripple Carry Adder
- **ASCII Diagrams:** Visual circuit representations
- **Interactive Controls:** Toggle inputs and see real-time outputs

## Circuits Covered

| Circuit | Description |
|---------|-------------|
| Half Adder | Adds two 1-bit numbers, produces Sum and Carry |
| Full Adder | Adds two 1-bit numbers with carry-in |
| Ripple Carry Adder | 4-bit adder using cascaded full adders |
| MUX | Selects one input from multiple sources |
| DEMUX | Routes one input to multiple outputs |
| Encoder | Converts active input line to binary code |
| Decoder | Converts binary code to active output line |

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app:
   ```bash
   npm run dev
   ```

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS

import React from 'react';
import { BookOpen, Cpu, Share2 } from 'lucide-react';
import { HalfAdderTable, FullAdderTable } from './TruthTables';

const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-12">
      
      {/* Abstract */}
      <section>
        <header className="mb-6 border-b border-circuit-700 pb-4">
          <h1 className="text-4xl font-bold text-white mb-2">Project Documentation</h1>
          <p className="text-xl text-gray-400">Binary Adder Simulator & Visualizer</p>
        </header>
        <div className="prose prose-invert max-w-none text-gray-300">
          <p>
            This application is a software simulation of digital logic circuits used for binary addition. 
            It demonstrates the fundamental building blocks of an Arithmetic Logic Unit (ALU) found within CPUs.
            By visualizing the flow of bits and carries, it bridges the gap between abstract boolean algebra and physical computation.
          </p>
        </div>
      </section>

      {/* Half Adder */}
      <section className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl font-bold text-circuit-accent mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6" /> Half Adder
          </h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            The simplest binary adder. It takes two single binary digits (A and B) and produces a Sum and a Carry.
            However, it cannot handle a carry-in from a previous operation, limiting its use to the least significant bit (LSB) only.
          </p>
          <div className="bg-circuit-900 p-4 rounded-lg border border-circuit-700 font-mono text-sm">
            <div className="text-circuit-on">SUM = A XOR B</div>
            <div className="text-circuit-glow">CARRY = A AND B</div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Half Adder Truth Table</h3>
          <HalfAdderTable />
        </div>
      </section>

      <hr className="border-circuit-700" />

      {/* Full Adder */}
      <section className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
            <Share2 className="w-6 h-6" /> Full Adder
          </h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            A Full Adder overcomes the limitation of the Half Adder by accepting three inputs: A, B, and a Carry-In (Cin).
            This allows Full Adders to be chained together to add multi-bit numbers.
          </p>
          <div className="bg-circuit-900 p-4 rounded-lg border border-circuit-700 font-mono text-sm space-y-2">
            <div className="text-circuit-on">SUM = (A XOR B) XOR Cin</div>
            <div className="text-circuit-glow">COUT = (A AND B) OR (Cin AND (A XOR B))</div>
          </div>
        </div>
        <div>
           <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Full Adder Truth Table</h3>
           <FullAdderTable />
        </div>
      </section>

      <hr className="border-circuit-700" />

      {/* Ripple Carry */}
      <section>
         <h2 className="text-2xl font-bold text-purple-400 mb-4">N-Bit Ripple Carry Adder</h2>
         <div className="bg-circuit-800 rounded-xl p-6 border border-circuit-700">
           <p className="text-gray-300 mb-4">
             To add two N-bit numbers (e.g., 4-bit, 8-bit), we connect N Full Adders in a series.
           </p>
           <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
             <li>The <strong className="text-white">Carry Out</strong> of bit 0 flows into the <strong className="text-white">Carry In</strong> of bit 1.</li>
             <li>This propagation continues until the Most Significant Bit (MSB).</li>
             <li>This design is called a "Ripple Carry Adder" because the carry signal ripples through the circuit from right to left.</li>
           </ul>
           <div className="mt-6 p-4 bg-circuit-900 rounded border border-circuit-700 text-center text-sm font-mono text-gray-500">
              [FA3] ← carry ← [FA2] ← carry ← [FA1] ← carry ← [FA0]
           </div>
         </div>
      </section>

      {/* Applications */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-green-500" /> Real World Applications
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-circuit-800 p-5 rounded-lg border border-circuit-700">
            <h3 className="text-lg font-bold text-green-400 mb-2">ALU Architecture</h3>
            <p className="text-sm text-gray-400">
              The Arithmetic Logic Unit is the core of a CPU. Adders are the foundational circuit for all integer arithmetic (addition, subtraction via two's complement, multiplication).
            </p>
          </div>
          <div className="bg-circuit-800 p-5 rounded-lg border border-circuit-700">
            <h3 className="text-lg font-bold text-green-400 mb-2">Address Calculation</h3>
            <p className="text-sm text-gray-400">
              CPUs use adders constantly to calculate memory addresses (e.g., Base Pointer + Offset) when running programs.
            </p>
          </div>
          <div className="bg-circuit-800 p-5 rounded-lg border border-circuit-700">
            <h3 className="text-lg font-bold text-green-400 mb-2">DSP</h3>
            <p className="text-sm text-gray-400">
              Digital Signal Processors rely heavily on high-speed adders for audio and video processing algorithms.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Documentation;
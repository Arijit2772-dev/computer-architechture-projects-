import React, { useState } from 'react';
import { halfAdder } from '../services/adderCore';
import { Bit } from '../types';
import { HalfAdderTable } from './TruthTables';
import { Settings2, Lightbulb } from 'lucide-react';

const HalfAdder: React.FC = () => {
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);

  const result = halfAdder(a, b);

  const toggle = (val: Bit, setVal: (v: Bit) => void) => {
    setVal(val === 0 ? 1 : 0);
  };

  return (
    <div className="flex flex-col space-y-8 animate-fade-in">
      <header className="border-b border-circuit-700 pb-4">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-circuit-accent" />
          Half Adder Simulator
        </h2>
        <p className="text-gray-400 mt-2">
          Adds two single binary digits (A and B). It has two outputs: Sum (S) and Carry (C).
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simulator Area */}
        <div className="bg-circuit-800/50 rounded-xl p-8 border border-circuit-700 backdrop-blur-sm flex flex-col items-center justify-center space-y-10">
          
          <div className="flex gap-16">
            {/* Input A */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-400 font-mono text-sm uppercase tracking-wider">Input A</span>
              <button
                onClick={() => toggle(a, setA)}
                className={`w-16 h-16 rounded-xl text-3xl font-mono font-bold transition-all duration-300 shadow-lg ${
                  a === 1 
                    ? 'bg-circuit-accent text-white shadow-circuit-accent/50 scale-105' 
                    : 'bg-circuit-700 text-gray-500 hover:bg-circuit-600'
                }`}
              >
                {a}
              </button>
            </div>

            {/* Input B */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-400 font-mono text-sm uppercase tracking-wider">Input B</span>
              <button
                onClick={() => toggle(b, setB)}
                className={`w-16 h-16 rounded-xl text-3xl font-mono font-bold transition-all duration-300 shadow-lg ${
                  b === 1 
                    ? 'bg-circuit-accent text-white shadow-circuit-accent/50 scale-105' 
                    : 'bg-circuit-700 text-gray-500 hover:bg-circuit-600'
                }`}
              >
                {b}
              </button>
            </div>
          </div>

          {/* Logic Visualization SVG */}
          <div className="w-full max-w-sm relative h-32 opacity-70">
            <svg viewBox="0 0 300 100" className="w-full h-full stroke-gray-500 fill-none stroke-2">
               {/* Paths are simplified logic representations */}
               <path d="M 60 20 L 150 20" className={a ? 'stroke-circuit-accent' : ''} />
               <path d="M 60 80 L 150 80" className={b ? 'stroke-circuit-accent' : ''} />
               
               {/* Gates Box */}
               <rect x="120" y="10" width="60" height="80" rx="4" className="fill-circuit-900/80 stroke-circuit-600" />
               <text x="150" y="55" textAnchor="middle" className="fill-gray-400 text-xs font-sans stroke-none">LOGIC</text>
               
               <path d="M 180 35 L 240 35" className={result.sum ? 'stroke-circuit-on' : ''} />
               <path d="M 180 65 L 240 65" className={result.carry ? 'stroke-circuit-glow' : ''} />
            </svg>
          </div>

          <div className="flex gap-16">
            {/* Output Sum */}
            <div className="flex flex-col items-center gap-2">
              <div className={`p-4 rounded-full border-2 transition-all duration-500 ${
                result.sum 
                  ? 'border-circuit-on bg-circuit-on/20 shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                  : 'border-circuit-700 bg-transparent'
              }`}>
                <Lightbulb className={`w-8 h-8 ${result.sum ? 'text-circuit-on' : 'text-gray-700'}`} />
              </div>
              <span className="text-circuit-on font-mono font-bold text-xl">SUM: {result.sum}</span>
            </div>

            {/* Output Carry */}
            <div className="flex flex-col items-center gap-2">
              <div className={`p-4 rounded-full border-2 transition-all duration-500 ${
                result.carry
                  ? 'border-circuit-glow bg-circuit-glow/20 shadow-[0_0_20px_rgba(96,165,250,0.5)]' 
                  : 'border-circuit-700 bg-transparent'
              }`}>
                <Lightbulb className={`w-8 h-8 ${result.carry ? 'text-circuit-glow' : 'text-gray-700'}`} />
              </div>
              <span className="text-circuit-glow font-mono font-bold text-xl">CARRY: {result.carry}</span>
            </div>
          </div>

        </div>

        {/* Info Area */}
        <div className="space-y-6">
           <div className="bg-circuit-900 rounded-lg p-6 border border-circuit-700">
             <h3 className="text-lg font-semibold text-white mb-4">Truth Table</h3>
             <HalfAdderTable />
           </div>
           
           <div className="p-4 bg-circuit-800/50 rounded-lg border-l-4 border-circuit-accent">
             <h4 className="font-semibold text-white">Boolean Equations</h4>
             <ul className="mt-2 space-y-2 font-mono text-sm text-gray-300">
               <li>SUM   = A ⊕ B  (A XOR B)</li>
               <li>CARRY = A · B  (A AND B)</li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HalfAdder;
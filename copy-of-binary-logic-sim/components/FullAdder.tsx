import React, { useState } from 'react';
import { fullAdder } from '../services/adderCore';
import { Bit } from '../types';
import { FullAdderTable } from './TruthTables';
import { Zap, ArrowDown } from 'lucide-react';

const FullAdder: React.FC = () => {
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  const [cin, setCin] = useState<Bit>(0);

  const result = fullAdder(a, b, cin);

  const toggle = (val: Bit, setVal: (v: Bit) => void) => {
    setVal(val === 0 ? 1 : 0);
  };

  const Switch = ({ label, value, setter, colorClass }: any) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-gray-400 font-mono text-sm uppercase tracking-wider">{label}</span>
      <button
        onClick={() => toggle(value, setter)}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-xl text-3xl font-mono font-bold transition-all duration-300 shadow-lg ${
          value === 1 
            ? `${colorClass} text-white shadow-lg scale-105` 
            : 'bg-circuit-700 text-gray-500 hover:bg-circuit-600'
        }`}
      >
        {value}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col space-y-8 animate-fade-in">
      <header className="border-b border-circuit-700 pb-4">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500" />
          Full Adder Simulator
        </h2>
        <p className="text-gray-400 mt-2">
          Adds three inputs: A, B, and Carry-In (Cin). Essential for chaining adders together.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Simulator */}
        <div className="bg-circuit-800/50 rounded-xl p-6 md:p-8 border border-circuit-700 backdrop-blur-sm flex flex-col items-center relative overflow-hidden">
          
          {/* Circuit Trace Background Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <svg width="100%" height="100%">
               <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
               </pattern>
               <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="z-10 w-full flex flex-col items-center gap-8">
            
            <div className="flex justify-center gap-4">
               <Switch label="Cin (Carry In)" value={cin} setter={setCin} colorClass="bg-yellow-600 shadow-yellow-600/50" />
            </div>
            
            <ArrowDown className={`w-8 h-8 transition-colors duration-300 ${cin ? 'text-yellow-500' : 'text-circuit-700'}`} />

            <div className="flex justify-between w-full max-w-xs md:max-w-md bg-circuit-900/80 p-6 rounded-2xl border border-circuit-600 shadow-xl">
               <Switch label="Input A" value={a} setter={setA} colorClass="bg-circuit-accent shadow-circuit-accent/50" />
               <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-600">+</span>
               </div>
               <Switch label="Input B" value={b} setter={setB} colorClass="bg-circuit-accent shadow-circuit-accent/50" />
            </div>

            <ArrowDown className="w-8 h-8 text-gray-500" />

            {/* Results */}
            <div className="grid grid-cols-2 gap-8 w-full max-w-md">
              <div className={`p-4 rounded-xl border border-circuit-700 bg-circuit-900 flex flex-col items-center gap-2 transition-all ${result.sum ? 'shadow-[0_0_15px_rgba(16,185,129,0.3)] border-circuit-on' : ''}`}>
                 <span className="text-gray-400 text-xs uppercase">Sum</span>
                 <span className={`text-4xl font-mono font-bold ${result.sum ? 'text-circuit-on' : 'text-gray-600'}`}>
                   {result.sum}
                 </span>
              </div>
              <div className={`p-4 rounded-xl border border-circuit-700 bg-circuit-900 flex flex-col items-center gap-2 transition-all ${result.cout ? 'shadow-[0_0_15px_rgba(96,165,250,0.3)] border-circuit-glow' : ''}`}>
                 <span className="text-gray-400 text-xs uppercase">Carry Out</span>
                 <span className={`text-4xl font-mono font-bold ${result.cout ? 'text-circuit-glow' : 'text-gray-600'}`}>
                   {result.cout}
                 </span>
              </div>
            </div>

          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-6">
           <div className="bg-circuit-900 rounded-lg p-6 border border-circuit-700 overflow-x-auto">
             <h3 className="text-lg font-semibold text-white mb-4">Truth Table</h3>
             <FullAdderTable />
           </div>

           <div className="p-4 bg-circuit-800/50 rounded-lg border-l-4 border-yellow-600">
             <h4 className="font-semibold text-white">Logic Expressions</h4>
             <div className="mt-2 space-y-2 font-mono text-sm text-gray-300">
               <p>SUM = A ⊕ B ⊕ Cin</p>
               <p>Cout = (A · B) + (Cin · (A ⊕ B))</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default FullAdder;
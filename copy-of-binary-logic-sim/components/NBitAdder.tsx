import React, { useState, useEffect } from 'react';
import { nBitAdder, isValidBinary } from '../services/adderCore';
import { NBitResult, Bit } from '../types';
import { Layers, ArrowRight, Play, RotateCcw, AlertTriangle } from 'lucide-react';

const NBitAdder: React.FC = () => {
  const [inputA, setInputA] = useState('1011');
  const [inputB, setInputB] = useState('0110');
  const [result, setResult] = useState<NBitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculate on mount
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalculate = () => {
    setError(null);
    if (!isValidBinary(inputA) || !isValidBinary(inputB)) {
      setError('Inputs must contain only 0 and 1');
      setResult(null);
      return;
    }
    const res = nBitAdder(inputA, inputB);
    setResult(res);
  };

  const handleRandom = () => {
    const r = () => Math.floor(Math.random() * 16).toString(2).padStart(4, '0');
    setInputA(r());
    setInputB(r());
    setTimeout(handleCalculate, 0); // Defer to let state update
  };

  return (
    <div className="flex flex-col space-y-8 animate-fade-in pb-12">
      <header className="border-b border-circuit-700 pb-4">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Layers className="w-8 h-8 text-purple-500" />
          N-Bit Ripple Carry Adder
        </h2>
        <p className="text-gray-400 mt-2">
          Simulates adding two binary numbers of any length by chaining full adders.
        </p>
      </header>

      {/* Input Section */}
      <div className="bg-circuit-800 rounded-xl p-6 border border-circuit-700 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-2">
            <label className="text-sm font-mono text-gray-400 uppercase">Binary Number A</label>
            <input
              type="text"
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              className="w-full bg-circuit-900 border border-circuit-600 text-white font-mono text-xl p-3 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="e.g. 1011"
            />
          </div>
          
          <div className="md:col-span-1 flex justify-center pb-3">
            <span className="text-3xl text-gray-500 font-bold">+</span>
          </div>

          <div className="md:col-span-5 space-y-2">
            <label className="text-sm font-mono text-gray-400 uppercase">Binary Number B</label>
            <input
              type="text"
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              className="w-full bg-circuit-900 border border-circuit-600 text-white font-mono text-xl p-3 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="e.g. 0110"
            />
          </div>

          <div className="md:col-span-1 flex justify-center">
             <button onClick={handleCalculate} className="bg-purple-600 hover:bg-purple-500 p-3 rounded-lg text-white transition-colors shadow-lg">
               <ArrowRight />
             </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="mt-4 flex gap-3">
           <button onClick={handleRandom} className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
              <RotateCcw className="w-3 h-3" /> Random Values
           </button>
           <button onClick={() => handleCalculate()} className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors">
              <Play className="w-3 h-3" /> Recalculate
           </button>
        </div>
      </div>

      {result && (
        <div className="space-y-8">
          
          {/* Main Result Display */}
          <div className="bg-gradient-to-r from-circuit-900 to-circuit-800 border border-circuit-700 p-8 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-gray-400 uppercase tracking-widest text-sm mb-2">Final Sum</span>
            <div className="font-mono text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-widest break-all">
              {result.binarySum}
            </div>
            <div className="mt-4 text-gray-500 font-mono text-sm">
               Decimal: {parseInt(result.binarySum, 2)}
            </div>
          </div>

          {/* Visualization Grid */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" /> Step-by-Step Visualization
            </h3>
            
            <div className="overflow-x-auto pb-4">
              <div className="inline-flex flex-col gap-1 min-w-full">
                
                {/* Headers */}
                <div className="flex gap-2 mb-2 pl-24">
                   <div className="flex flex-row-reverse gap-2">
                     {result.steps.map((step) => (
                       <div key={step.index} className="w-12 text-center text-xs text-gray-500 font-mono">
                         Bit {step.index}
                       </div>
                     ))}
                   </div>
                </div>

                {/* Carry Row */}
                <div className="flex items-center gap-4 h-12">
                   <span className="w-20 text-right text-yellow-500 font-bold font-mono">Carry In</span>
                   <div className="flex flex-row-reverse gap-2">
                     {result.steps.map((step) => (
                       <div key={step.index} className={`w-12 h-10 rounded flex items-center justify-center border ${step.cin ? 'border-yellow-600 bg-yellow-900/20 text-yellow-500' : 'border-circuit-700 text-gray-700'}`}>
                         {step.cin}
                       </div>
                     ))}
                   </div>
                </div>

                {/* Input A Row */}
                <div className="flex items-center gap-4 h-12">
                   <span className="w-20 text-right text-gray-400 font-mono">Input A</span>
                   <div className="flex flex-row-reverse gap-2">
                     {result.steps.map((step) => (
                       <div key={step.index} className={`w-12 h-10 rounded flex items-center justify-center border ${step.a ? 'border-circuit-600 bg-circuit-700 text-white' : 'border-circuit-800 bg-circuit-900 text-gray-600'}`}>
                         {step.a}
                       </div>
                     ))}
                   </div>
                </div>

                {/* Input B Row */}
                <div className="flex items-center gap-4 h-12 border-b border-gray-700 pb-2 mb-2">
                   <span className="w-20 text-right text-gray-400 font-mono">Input B</span>
                   <div className="flex flex-row-reverse gap-2">
                     {result.steps.map((step) => (
                       <div key={step.index} className={`w-12 h-10 rounded flex items-center justify-center border ${step.b ? 'border-circuit-600 bg-circuit-700 text-white' : 'border-circuit-800 bg-circuit-900 text-gray-600'}`}>
                         {step.b}
                       </div>
                     ))}
                   </div>
                </div>

                {/* Sum Row */}
                <div className="flex items-center gap-4 h-12">
                   <span className="w-20 text-right text-circuit-on font-bold font-mono">SUM</span>
                   <div className="flex flex-row-reverse gap-2">
                     {result.steps.map((step) => (
                       <div key={step.index} className={`w-12 h-12 rounded flex items-center justify-center font-bold text-xl border ${step.sum ? 'border-circuit-on bg-circuit-on/10 text-circuit-on shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-circuit-700 bg-circuit-800 text-gray-600'}`}>
                         {step.sum}
                       </div>
                     ))}
                   </div>
                   {result.overflow && (
                      <div className="ml-4 px-3 py-1 bg-circuit-glow/20 text-circuit-glow text-xs rounded border border-circuit-glow">
                        Overflow Carry: 1
                      </div>
                   )}
                </div>

              </div>
            </div>
            
            <p className="text-gray-400 text-sm italic mt-4">
              * The calculation proceeds from right (Least Significant Bit) to left (Most Significant Bit). The "Carry Out" of one column becomes the "Carry In" of the next.
            </p>

          </div>
        </div>
      )}
    </div>
  );
};

export default NBitAdder;
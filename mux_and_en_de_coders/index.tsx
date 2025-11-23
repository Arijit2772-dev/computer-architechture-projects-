
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Terminal, Cpu, ArrowRightLeft, GitMerge, Grid, List, Calculator } from 'lucide-react';

// --- LOGIC CORE ---

const Logic = {
  halfAdder: (a: number, b: number) => ({
    sum: a ^ b,
    carry: a & b
  }),
  fullAdder: (a: number, b: number, cin: number) => {
    const sum = a ^ b ^ cin;
    const carry = (a & b) | (cin & (a ^ b));
    return { sum, carry };
  },
  mux: (inputs: number[], selects: number[]) => {
    let selectedIndex = 0;
    selects.forEach((bit, i) => {
      if (bit) selectedIndex |= (1 << i);
    });
    return inputs[selectedIndex] || 0;
  },
  demux: (input: number, selects: number[], numOutputs: number) => {
    let selectedIndex = 0;
    selects.forEach((bit, i) => {
      if (bit) selectedIndex |= (1 << i);
    });
    const outputs = new Array(numOutputs).fill(0);
    outputs[selectedIndex] = input;
    return outputs;
  },
  decoder: (inputs: number[], enable: number) => {
    if (!enable) return new Array(1 << inputs.length).fill(0);
    let selectedIndex = 0;
    inputs.forEach((bit, i) => {
      if (bit) selectedIndex |= (1 << i);
    });
    const outputs = new Array(1 << inputs.length).fill(0);
    outputs[selectedIndex] = 1;
    return outputs;
  },
  encoder4to2: (inputs: number[]) => {
    const [y0, y1, y2, y3] = inputs;
    return {
      a1: y3 | y2,
      a0: y3 | y1
    };
  },
  encoder8to3: (inputs: number[]) => {
    const a2 = inputs[4] | inputs[5] | inputs[6] | inputs[7];
    const a1 = inputs[2] | inputs[3] | inputs[6] | inputs[7];
    const a0 = inputs[1] | inputs[3] | inputs[5] | inputs[7];
    return { a2, a1, a0 };
  }
};

// --- ASCII DIAGRAMS ---

const ASCII: Record<string, string> = {
  HA: `
   A ----+----------->[ XOR ]---- Sum
         |
   B ----+-----+----->[ AND ]---- Carry
  `,
  FA: `
           +-------+
     A --->| Half  |---+------->[ XOR ]---- Sum
     B --->| Adder |   |          ^
           +-------+   +->[OR]    |
                         ^   |    Cin
     Cin ----------------+---+----[AND]-+-> CarryOut
  `,
  RCA: `
         C4      C3      C2      C1      C0
      <--+   +---|   +---|   +---|   +---| <-- Cin
         |   |   |   |   |   |   |   |   |
        [FA3]   [FA2]   [FA1]   [FA0]
         | |     | |     | |     | |
        S3      S2      S1      S0
  `,
  MUX2: `
         +-----------+
    I0 --|           |
    I1 --|  2x1 MUX  |---- Y
         |           |
         +-----------+
               |
               S0
  `,
  MUX4: `
         +-----------+
    I0 --|           |
    I1 --|           |
    I2 --|  4x1 MUX  |---- Y
    I3 --|           |
         +-----------+
            |     |
           S1    S0
  `,
  MUX8: `
         +-----------+
    I0 --|           |
    .. --|  8x1 MUX  |---- Y
    I7 --|           |
         +-----------+
           |  |  |
          S2 S1 S0
  `,
  MUX16: `
          +------------+
     I0 --|            |
     .. --|  16x1 MUX  |---- Y
    I15 --|            |
          +------------+
           |  |  |  |
          S3 S2 S1 S0
  `,
  DEMUX2: `
               +-----------+-- Y0
    Input A ---| 1x2 DEMUX |-- Y1
               +-----------+
                    |
                   S0
  `,
  DEMUX4: `
               +-----------+-- Y0
               |           |-- Y1
    Input A ---| 1x4 DEMUX |-- Y2
               |           |-- Y3
               +-----------+
                  |     |
                 S1    S0
  `,
  DEMUX8: `
               +-----------+-- Y0
    Input A ---| 1x8 DEMUX |..
               |           |-- Y7
               +-----------+
                 |  |  |
                S2 S1 S0
  `,
  DEMUX16: `
               +------------+-- Y0
    Input A ---| 1x16 DEMUX |..
               |            |-- Y15
               +------------+
                |  |  |  |
               S3 S2 S1 S0
  `,
  DEC2to4: `
         +-----------+--- Y0
    A0 --|           |--- Y1
    A1 --|  2-to-4   |--- Y2
    E  --|  DECODER  |--- Y3
         +-----------+
  `,
  DEC3to8: `
         +-----------+--- Y0
    A0 --|           |...
    A1 --|  3-to-8   |...
    A2 --|  DECODER  |--- Y7
    E  --|           |
         +-----------+
  `,
  DEC4to16: `
         +-----------+--- Y0
    A0 --|           |...
    .. --|  4-to-16  |...
    A3 --|  DECODER  |--- Y15
    E  --|           |
         +-----------+
  `,
  ENC4to2: `
    Y0 --+
    Y1 --|-----------+--[ OR ]--- A0
    Y2 --|--+--[ OR ]------------ A1
    Y3 --+--+
  `,
  ENC8to3: `
    Y0 --+
    ..   |-------+----[ OR ]----- A0
    ..   |---+---|----[ OR ]----- A1
    Y7 --+---+---|----[ OR ]----- A2
  `
};

// --- COMPONENTS ---

const BitBtn = ({ val, onChange, label, vertical = false }: { val: number, onChange: () => void, label: string, vertical?: boolean }) => (
  <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-2`}>
    <span className="text-gray-400 font-bold text-sm">{label}</span>
    <button 
      onClick={onChange}
      className={`w-12 h-12 rounded border-2 font-mono text-xl transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]
        ${val === 1 
          ? 'bg-green-900 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
          : 'bg-slate-800 border-slate-600 text-slate-500 hover:border-slate-400'
        }`}
    >
      {val}
    </button>
  </div>
);

const OutputDisplay = ({ val, label }: { val: number | string, label: string }) => (
  <div className="flex flex-col items-center p-3 bg-slate-800 rounded border border-slate-700 min-w-[80px]">
    <span className="text-xs text-gray-400 mb-1">{label}</span>
    <span className={`text-2xl font-mono font-bold ${val === 1 || val === '1' ? 'text-green-400' : 'text-slate-500'}`}>
      {val}
    </span>
  </div>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 mb-6">
    <h3 className="text-xl text-green-500 font-bold mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
      <Terminal size={20} />
      {title}
    </h3>
    {children}
  </div>
);

const AsciiBox = ({ art }: { art: string }) => (
  <div className="bg-black p-4 rounded border border-slate-700 overflow-x-auto mb-6 shadow-inner">
    <pre className="text-xs md:text-sm text-green-500/80 font-mono leading-tight">{art}</pre>
  </div>
);

// --- VIEWS ---

const HalfAdderView = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const { sum, carry } = Logic.halfAdder(a, b);

  return (
    <div>
      <AsciiBox art={ASCII.HA} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-bold text-blue-400">Inputs</h4>
          <div className="flex gap-4">
            <BitBtn val={a} onChange={() => setA(1-a)} label="A" vertical />
            <BitBtn val={b} onChange={() => setB(1-b)} label="B" vertical />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-bold text-purple-400">Outputs</h4>
          <div className="flex gap-4">
            <OutputDisplay val={sum} label="SUM (S)" />
            <OutputDisplay val={carry} label="CARRY (C)" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h4 className="text-gray-400 mb-2 text-sm">TRUTH TABLE</h4>
        <table className="w-full text-sm text-left text-gray-400 font-mono border border-slate-700">
          <thead className="bg-slate-800 text-gray-200">
            <tr><th className="p-2">A</th><th className="p-2">B</th><th className="p-2 text-green-400">Sum</th><th className="p-2 text-green-400">Carry</th></tr>
          </thead>
          <tbody>
            {[ [0,0], [0,1], [1,0], [1,1] ].map(([ta, tb], i) => {
               const r = Logic.halfAdder(ta, tb);
               const isActive = ta === a && tb === b;
               return (
                 <tr key={i} className={isActive ? 'bg-slate-800/80 text-white font-bold' : 'border-t border-slate-800'}>
                   <td className="p-2">{ta}</td><td className="p-2">{tb}</td><td className="p-2">{r.sum}</td><td className="p-2">{r.carry}</td>
                 </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FullAdderView = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [cin, setCin] = useState(0);
  const { sum, carry } = Logic.fullAdder(a, b, cin);

  return (
    <div>
      <AsciiBox art={ASCII.FA} />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-bold text-blue-400">Inputs</h4>
          <div className="flex gap-4">
            <BitBtn val={a} onChange={() => setA(1-a)} label="A" vertical />
            <BitBtn val={b} onChange={() => setB(1-b)} label="B" vertical />
            <BitBtn val={cin} onChange={() => setCin(1-cin)} label="Cin" vertical />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-lg font-bold text-purple-400">Outputs</h4>
          <div className="flex gap-4">
            <OutputDisplay val={sum} label="SUM" />
            <OutputDisplay val={carry} label="Cout" />
          </div>
        </div>
      </div>
    </div>
  );
};

const RippleAdderView = () => {
  const [valA, setValA] = useState("1011");
  const [valB, setValB] = useState("0110");

  // Logic
  const len = Math.max(valA.length, valB.length);
  const binA = valA.padStart(len, '0');
  const binB = valB.padStart(len, '0');
  
  let carry = 0;
  const steps = [];
  let result = "";

  for (let i = len - 1; i >= 0; i--) {
    const bitA = parseInt(binA[i]) || 0;
    const bitB = parseInt(binB[i]) || 0;
    const r = Logic.fullAdder(bitA, bitB, carry);
    steps.unshift({ bitA, bitB, cin: carry, sum: r.sum, cout: r.carry, idx: i });
    result = r.sum + result;
    carry = r.carry;
  }
  const finalCout = carry;

  return (
    <div>
      <AsciiBox art={ASCII.RCA} />
      <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded text-yellow-200 text-sm">
        ℹ️ The Ripple Carry Adder chains Full Adders. The Carry-Out of bit <i>i</i> becomes Carry-In for bit <i>i+1</i>.
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
           <label className="block text-gray-400 mb-2 font-bold">Binary A</label>
           <input type="text" value={valA} onChange={e => /^[01]*$/.test(e.target.value) && setValA(e.target.value)} 
             className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-green-400 font-mono text-xl tracking-widest focus:outline-none focus:border-green-500" />
        </div>
        <div>
           <label className="block text-gray-400 mb-2 font-bold">Binary B</label>
           <input type="text" value={valB} onChange={e => /^[01]*$/.test(e.target.value) && setValB(e.target.value)} 
             className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-green-400 font-mono text-xl tracking-widest focus:outline-none focus:border-green-500" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center font-mono text-sm border-separate border-spacing-1">
          <thead>
            <tr className="text-gray-500">
              <th>Bit Index</th>
              {steps.map(s => <th key={s.idx} className="bg-slate-800 p-2 rounded w-12">{len - 1 - s.idx}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-right pr-4 font-bold text-blue-400">Carry In</td>
              {steps.map(s => <td key={s.idx} className="bg-slate-800/50 p-2 text-gray-400">{s.cin}</td>)}
            </tr>
            <tr>
              <td className="text-right pr-4 font-bold text-white">A</td>
              {steps.map(s => <td key={s.idx} className="bg-slate-800 p-2 text-white">{s.bitA}</td>)}
            </tr>
            <tr>
              <td className="text-right pr-4 font-bold text-white">B</td>
              {steps.map(s => <td key={s.idx} className="bg-slate-800 p-2 text-white">{s.bitB}</td>)}
            </tr>
            <tr className="h-4"></tr>
            <tr>
              <td className="text-right pr-4 font-bold text-green-400">SUM</td>
              {steps.map(s => <td key={s.idx} className="bg-green-900/30 border border-green-800 p-2 text-green-400 font-bold">{s.sum}</td>)}
            </tr>
             <tr>
              <td className="text-right pr-4 font-bold text-purple-400">Carry Out</td>
              {steps.map(s => <td key={s.idx} className="bg-purple-900/20 p-2 text-purple-300">{s.cout}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-4 bg-slate-800 p-4 rounded border border-slate-700">
        <span className="text-gray-400">Final Result:</span>
        <span className="text-3xl font-mono text-green-400 tracking-widest">
           {finalCout === 1 && <span className="text-purple-400">1</span>}
           {result}
        </span>
        <span className="text-xs text-gray-500 ml-auto">(Includes Overflow Carry)</span>
      </div>
    </div>
  );
};

const MuxView = () => {
  const [size, setSize] = useState(4); // 2, 4, 8, 16
  const numSelects = Math.log2(size);
  const [inputs, setInputs] = useState<number[]>(new Array(16).fill(0));
  const [selects, setSelects] = useState<number[]>(new Array(4).fill(0));

  useEffect(() => {
    setInputs(new Array(16).fill(0));
    setSelects(new Array(4).fill(0));
  }, [size]);

  const activeSelects = selects.slice(0, numSelects);
  const result = Logic.mux(inputs, activeSelects);
  
  let selectedIndex = 0;
  activeSelects.forEach((bit, i) => { if (bit) selectedIndex |= (1 << i); });

  const artKey = `MUX${size}`;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {[2, 4, 8, 16].map(s => (
          <button key={s} onClick={() => setSize(s)} 
            className={`px-4 py-2 rounded font-mono text-sm border ${size === s ? 'bg-blue-900 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>
            {s}x1
          </button>
        ))}
      </div>

      <AsciiBox art={ASCII[artKey] || "Diagram not found"} />

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-blue-400 mb-4">Data Inputs (I)</h4>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({length: size}).map((_, i) => (
               <div key={i} className={`flex flex-col items-center p-2 rounded border ${i === selectedIndex ? 'bg-blue-900/30 border-blue-500' : 'bg-slate-800 border-slate-700'}`}>
                 <span className="text-xs text-gray-500 mb-1">I{i}</span>
                 <BitBtn val={inputs[i]} onChange={() => {
                   const n = [...inputs]; n[i] = 1-n[i]; setInputs(n);
                 }} label="" />
               </div>
            ))}
          </div>
        </div>

        <div className="w-px bg-slate-700 hidden md:block"></div>

        <div className="flex flex-col gap-6">
          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">Select Lines (S)</h4>
            <div className="flex flex-row-reverse gap-4 justify-end">
               {Array.from({length: numSelects}).map((_, i) => (
                 <BitBtn key={i} val={selects[i]} onChange={() => {
                    const n = [...selects]; n[i] = 1-n[i]; setSelects(n);
                 }} label={`S${i}`} vertical />
               ))}
            </div>
            <div className="mt-2 text-xs text-gray-500 text-right">Selecting Index: {selectedIndex}</div>
          </div>
          
          <div className="mt-auto">
             <h4 className="text-lg font-bold text-purple-400 mb-2">Output (Y)</h4>
             <OutputDisplay val={result} label={`Y = I${selectedIndex}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DemuxView = () => {
  const [size, setSize] = useState(4); // 2, 4, 8, 16
  const numSelects = Math.log2(size);
  const [inputVal, setInputVal] = useState(0);
  const [selects, setSelects] = useState<number[]>(new Array(4).fill(0));

  const activeSelects = selects.slice(0, numSelects);
  const outputs = Logic.demux(inputVal, activeSelects, size);
  
  let selectedIndex = 0;
  activeSelects.forEach((bit, i) => { if (bit) selectedIndex |= (1 << i); });

  const artKey = `DEMUX${size}`;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {[2, 4, 8, 16].map(s => (
          <button key={s} onClick={() => setSize(s)} 
            className={`px-4 py-2 rounded font-mono text-sm border ${size === s ? 'bg-blue-900 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>
            1x{s}
          </button>
        ))}
      </div>

      <AsciiBox art={ASCII[artKey] || "Diagram not found"} />

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex flex-col gap-8">
           <div>
              <h4 className="text-lg font-bold text-blue-400 mb-4">Data Input (D)</h4>
              <BitBtn val={inputVal} onChange={() => setInputVal(1-inputVal)} label="IN" vertical />
           </div>
           
           <div>
              <h4 className="text-lg font-bold text-yellow-400 mb-4">Select Lines (S)</h4>
              <div className="flex flex-row-reverse gap-4">
                {Array.from({length: numSelects}).map((_, i) => (
                   <BitBtn key={i} val={selects[i]} onChange={() => {
                      const n = [...selects]; n[i] = 1-n[i]; setSelects(n);
                   }} label={`S${i}`} vertical />
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500 text-right">Targeting Index: {selectedIndex}</div>
           </div>
        </div>

        <div className="flex-1 w-full">
           <h4 className="text-lg font-bold text-purple-400 mb-4">Outputs (Y)</h4>
           <div className="grid grid-cols-4 gap-4">
              {outputs.map((val, i) => (
                <div key={i} className={`p-3 rounded border text-center transition-all ${i === selectedIndex ? 'bg-purple-900/40 border-purple-500 scale-105 shadow-lg' : 'bg-slate-800 border-slate-700 opacity-60'}`}>
                   <div className="text-xs text-gray-400 mb-1">Y{i}</div>
                   <div className={`text-2xl font-bold font-mono ${val ? 'text-green-400' : 'text-gray-600'}`}>{val}</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const DecoderView = () => {
  const [size, setSize] = useState(2); // 2 inputs -> 4 outputs
  const [enable, setEnable] = useState(1);
  const [inputs, setInputs] = useState([0,0,0,0]);
  
  const numOutputs = 1 << size;
  const activeInputs = inputs.slice(0, size);
  const outputs = Logic.decoder(activeInputs, enable);

  let selectedIndex = 0;
  activeInputs.forEach((bit, i) => { if (bit) selectedIndex |= (1 << i); });

  const artKey = `DEC${size}to${numOutputs}`;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setSize(2)} className={`px-4 py-2 rounded font-mono text-sm border ${size === 2 ? 'bg-blue-900 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>2-to-4</button>
        <button onClick={() => setSize(3)} className={`px-4 py-2 rounded font-mono text-sm border ${size === 3 ? 'bg-blue-900 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>3-to-8</button>
        <button onClick={() => setSize(4)} className={`px-4 py-2 rounded font-mono text-sm border ${size === 4 ? 'bg-blue-900 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>4-to-16</button>
      </div>

      <AsciiBox art={ASCII[artKey] || "Diagram not found"} />

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex flex-col gap-6">
          <div>
            <h4 className="text-lg font-bold text-red-400 mb-2">Enable (E)</h4>
            <BitBtn val={enable} onChange={() => setEnable(1-enable)} label="EN" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-blue-400 mb-4">Address Inputs (A)</h4>
            <div className="flex flex-row-reverse gap-4">
              {Array.from({length: size}).map((_, i) => (
                <BitBtn key={i} val={inputs[i]} onChange={() => {
                   const n = [...inputs]; n[i] = 1-n[i]; setInputs(n);
                }} label={`A${i}`} vertical />
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">Decoding: {selectedIndex}</div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-lg font-bold text-purple-400 mb-4">Outputs (Y)</h4>
          <div className="grid grid-cols-4 gap-2">
            {outputs.map((val, i) => (
              <div key={i} className={`p-2 rounded border text-center ${val ? 'bg-green-900/40 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
                <div className="text-xs text-gray-400">Y{i}</div>
                <div className={`text-xl font-bold font-mono ${val ? 'text-green-400' : 'text-gray-600'}`}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EncoderView = () => {
  const [mode, setMode] = useState<'4to2' | '8to3'>('4to2');
  const size = mode === '4to2' ? 4 : 8;
  const [inputs, setInputs] = useState(new Array(8).fill(0));
  
  const handleInputClick = (idx: number) => {
    const newInputs = new Array(8).fill(0);
    newInputs[idx] = 1;
    setInputs(newInputs);
  };

  const outputs = mode === '4to2' 
     ? Logic.encoder4to2(inputs)
     : Logic.encoder8to3(inputs);
  
  const artKey = `ENC${mode}`;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => { setMode('4to2'); setInputs(new Array(8).fill(0)); }} className={`px-4 py-2 rounded font-mono text-sm border ${mode === '4to2' ? 'bg-blue-900 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>4-to-2</button>
        <button onClick={() => { setMode('8to3'); setInputs(new Array(8).fill(0)); }} className={`px-4 py-2 rounded font-mono text-sm border ${mode === '8to3' ? 'bg-blue-900 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-gray-400'}`}>8-to-3</button>
      </div>

      <AsciiBox art={ASCII[artKey] || "Diagram not found"} />

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h4 className="text-lg font-bold text-blue-400 mb-4">Inputs (Y) <span className="text-xs font-normal text-gray-500">(One Active)</span></h4>
          <div className="grid grid-cols-2 gap-3">
             {Array.from({length: size}).map((_, i) => (
               <button key={i} onClick={() => handleInputClick(i)} 
                 className={`flex items-center justify-between p-3 rounded border transition-all
                   ${inputs[i] ? 'bg-blue-900 border-blue-500 text-blue-200' : 'bg-slate-800 border-slate-700 text-gray-500 hover:bg-slate-750'}
                 `}>
                 <span>Line Y{i}</span>
                 <div className={`w-3 h-3 rounded-full ${inputs[i] ? 'bg-blue-400 shadow-[0_0_8px_blue]' : 'bg-slate-600'}`}></div>
               </button>
             ))}
          </div>
        </div>

        <div>
           <h4 className="text-lg font-bold text-purple-400 mb-4">Encoded Output (A)</h4>
           <div className="flex gap-4">
             {mode === '4to2' ? (
                <>
                  <OutputDisplay val={outputs.a1} label="A1" />
                  <OutputDisplay val={outputs.a0} label="A0" />
                </>
             ) : (
                <>
                   {/* @ts-ignore for shortcut */}
                  <OutputDisplay val={outputs.a2} label="A2" />
                  <OutputDisplay val={outputs.a1} label="A1" />
                  <OutputDisplay val={outputs.a0} label="A0" />
                </>
             )}
           </div>
           <div className="mt-8 p-4 bg-slate-900 rounded border border-slate-800 text-gray-400 text-sm font-mono">
             Decimal Value: {inputs.findIndex(x => x === 1) === -1 ? 0 : inputs.findIndex(x => x === 1)}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- APP SHELL ---

const App = () => {
  const [view, setView] = useState('HA');

  const renderView = () => {
    switch(view) {
      case 'HA': return <Section title="Half Adder"><HalfAdderView /></Section>;
      case 'FA': return <Section title="Full Adder"><FullAdderView /></Section>;
      case 'RCA': return <Section title="N-Bit Ripple Carry Adder"><RippleAdderView /></Section>;
      case 'MUX': return <Section title="Multiplexer"><MuxView /></Section>;
      case 'DEMUX': return <Section title="Demultiplexer"><DemuxView /></Section>;
      case 'DEC': return <Section title="Decoder"><DecoderView /></Section>;
      case 'ENC': return <Section title="Encoder"><EncoderView /></Section>;
      default: return <HalfAdderView />;
    }
  };

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setView(id)}
      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-l-4
        ${view === id 
          ? 'bg-slate-800 border-green-500 text-green-400' 
          : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
      `}
    >
      <Icon size={18} />
      <span className="font-mono text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
           <h1 className="text-xl font-bold text-green-500 font-mono flex items-center gap-2">
             <Cpu /> LOGISIM
           </h1>
           <p className="text-xs text-slate-500 mt-1">Digital Logic Suite</p>
        </div>
        <nav className="py-4">
          <div className="px-4 pb-2 text-xs font-bold text-slate-600 uppercase tracking-wider">Arithmetic</div>
          <NavItem id="HA" label="Half Adder" icon={Calculator} />
          <NavItem id="FA" label="Full Adder" icon={Calculator} />
          <NavItem id="RCA" label="Ripple Carry" icon={List} />
          
          <div className="px-4 pb-2 mt-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Data Flow</div>
          <NavItem id="MUX" label="Multiplexer" icon={GitMerge} />
          <NavItem id="DEMUX" label="Demultiplexer" icon={GitMerge} />
          
          <div className="px-4 pb-2 mt-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Converters</div>
          <NavItem id="DEC" label="Decoder" icon={Grid} />
          <NavItem id="ENC" label="Encoder" icon={ArrowRightLeft} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
           {renderView()}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

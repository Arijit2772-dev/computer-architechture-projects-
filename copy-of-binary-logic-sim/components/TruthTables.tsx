import React from 'react';

export const HalfAdderTable = () => (
  <div className="overflow-hidden rounded-lg border border-circuit-700 bg-circuit-800 shadow-md">
    <table className="w-full text-left text-sm text-gray-300">
      <thead className="bg-circuit-900 uppercase text-gray-400">
        <tr>
          <th className="px-6 py-3">A</th>
          <th className="px-6 py-3">B</th>
          <th className="px-6 py-3 text-circuit-on font-bold">Sum (S)</th>
          <th className="px-6 py-3 text-circuit-glow font-bold">Carry (C)</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-circuit-700">
        <tr className="hover:bg-circuit-700/50">
          <td className="px-6 py-3 font-mono">0</td>
          <td className="px-6 py-3 font-mono">0</td>
          <td className="px-6 py-3 font-mono text-circuit-on">0</td>
          <td className="px-6 py-3 font-mono text-circuit-glow">0</td>
        </tr>
        <tr className="hover:bg-circuit-700/50">
          <td className="px-6 py-3 font-mono">0</td>
          <td className="px-6 py-3 font-mono">1</td>
          <td className="px-6 py-3 font-mono text-circuit-on">1</td>
          <td className="px-6 py-3 font-mono text-circuit-glow">0</td>
        </tr>
        <tr className="hover:bg-circuit-700/50">
          <td className="px-6 py-3 font-mono">1</td>
          <td className="px-6 py-3 font-mono">0</td>
          <td className="px-6 py-3 font-mono text-circuit-on">1</td>
          <td className="px-6 py-3 font-mono text-circuit-glow">0</td>
        </tr>
        <tr className="hover:bg-circuit-700/50">
          <td className="px-6 py-3 font-mono">1</td>
          <td className="px-6 py-3 font-mono">1</td>
          <td className="px-6 py-3 font-mono text-circuit-on">0</td>
          <td className="px-6 py-3 font-mono text-circuit-glow">1</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const FullAdderTable = () => (
  <div className="overflow-hidden rounded-lg border border-circuit-700 bg-circuit-800 shadow-md">
    <table className="w-full text-left text-sm text-gray-300">
      <thead className="bg-circuit-900 uppercase text-gray-400">
        <tr>
          <th className="px-4 py-3">Cin</th>
          <th className="px-4 py-3">A</th>
          <th className="px-4 py-3">B</th>
          <th className="px-4 py-3 text-circuit-on font-bold">Sum</th>
          <th className="px-4 py-3 text-circuit-glow font-bold">Cout</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-circuit-700">
        {[
          [0,0,0,0,0],
          [0,0,1,1,0],
          [0,1,0,1,0],
          [0,1,1,0,1],
          [1,0,0,1,0],
          [1,0,1,0,1],
          [1,1,0,0,1],
          [1,1,1,1,1],
        ].map((row, idx) => (
          <tr key={idx} className="hover:bg-circuit-700/50">
            <td className="px-4 py-3 font-mono">{row[0]}</td>
            <td className="px-4 py-3 font-mono">{row[1]}</td>
            <td className="px-4 py-3 font-mono">{row[2]}</td>
            <td className="px-4 py-3 font-mono text-circuit-on">{row[3]}</td>
            <td className="px-4 py-3 font-mono text-circuit-glow">{row[4]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
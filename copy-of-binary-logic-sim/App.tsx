import React, { useState } from 'react';
import { ViewState } from './types';
import HalfAdder from './components/HalfAdder';
import FullAdder from './components/FullAdder';
import NBitAdder from './components/NBitAdder';
import Documentation from './components/Documentation';
import { Cpu, Settings2, Zap, Layers, BookOpen, Menu, X } from 'lucide-react';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.HALF_ADDER);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ label, targetView, icon: Icon }: any) => (
    <button
      onClick={() => {
        setView(targetView);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        view === targetView 
          ? 'bg-circuit-700 text-white shadow-lg border-l-4 border-circuit-accent' 
          : 'text-gray-400 hover:bg-circuit-800 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${view === targetView ? 'text-circuit-accent' : ''}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-circuit-900 text-gray-200 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-circuit-800 border-b border-circuit-700 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <Cpu className="text-circuit-accent" />
          <span>BinSim</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300">
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-circuit-900 border-r border-circuit-800 z-40 transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:flex items-center gap-3 border-b border-circuit-800">
            <div className="p-2 bg-circuit-800 rounded-lg border border-circuit-700">
               <Cpu className="w-6 h-6 text-circuit-accent" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-none">BinSim</h1>
              <span className="text-xs text-circuit-off uppercase tracking-wider">Logic Lab</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4 px-4">Modules</div>
            <NavItem label="Half Adder" targetView={ViewState.HALF_ADDER} icon={Settings2} />
            <NavItem label="Full Adder" targetView={ViewState.FULL_ADDER} icon={Zap} />
            <NavItem label="N-Bit Adder" targetView={ViewState.N_BIT_ADDER} icon={Layers} />
            
            <div className="my-6 border-t border-circuit-800"></div>
            
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-4 px-4">Reference</div>
            <NavItem label="Documentation" targetView={ViewState.DOCS} icon={BookOpen} />
          </nav>
          
          <div className="p-4 border-t border-circuit-800 text-center">
            <p className="text-xs text-gray-600">v1.0.0 • React Simulation</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen relative">
        <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12">
          {view === ViewState.HALF_ADDER && <HalfAdder />}
          {view === ViewState.FULL_ADDER && <FullAdder />}
          {view === ViewState.N_BIT_ADDER && <NBitAdder />}
          {view === ViewState.DOCS && <Documentation />}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
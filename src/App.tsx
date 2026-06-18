import React, { useState } from 'react';
import { AppProvider } from './AppContext';
import { Dashboard } from './components/Dashboard';
import { Calculator } from './components/Calculator';
import { AICoach } from './components/AICoach';
import { Simulator } from './components/Simulator';
import { ActionList } from './components/ActionList';
import { LayoutDashboard, Calculator as CalcIcon, Bot, Zap, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// utility to avoid importing from uninitialized shadcn lib directly if it fails
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'Footprint Calculator', icon: CalcIcon },
    { id: 'actions', label: 'AI Action Plan', icon: Zap },
    { id: 'coach', label: 'Eco Coach', icon: Bot },
    { id: 'simulator', label: 'Simulator', icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 font-sans select-none">
      {/* Sidebar */}
      <div className="w-64 bg-[#0d0d0e] border-r border-white/5 flex flex-col hidden md:flex">
         <div className="h-[88px] flex items-center px-6 border-b border-white/5 pb-4 pt-8 shrink-0">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] mr-4">
               <span className="text-black font-bold text-xl italic">E</span>
            </div>
            <div className="flex flex-col justify-center">
               <span className="font-serif italic text-emerald-400 tracking-tight text-2xl leading-none">EcoPulse AI</span>
               <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 leading-none">Dashboard</span>
            </div>
         </div>
         <nav className="flex-1 p-6 space-y-3">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200",
                  activeTab === item.id 
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.02)]" 
                    : "text-slate-500 hover:bg-white/[0.02] hover:text-slate-300 border border-transparent"
                )}
              >
                <item.icon className="w-5 h-5 focus:outline-none" />
                <span className="tracking-wide">{item.label}</span>
              </button>
            ))}
         </nav>
         <div className="p-6 border-t border-white/5 text-xs text-slate-500 flex justify-between items-center bg-[#0a0a0c]">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             <span className="uppercase tracking-widest text-[10px]">Online</span>
           </div>
           <span className="uppercase tracking-widest text-[10px]">v1.0</span>
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0A0A0B] p-6 md:p-8">
         <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3, ease: 'easeOut' }}
         >
           {activeTab === 'dashboard' && <Dashboard />}
           {activeTab === 'calculator' && <Calculator />}
           {activeTab === 'actions' && <ActionList />}
           {activeTab === 'coach' && <AICoach />}
           {activeTab === 'simulator' && <Simulator />}
         </motion.div>
      </main>
      
      {/* Mobile Nav (Simple Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0d0d0e] border-t border-white/5 flex justify-between items-center px-4 pb-safe z-50">
        {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200",
                activeTab === item.id 
                  ? "text-emerald-400 bg-emerald-500/10" 
                  : "text-slate-500"
              )}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAppContext } from '../AppContext';
import { Sparkles, Activity, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Simulator() {
  const { profile } = useAppContext();
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async () => {
    if (!scenario.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/chat', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           message: `Simulate this scenario: "${scenario}". Calculate estimated carbon savings in kg CO2 per week. Return ONLY JSON with fields: predictedSavingsKg (number), description (string explanation).`,
           context: "You are a simulator that only outputs JSON."
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.reply);
      } else {
        setResult(`Error: ${data.error || 'Failed to run simulation.'}`);
      }
    } catch (e: any) {
      setResult("Error running simulation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif italic text-emerald-400 tracking-tight">Reduction Simulator</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-[0.2em]">Hypothetical Impact Engine</p>
        </div>
      </header>

      <div className="bg-[#161618] border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0"></div>
        
        <div className="p-8 md:p-12">
           <div className="flex bg-[#0a0a0c] border border-white/10 rounded-2xl p-2 relative">
             <Input 
               placeholder="What if I use public transport 3 days a week?" 
               value={scenario}
               onChange={e => setScenario(e.target.value)}
               className="flex-1 bg-transparent border-none text-lg text-slate-200 placeholder:text-slate-600 focus-visible:ring-0 px-4"
               onKeyDown={(e) => {
                 if (e.key === 'Enter') handleSimulate();
               }}
             />
             <Button 
                onClick={handleSimulate} 
                disabled={!scenario.trim() || isLoading} 
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 rounded-xl font-bold uppercase tracking-widest transition-all"
             >
               {isLoading ? <Activity className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
               Run Simulation
             </Button>
           </div>

           <AnimatePresence>
             {result && (
               <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-8 bg-[#0d0d0e] border border-emerald-500/20 rounded-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>
                  <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-3 h-3 text-emerald-500"/>
                    Simulation Results
                  </h3>
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                     {result.replace(/```json/g, '').replace(/```/g, '')}
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
           
        </div>
      </div>
      
      <div className="mt-8">
         <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Quick Scenarios</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {[
             { title: 'Go Vegetarian', desc: 'Switch to a vegetarian diet completely', query: 'What if I stop eating meat?' },
             { title: 'Bike Commuting', desc: 'Bike 10km a day instead of driving', query: 'What if I bike 10km a day instead of driving?' },
             { title: 'Renewable Energy', desc: 'Switch to 100% renewable energy', query: 'What if I switch my home to 100% renewable energy?' }
           ].map((item, i) => (
             <button 
                key={i}
                onClick={() => setScenario(item.query)}
                className="group flex flex-col items-start bg-[#161618] hover:bg-[#1a1a1c] border border-white/5 hover:border-emerald-500/30 p-6 rounded-2xl transition-all text-left"
             >
               <span className="font-serif italic text-emerald-400 text-xl tracking-tight mb-2 group-hover:-translate-y-0.5 transition-transform">{item.title}</span>
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 leading-relaxed">{item.desc}</span>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}

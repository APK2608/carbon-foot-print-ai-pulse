import React from 'react';
import { useAppContext } from '../AppContext';
import { Target, Leaf } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function ActionList() {
  const { profile, setProfile } = useAppContext();
  const footprint = profile.footprintData;

  const markCompleted = (index: number) => {
    // Basic gamification logic for demo
    setProfile(prev => ({
        ...prev,
        points: prev.points + 20
    }));
  };

  if (!footprint || footprint.recommendations?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto space-y-6">
        <div className="bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.3)] p-6 rounded-3xl">
          <Target className="w-16 h-16 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-serif italic text-emerald-400 tracking-tight">AI Action Plan</h2>
        <p className="text-slate-500 text-sm tracking-wide">
          Complete your footprint calculation to get personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col space-y-8">
      <header className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-4xl font-serif italic text-emerald-400 tracking-tight">AI Action Plan</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-[0.2em]">Personalized Strategies</p>
        </div>
      </header>

      <div className="bg-[#161618] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#0d0d0e]/50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Recommended Steps</h3>
          <div className="flex gap-2">
            <span className="text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
               {footprint.recommendations.length} Suggestions
            </span>
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="text-[10px] text-slate-600 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium tracking-widest">Action Strategy</th>
              <th className="px-6 py-4 font-medium tracking-widest text-center">Projected Impact</th>
              <th className="px-6 py-4 font-medium tracking-widest text-center">Cost Level</th>
              <th className="px-6 py-4 font-medium tracking-widest text-center">Difficulty</th>
              <th className="px-6 py-4 text-right pr-6"></th>
            </tr>
          </thead>
          <tbody className="text-sm border-t border-white/5">
            {footprint.recommendations.map((rec, i) => {
              // Map levels to dark theme badge colors
              const isHighImpact = rec.impact === 'High';
              const isEasy = rec.difficulty === 'Easy';
              const isHard = rec.difficulty === 'Hard';
              
              return (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] group transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{rec.action}</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1.5 flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-500/70" /> 
                      SAVE {rec.carbonSavingsKgPerWeek} KG CO₂
                    </div>
                  </td>
                  <td className={`px-6 py-5 text-center text-xs font-bold tracking-widest uppercase \${isHighImpact ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {rec.impact}
                  </td>
                  <td className="px-6 py-5 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {rec.cost}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded border \${isEasy ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700/30' : isHard ? 'bg-amber-900/40 text-amber-400 border-amber-700/30' : 'bg-slate-800/60 text-slate-300 border-slate-700/50'}`}>
                      {rec.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => markCompleted(i)} className="w-8 h-8 inline-flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 hover:border-emerald-500 rounded font-bold transition-all transform hover:scale-110">
                      +
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../AppContext';
import { Leaf, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const { profile } = useAppContext();
  const { footprintData, history, points } = profile;

  if (!footprintData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto space-y-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.3)] p-6 rounded-3xl">
          <Leaf className="w-16 h-16 text-emerald-400" />
        </motion.div>
        <h2 className="text-3xl font-serif italic text-emerald-400 tracking-tight">Welcome to EcoPulse</h2>
        <p className="text-slate-500 text-sm tracking-wide">
          Your personal sustainability companion awaits data. Complete the footprint calculator to unlock your dashboard and AI insights.
        </p>
      </div>
    );
  }

  const chartData = history.map((item, index) => ({
    name: `Wk ${index + 1}`,
    co2: item.totalCO2eKgPerWeek,
  }));

  const levelInfo = getLevel(points);

  return (
    <div className="flex flex-col space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif italic text-emerald-400 tracking-tight">EcoPulse AI</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-[0.2em]">Carbon Intelligence Dashboard</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Sustainability Level</p>
          <span className="text-sm font-medium px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]">
            {levelInfo.name}
          </span>
        </div>
      </header>

      {/* Top Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#161618] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">Weekly Footprint</p>
          <p className="text-4xl font-mono text-white">{footprintData.totalCO2eKgPerWeek.toFixed(1)}<span className="text-sm text-slate-500 ml-2">kg</span></p>
          <div className="mt-4 flex items-center text-emerald-400 text-xs">
            <span className="mr-2 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">CURRENT</span>
            <span className="text-slate-500">estimated value</span>
          </div>
        </div>

        <div className="bg-[#161618] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">Sustainability Score</p>
          <p className="text-4xl font-mono text-emerald-400">{footprintData.score}<span className="text-sm text-slate-500 ml-2">/100</span></p>
          <div className="w-full bg-slate-800/50 h-1.5 mt-5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-1000 ease-out" style={{ width: `${footprintData.score}%` }}></div>
          </div>
        </div>

        <div className="bg-[#161618] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">Eco Points Earned</p>
          <p className="text-4xl font-mono text-white">{points}</p>
          <p className="text-xs text-slate-500 mt-4 leading-tight">Keep taking actions to level up.</p>
        </div>

        <div className="bg-[#161618] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">Top Opportunity</p>
          <div className="text-sm font-medium leading-tight text-white mb-2 line-clamp-2">
            {footprintData.recommendations[0]?.action || 'Review your habits'}
          </div>
          <p className="text-xs text-emerald-400 font-medium mt-auto flex items-center pt-2 border-t border-white/5">
            Save {footprintData.recommendations[0]?.carbonSavingsKgPerWeek} kg CO₂ <ArrowRight className="ml-1 w-3 h-3"/>
          </p>
        </div>
      </div>

      {/* Middle Row: Analytics Visuals */}
      <div className="bg-[#161618] border border-white/5 rounded-2xl p-6 relative flex flex-col min-h-[300px]">
         <div className="flex justify-between items-center mb-6">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Emission Trends</h3>
           <div className="flex space-x-4">
             <div className="flex items-center text-[10px] text-emerald-400">
               <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 opacity-80 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> Your Impact
             </div>
           </div>
         </div>
         
         <div className="flex-1 w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d0e', borderColor: '#10b98122', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="co2" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0a0a0c', stroke: '#10b981', strokeWidth: 2 }} 
                  activeDot={{ r: 6, fill: '#10b981', shadow: '0 0 10px rgba(16,185,129,0.5)' }} 
                />
              </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Breakdown Row */}
      <div className="bg-[#161618] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#0d0d0e]/50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Emission Breakdown</h3>
        </div>
        <table className="w-full text-left">
          <thead className="text-[10px] text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium text-right">CO₂ (kg/week)</th>
              <th className="px-6 py-3 font-medium text-right">Percentage</th>
            </tr>
          </thead>
          <tbody className="text-sm border-t border-white/5">
            {footprintData.breakdown.map((item, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-medium text-white">{item.category}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-300">{item.value.toFixed(1)}</td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20 font-mono">
                    {((item.value / footprintData.totalCO2eKgPerWeek) * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getLevel(points: number) {
  if (points > 1000) return { name: 'Climate Hero', color: 'text-emerald-500' };
  if (points > 500) return { name: 'Forest Guardian', color: 'text-green-500' };
  if (points > 250) return { name: 'Tree', color: 'text-green-600' };
  if (points > 100) return { name: 'Plant', color: 'text-lime-500' };
  return { name: 'Seed', color: 'text-amber-700' };
}

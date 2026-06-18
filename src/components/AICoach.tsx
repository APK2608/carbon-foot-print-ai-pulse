import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAppContext } from '../AppContext';
import { Bot, User, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

export function AICoach() {
  const { profile, messages, addMessage } = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMsg });
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          context: {
            score: profile.footprintData?.score,
            totalCO2: profile.footprintData?.totalCO2eKgPerWeek,
            answers: profile.answers,
          }
        }),
      });
      const data = await res.json();
      if (res.ok) {
        addMessage({ role: 'assistant', content: data.reply });
      } else {
        addMessage({ role: 'assistant', content: data.error || 'Sorry, I am experiencing temporary issues. Please try again later.' });
      }
    } catch (e: any) {
       addMessage({ role: 'assistant', content: 'Network or server error. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif italic text-emerald-400 tracking-tight">AI Climate Coach</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-[0.2em]">Gemini Pro Powered</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-gradient-to-br from-[#161618] to-[#0a0a0c] border border-white/5 rounded-3xl flex flex-col relative shadow-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"></div>
        
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth" ref={scrollRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                   <Bot className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="max-w-md text-slate-400 text-sm leading-relaxed">
                  I'm your AI Climate Coach. Ask me how to reduce your carbon footprint, explore alternative transport options, or analyze your energy usage.
                </p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex gap-4 \${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 \${msg.role === 'assistant' ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800 border border-white/5'}`}>
                  {msg.role === 'assistant' ? <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> : <User className="w-4 h-4 text-slate-400"/>}
                </div>
                
                <div className={`px-5 py-4 rounded-2xl max-w-[80%] text-sm leading-relaxed \${msg.role === 'user' ? 'bg-white/5 border border-white/10 text-slate-200 rounded-tr-none' : 'bg-[#1a1a1c] border border-emerald-500/10 text-slate-300 rounded-tl-none'}`}>
                   {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                 </div>
                 <div className="px-5 py-4 rounded-2xl bg-[#1a1a1c] border border-emerald-500/10 rounded-tl-none flex items-center gap-1.5 h-[52px]">
                   <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-[#0a0a0c]/80 backdrop-blur-md border-t border-white/5">
           <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
              <Input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                placeholder="Ask EcoPulse..." 
                className="w-full h-12 bg-black/40 border border-white/10 rounded-full px-6 pr-14 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/30"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="absolute right-1.5 top-1.5 h-9 w-9 p-0 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-all disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500"
              >
                 <ArrowUp className="w-4 h-4" />
              </Button>
           </form>
        </div>
      </div>
    </div>
  );
}

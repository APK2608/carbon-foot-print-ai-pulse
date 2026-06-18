import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAppContext } from '../AppContext';
import { Navigation, Home, Apple, ShoppingBag, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STEPS = [
  { id: 'transportation', title: 'Transportation', icon: Navigation },
  { id: 'energy', title: 'Home Energy', icon: Home },
  { id: 'food', title: 'Food Habits', icon: Apple },
  { id: 'shopping', title: 'Shopping', icon: ShoppingBag },
  { id: 'waste', title: 'Waste Management', icon: Trash2 },
];

export function Calculator() {
  const { calculateFootprint, isLoadingFootprint, profile } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(profile.answers || {});
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((p) => p + 1);
    else submit();
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const submit = async () => {
    try {
      setError(null);
      await calculateFootprint(answers);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    }
  };

  const handleChange = (key: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const StepIcon = STEPS[currentStep].icon;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif italic text-emerald-400 tracking-tight">Footprint Setup</h1>
        <p className="text-slate-500 uppercase tracking-widest text-xs mt-2">Personalize Your AI Model</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm text-center font-medium">
          {error}
        </div>
      )}

      <div className="mb-12 flex items-center justify-between relative px-4">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 \${idx <= currentStep ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-[#161618] text-slate-500 border border-white/5'}`}>
               <step.icon className="w-5 h-5" />
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`absolute top-6 left-[50%] w-full h-[2px] -z-10 \${idx < currentStep ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/5'}`} />
            )}
            <span className={`text-[10px] uppercase font-bold tracking-widest mt-4 text-center transition-colors \${idx <= currentStep ? 'text-emerald-400' : 'text-slate-600'}`}>
              {step.title.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-[#161618] border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0"></div>
        
        <div className="bg-[#0d0d0e]/50 p-6 border-b border-white/5 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <StepIcon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-serif italic text-2xl text-slate-200 tracking-tight">{STEPS[currentStep].title}</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1.5">Provide weekly estimates</p>
            </div>
        </div>
        
        <div className="p-8 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Car usage (km/week)</Label>
                    <Input type="number" placeholder="e.g. 150" value={answers.carKm || ''} onChange={(e) => handleChange('carKm', e.target.value)} className="h-12 bg-black/40 border-white/10 text-lg placeholder:text-slate-700" />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Public transport (km/week)</Label>
                    <Input type="number" placeholder="e.g. 50" value={answers.publicKm || ''} onChange={(e) => handleChange('publicKm', e.target.value)} className="h-12 bg-black/40 border-white/10 text-lg placeholder:text-slate-700" />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Flights per year</Label>
                    <Input type="number" placeholder="e.g. 2" value={answers.flights || ''} onChange={(e) => handleChange('flights', e.target.value)} className="h-12 bg-black/40 border-white/10 text-lg placeholder:text-slate-700" />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Monthly electricity bill ($ or kWh)</Label>
                    <Input type="number" placeholder="e.g. 100" value={answers.electricity || ''} onChange={(e) => handleChange('electricity', e.target.value)} className="h-12 bg-black/40 border-white/10 text-lg placeholder:text-slate-700" />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Primary Energy Source</Label>
                    <Select value={answers.energySource || ''} onValueChange={(v) => handleChange('energySource', v)}>
                      <SelectTrigger className="h-12 bg-black/40 border-white/10 text-lg"><SelectValue placeholder="Select energy source" /></SelectTrigger>
                      <SelectContent className="bg-[#161618] border-white/10 text-slate-200">
                        <SelectItem value="grid" className="focus:bg-emerald-500/20 focus:text-emerald-400">Standard Grid</SelectItem>
                        <SelectItem value="renewable" className="focus:bg-emerald-500/20 focus:text-emerald-400">100% Renewable</SelectItem>
                        <SelectItem value="mixed" className="focus:bg-emerald-500/20 focus:text-emerald-400">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Diet Type</Label>
                    <RadioGroup value={answers.diet || ''} onValueChange={(v) => handleChange('diet', v)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['meat_heavy', 'mixed', 'vegetarian', 'vegan'].map((type) => {
                        const labels: Record<string, string> = {
                           meat_heavy: 'Meat Heavy (Daily)',
                           mixed: 'Mixed / Average',
                           vegetarian: 'Vegetarian',
                           vegan: 'Vegan'
                        };
                        const isSelected = answers.diet === type;
                        return (
                          <div key={type} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all \${isSelected ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-black/20 border-white/5 hover:border-white/10'}`} onClick={() => handleChange('diet', type)}>
                            <RadioGroupItem value={type} id={type} className={`border-slate-600 text-emerald-500 \${isSelected ? 'border-emerald-500' : ''}`} />
                            <Label htmlFor={type} className={`cursor-pointer text-base \${isSelected ? 'text-emerald-400 font-medium' : 'text-slate-300'}`}>{labels[type]}</Label>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />}
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Online Purchases per month</Label>
                    <Input type="number" placeholder="e.g. 5" value={answers.onlineShopping || ''} onChange={(e) => handleChange('onlineShopping', e.target.value)} className="h-12 bg-black/40 border-white/10 text-lg placeholder:text-slate-700" />
                  </div>
                   <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Clothing purchases per year</Label>
                    <Input type="number" placeholder="e.g. 12" value={answers.clothingShopping || ''} onChange={(e) => handleChange('clothingShopping', e.target.value)} className="h-12 bg-black/40 border-white/10 text-lg placeholder:text-slate-700" />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400">Recycling Habits</Label>
                     <Select value={answers.recycling || ''} onValueChange={(v) => handleChange('recycling', v)}>
                      <SelectTrigger className="h-12 bg-black/40 border-white/10 text-lg"><SelectValue placeholder="How often do you recycle?" /></SelectTrigger>
                      <SelectContent className="bg-[#161618] border-white/10 text-slate-200">
                        <SelectItem value="always" className="focus:bg-emerald-500/20 focus:text-emerald-400">Always</SelectItem>
                        <SelectItem value="sometimes" className="focus:bg-emerald-500/20 focus:text-emerald-400">Sometimes</SelectItem>
                        <SelectItem value="never" className="focus:bg-emerald-500/20 focus:text-emerald-400">Rarely/Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-slate-400 block mb-4">Composting</Label>
                     <RadioGroup value={answers.composting || 'no'} onValueChange={(v) => handleChange('composting', v)} className="grid grid-cols-2 gap-4">
                       {[ {value: 'yes', label: 'Yes, I compost'}, {value: 'no', label: 'No'} ].map(opt => (
                         <div key={opt.value} className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-all \${answers.composting === opt.value ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-black/20 border-white/5 hover:border-white/10'}`} onClick={() => handleChange('composting', opt.value)}>
                            <RadioGroupItem value={opt.value} id={`comp_\${opt.value}`} className={`border-slate-600 text-emerald-500 \${answers.composting === opt.value ? 'border-emerald-500' : ''}`} />
                            <Label htmlFor={`comp_\${opt.value}`} className={`cursor-pointer text-base \${answers.composting === opt.value ? 'text-emerald-400 font-medium' : 'text-slate-300'}`}>{opt.label}</Label>
                            {answers.composting === opt.value && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />}
                         </div>
                       ))}
                    </RadioGroup>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex justify-between items-center p-6 bg-[#0a0a0c] border-t border-white/5">
          <Button 
             variant="outline" 
             onClick={handleBack} 
             disabled={currentStep === 0 || isLoadingFootprint}
             className="bg-transparent border-white/10 hover:bg-white/5 text-slate-300"
          >
             Back
          </Button>
          <Button 
             onClick={handleNext} 
             disabled={isLoadingFootprint} 
             className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest px-8 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-50"
          >
            {isLoadingFootprint ? 'Computing AI Insight...' : currentStep === STEPS.length - 1 ? 'Analyze Imprint' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}

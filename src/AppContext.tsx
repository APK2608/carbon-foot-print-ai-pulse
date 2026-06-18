import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, FootprintData, ChatMessage } from './types';

interface AppContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  calculateFootprint: (answers: Record<string, any>) => Promise<void>;
  isLoadingFootprint: boolean;
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ecopulse_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return { answers: {}, footprintData: null, history: [], points: 0 };
  });

  const [isLoadingFootprint, setIsLoadingFootprint] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('ecopulse_profile', JSON.stringify(profile));
  }, [profile]);

  const addMessage = (msg: ChatMessage) => setMessages(prev => [...prev, msg]);

  const calculateFootprint = async (answers: Record<string, any>) => {
    setIsLoadingFootprint(true);
    try {
      const res = await fetch('/api/calculate-footprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to calculate footprint.');
      }
      const footprintData: FootprintData = {
        ...data,
        timestamp: new Date().toISOString()
      };
      setProfile(prev => {
         const currentPoints = prev.points;
         return {
           ...prev,
           answers,
           footprintData,
           history: [...prev.history, footprintData],
           points: currentPoints + 50
         };
      });
    } catch (e: any) {
      console.error(e);
      throw e;
    } finally {
      setIsLoadingFootprint(false);
    }
  };

  return (
    <AppContext.Provider value={{ profile, setProfile, calculateFootprint, isLoadingFootprint, messages, addMessage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

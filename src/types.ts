export interface UserProfile {
  answers: Record<string, string | number>;
  footprintData: FootprintData | null;
  history: FootprintData[];
  points: number;
}

export interface FootprintData {
  totalCO2eKgPerWeek: number;
  score: number;
  breakdown: { category: string; value: number }[];
  recommendations: Recommendation[];
  timestamp: string;
}

export interface Recommendation {
  action: string;
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cost: 'Free' | 'Low' | 'Medium' | 'High';
  carbonSavingsKgPerWeek: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

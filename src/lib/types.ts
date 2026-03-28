export interface DetectionResult {
  score: number; // 0-100, higher = more likely AI
  label: 'likely-human' | 'mixed' | 'likely-ai';
  perplexity: number;    // 0-100
  burstiness: number;    // 0-100
  repetition: number;    // 0-100
  vocabulary: number;    // 0-100
  sentences: SentenceAnalysis[];
  wordCount: number;
  sentenceCount: number;
}

export interface SentenceAnalysis {
  text: string;
  score: number; // 0-100
  label: 'human' | 'mixed' | 'ai';
}

export interface HistoryItem {
  id: string;
  text: string;
  result: DetectionResult;
  timestamp: number;
}

export interface AffiliateProduct {
  name: string;
  slug: string;
  url: string;
  description: string;
  rating: number;
  price: string;
  features: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  content: string;
  keywords: string[];
}

import type { DetectionResult, SentenceAnalysis } from './types';

// Common English words (top 500) - AI text heavily relies on these
const COMMON_WORDS = new Set([
  'the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at',
  'this','but','his','by','from','they','we','her','she','or','an','will','my','one','all','would','there',
  'their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time',
  'no','just','him','know','take','people','into','year','your','good','some','could','them','see','other',
  'than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our',
  'work','first','well','way','even','new','want','because','any','these','give','day','most','us','great',
  'between','need','large','often','important','however','furthermore','additionally','moreover','therefore',
  'consequently','nevertheless','specifically','significantly','essentially','particularly','demonstrate',
  'utilize','implement','facilitate','comprehensive','effectively','subsequently','approximately','fundamental',
  'respectively','considerable','predominant','substantial','preliminary','corresponding','predominantly',
  'inevitably','simultaneously','unprecedented','methodology','furthermore','acknowledge','contribute',
  'establish','maintain','determine','indicate','suggest','represent','provide','consider','require',
  'include','develop','approach','process','system','level','result','effect','change','support',
]);

// AI transition phrases (high signal)
const AI_PHRASES = [
  'it is important to note',
  'it is worth noting',
  'in today\'s world',
  'in this article',
  'in conclusion',
  'to summarize',
  'as mentioned earlier',
  'on the other hand',
  'it goes without saying',
  'needless to say',
  'at the end of the day',
  'when it comes to',
  'in terms of',
  'as a result',
  'for instance',
  'for example',
  'in addition',
  'first and foremost',
  'last but not least',
  'plays a crucial role',
  'serves as a',
  'it is essential',
  'it should be noted',
  'one of the most',
  'there are several',
  'it is clear that',
  'this is because',
  'in order to',
  'as we can see',
  'the fact that',
  'it can be argued',
  'from this perspective',
  'taking into account',
  'with regard to',
  'in the context of',
  'based on the above',
  'overall',
  'ultimately',
  'delve',
  'tapestry',
  'multifaceted',
  'landscape',
  'leverage',
  'synergy',
  'paradigm',
  'holistic',
  'robust',
  'streamline',
];

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s'-]/g, '').split(/\s+/).filter(w => w.length > 0);
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
}

/**
 * Perplexity estimation: measures how "predictable" the text is.
 * AI text uses very common words → lower perplexity → higher AI score.
 */
function analyzePerplexity(words: string[]): number {
  if (words.length < 10) return 50;
  
  let commonCount = 0;
  for (const w of words) {
    if (COMMON_WORDS.has(w)) commonCount++;
  }
  const commonRatio = commonCount / words.length;
  
  // AI text: ~75-85% common words. Human: ~60-70%
  // Map to 0-100 where higher = more AI-like
  const score = Math.min(100, Math.max(0, (commonRatio - 0.55) * 300));
  return Math.round(score);
}

/**
 * Burstiness: measures variation in sentence length.
 * Human writing has high variation (short + long sentences).
 * AI writing tends to be uniform.
 */
function analyzeBurstiness(sentences: string[]): number {
  if (sentences.length < 3) return 50;
  
  const lengths = sentences.map(s => tokenize(s).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((a, l) => a + Math.pow(l - mean, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? stdDev / mean : 0; // coefficient of variation
  
  // Human: CV typically 0.4-0.8. AI: 0.15-0.35
  // Lower CV = more uniform = more AI-like
  // Invert: low burstiness → high AI score
  const score = Math.min(100, Math.max(0, (1 - cv / 0.7) * 100));
  return Math.round(score);
}

/**
 * Repetition: checks for repeated n-grams (3-grams, 4-grams).
 * AI tends to reuse similar phrase structures.
 */
function analyzeRepetition(words: string[]): number {
  if (words.length < 20) return 50;
  
  // Check 3-grams
  const trigrams = new Map<string, number>();
  for (let i = 0; i < words.length - 2; i++) {
    const gram = `${words[i]} ${words[i+1]} ${words[i+2]}`;
    trigrams.set(gram, (trigrams.get(gram) || 0) + 1);
  }
  const trigramRepeat = [...trigrams.values()].filter(v => v > 1).length;
  const trigramRatio = trigrams.size > 0 ? trigramRepeat / trigrams.size : 0;
  
  // Check AI phrases
  const lowerText = words.join(' ');
  let phraseMatches = 0;
  for (const phrase of AI_PHRASES) {
    if (lowerText.includes(phrase)) phraseMatches++;
  }
  const phraseScore = Math.min(phraseMatches * 12, 60);
  
  const score = Math.min(100, Math.max(0, trigramRatio * 200 + phraseScore));
  return Math.round(score);
}

/**
 * Vocabulary diversity: Type-Token Ratio.
 * AI text tends to have lower diversity (repeats words more).
 */
function analyzeVocabulary(words: string[]): number {
  if (words.length < 10) return 50;
  
  const unique = new Set(words);
  const ttr = unique.size / words.length;
  
  // Human: TTR typically 0.55-0.75. AI: 0.40-0.55 (for longer texts)
  // Adjust for text length (longer text naturally has lower TTR)
  const lengthFactor = Math.min(1, words.length / 200);
  const adjustedTTR = ttr + (1 - lengthFactor) * 0.1;
  
  // Lower TTR = more repetitive = more AI-like
  const score = Math.min(100, Math.max(0, (1 - adjustedTTR / 0.7) * 120));
  return Math.round(score);
}

/**
 * Analyze individual sentences
 */
function analyzeSentences(sentences: string[]): SentenceAnalysis[] {
  return sentences.map(text => {
    const words = tokenize(text);
    const commonRatio = words.filter(w => COMMON_WORDS.has(w)).length / Math.max(words.length, 1);
    
    // Check for AI phrases in sentence
    const lower = text.toLowerCase();
    let phraseHits = 0;
    for (const phrase of AI_PHRASES) {
      if (lower.includes(phrase)) phraseHits++;
    }
    
    // Sentence length uniformity contributes
    const lenScore = words.length > 15 && words.length < 30 ? 15 : 0; // AI prefers medium sentences
    
    const sentenceScore = Math.min(100, Math.max(0,
      commonRatio * 60 + phraseHits * 25 + lenScore
    ));
    
    return {
      text,
      score: Math.round(sentenceScore),
      label: sentenceScore < 35 ? 'human' : sentenceScore < 60 ? 'mixed' : 'ai',
    };
  });
}

/**
 * Main detection function
 */
export function detectAI(text: string): DetectionResult {
  const words = tokenize(text);
  const sentences = splitSentences(text);
  
  const perplexity = analyzePerplexity(words);
  const burstiness = analyzeBurstiness(sentences);
  const repetition = analyzeRepetition(words);
  const vocabulary = analyzeVocabulary(words);
  
  // Weighted score
  const score = Math.round(
    perplexity * 0.30 +
    burstiness * 0.25 +
    repetition * 0.25 +
    vocabulary * 0.20
  );
  
  const label = score < 35 ? 'likely-human' : score < 60 ? 'mixed' : 'likely-ai';
  
  return {
    score,
    label,
    perplexity,
    burstiness,
    repetition,
    vocabulary,
    sentences: analyzeSentences(sentences),
    wordCount: words.length,
    sentenceCount: sentences.length,
  };
}

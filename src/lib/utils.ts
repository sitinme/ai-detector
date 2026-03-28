export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getScoreColor(score: number): { bg: string; text: string; ring: string } {
  if (score < 35) return { bg: 'bg-green-50', text: 'text-green-700', ring: 'stroke-green-500' };
  if (score < 60) return { bg: 'bg-yellow-50', text: 'text-yellow-700', ring: 'stroke-yellow-500' };
  return { bg: 'bg-red-50', text: 'text-red-700', ring: 'stroke-red-500' };
}

export function getScoreLabel(score: number): string {
  if (score < 35) return 'Likely Human Written';
  if (score < 60) return 'Mixed / Uncertain';
  return 'Likely AI-Generated';
}

export function getSentenceColor(label: 'human' | 'mixed' | 'ai'): string {
  if (label === 'human') return 'bg-green-100';
  if (label === 'mixed') return 'bg-yellow-100';
  return 'bg-red-100';
}

'use client';

import type { SentenceAnalysis } from '@/lib/types';
import { getSentenceColor } from '@/lib/utils';

interface Props {
  sentences: SentenceAnalysis[];
}

export default function SentenceHighlight({ sentences }: Props) {
  if (sentences.length === 0) return null;

  const icons = { human: '🟢', mixed: '🟡', ai: '🔴' };
  const labels = { human: 'Human', mixed: 'Uncertain', ai: 'Likely AI' };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Sentence Analysis</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sentences.map((s, i) => (
          <div key={i} className={`flex items-start gap-2 p-2 rounded-lg ${getSentenceColor(s.label)}`}>
            <span className="flex-shrink-0 text-xs mt-0.5">{icons[s.label]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-relaxed">{s.text}</p>
              <span className="text-xs text-gray-500">{labels[s.label]} ({s.score}%)</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>🟢 Human</span>
        <span>🟡 Uncertain</span>
        <span>🔴 Likely AI</span>
      </div>
    </div>
  );
}

'use client';

import { getScoreColor, getScoreLabel } from '@/lib/utils';

interface Props {
  score: number;
}

export default function ScoreRing({ score }: Props) {
  const { text, ring } = getScoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            className={`${ring} score-ring-animate`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold ${text}`}>{score}%</span>
          <span className="text-xs text-gray-500">AI Score</span>
        </div>
      </div>
      <div className={`mt-3 px-4 py-1.5 rounded-full text-sm font-semibold ${getScoreColor(score).bg} ${text}`}>
        {getScoreLabel(score)}
      </div>
    </div>
  );
}

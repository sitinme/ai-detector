'use client';

interface Props {
  label: string;
  score: number;
  description: string;
}

export default function DimensionBar({ label, score, description }: Props) {
  const color = score < 35 ? 'bg-green-500' : score < 60 ? 'bg-yellow-500' : 'bg-red-500';
  const levelLabel = score < 35 ? 'Low' : score < 60 ? 'Med' : 'High';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500">{score}% ({levelLabel})</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

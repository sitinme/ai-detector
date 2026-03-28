'use client';

import { useState, useRef } from 'react';
import type { DetectionResult } from '@/lib/types';
import { detectAI } from '@/lib/detector';
import { generateId } from '@/lib/utils';
import ScoreRing from '@/components/detector/ScoreRing';
import DimensionBar from '@/components/detector/DimensionBar';
import SentenceHighlight from '@/components/detector/SentenceHighlight';

const MAX_WORDS = 1000;

export default function AIDetectorPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isOverLimit = wordCount > MAX_WORDS;

  const handleAnalyze = () => {
    if (!text.trim() || wordCount < 10) return;

    setAnalyzing(true);
    setResult(null);

    // Simulate brief processing time for UX
    setTimeout(() => {
      const truncated = text.trim().split(/\s+/).slice(0, MAX_WORDS).join(' ');
      const r = detectAI(truncated);
      setResult(r);
      setAnalyzing(false);

      // Save to history
      try {
        const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
        history.unshift({ id: generateId(), text: truncated.substring(0, 200) + '...', result: r, timestamp: Date.now() });
        localStorage.setItem('detectionHistory', JSON.stringify(history.slice(0, 10)));
      } catch { /* ignore */ }

      if (isOverLimit) setShowLimitModal(true);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(reader.result as string);
    reader.readAsText(file);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  const copyReport = () => {
    if (!result) return;
    const report = `AI Writing Analysis Report
========================
Overall AI Score: ${result.score}% — ${result.label === 'likely-human' ? 'Likely Human Written' : result.label === 'mixed' ? 'Mixed / Uncertain' : 'Likely AI-Generated'}

Dimensions:
- Perplexity: ${result.perplexity}%
- Burstiness: ${result.burstiness}%
- Repetition: ${result.repetition}%
- Vocabulary: ${result.vocabulary}%

Words analyzed: ${result.wordCount}
Sentences analyzed: ${result.sentenceCount}

⚠️ This analysis is for reference only. AI detection is not 100% accurate.
Powered by AIWritingCheck.com`;
    navigator.clipboard.writeText(report);
  };

  const softwareSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AIWritingCheck - Free AI Content Detector',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: softwareSchema }} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Content Detector</h1>
          <p className="mt-1 text-gray-600">Paste your text below to analyze if it was written by AI. Free, instant, private.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">Your Text</label>
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileRef.current?.click()} className="text-xs text-gray-500 hover:text-[--color-primary]">📎 Upload .txt</button>
              <span className={`text-xs ${isOverLimit ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                {wordCount} / {MAX_WORDS} words
              </span>
            </div>
          </div>

          <textarea
            className="w-full h-48 p-4 border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed resize-y focus:outline-none focus:border-[--color-primary] focus:ring-2 focus:ring-emerald-100"
            placeholder="Paste the text you want to analyze here... (minimum 10 words)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {isOverLimit && (
            <p className="mt-2 text-xs text-red-500">Text exceeds {MAX_WORDS} words. Only the first {MAX_WORDS} words will be analyzed.</p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || wordCount < 10}
              className="px-8 py-3 bg-[--color-primary] text-white rounded-xl font-semibold hover:bg-[--color-primary-dark] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? '🔍 Analyzing...' : '🔍 Analyze Text'}
            </button>
            {text && (
              <button onClick={handleClear} className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700">Clear</button>
            )}
          </div>
        </div>

        {/* Analyzing State */}
        {analyzing && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="analyzing-pulse text-4xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-gray-700">Analyzing your text...</p>
            <p className="mt-2 text-sm text-gray-500">
              For professional-grade detection, try{' '}
              <a href="/go/originality" target="_blank" rel="noopener noreferrer nofollow" className="text-[--color-primary] hover:underline font-medium">Originality.ai</a>
            </p>
          </div>
        )}

        {/* Results */}
        {result && !analyzing && (
          <div className="mt-8 space-y-6">
            {/* Score Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ScoreRing score={result.score} />
                <div className="flex-1 space-y-4 w-full">
                  <DimensionBar label="Perplexity" score={result.perplexity} description="How predictable the word choices are" />
                  <DimensionBar label="Burstiness" score={result.burstiness} description="Variation in sentence lengths" />
                  <DimensionBar label="Repetition" score={result.repetition} description="Repeated phrases and AI patterns" />
                  <DimensionBar label="Vocabulary" score={result.vocabulary} description="Diversity of word usage" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm">
                <span className="text-gray-500">📊 {result.wordCount} words · {result.sentenceCount} sentences analyzed</span>
                <button onClick={copyReport} className="text-[--color-primary] hover:underline font-medium">📋 Copy Report</button>
              </div>
            </div>

            {/* Sentence Analysis */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <SentenceHighlight sentences={result.sentences} />
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                ⚠️ <strong>Disclaimer:</strong> This tool provides an estimate only. AI detection technology is not 100% accurate.
                Results should be used as one of many factors in your assessment, not as definitive proof.
              </p>
            </div>

            {/* Affiliate CTA - contextual */}
            {result.score >= 35 && result.score <= 65 && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                <p className="text-lg font-bold text-gray-900">🤔 Uncertain Result?</p>
                <p className="mt-2 text-gray-600">Get a definitive answer with professional AI detectors:</p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <a href="/go/gptzero" target="_blank" rel="noopener noreferrer nofollow" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Try GPTZero →</a>
                  <a href="/go/originality" target="_blank" rel="noopener noreferrer nofollow" className="px-5 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50">Try Originality.ai →</a>
                </div>
              </div>
            )}

            {/* General Affiliate CTA */}
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-6 text-center">
              <p className="text-lg font-bold text-gray-900">Need More Accurate Detection?</p>
              <p className="mt-2 text-gray-600 text-sm">Professional AI detectors use advanced ML models for 95%+ accuracy.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <a href="/go/originality" target="_blank" rel="noopener noreferrer nofollow" className="px-5 py-2 bg-[--color-primary] text-white rounded-lg text-sm font-semibold hover:bg-[--color-primary-dark]">Originality.ai — Most Accurate →</a>
                <a href="/go/copyleaks" target="_blank" rel="noopener noreferrer nofollow" className="px-5 py-2 bg-white text-[--color-primary] border-2 border-[--color-primary] rounded-lg text-sm font-semibold hover:bg-emerald-50">Copyleaks — 30+ Languages →</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Over-limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLimitModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900">Need Unlimited Text Analysis?</h3>
            <p className="mt-3 text-gray-600">Your text exceeded {MAX_WORDS} words. For unlimited analysis with higher accuracy, try these professional tools:</p>
            <div className="mt-6 space-y-3">
              <a href="/go/originality" target="_blank" rel="noopener noreferrer nofollow" className="block w-full text-center px-5 py-3 bg-[--color-primary] text-white rounded-xl font-semibold hover:bg-[--color-primary-dark]">Try Originality.ai →</a>
              <a href="/go/gptzero" target="_blank" rel="noopener noreferrer nofollow" className="block w-full text-center px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-[--color-primary]">Try GPTZero →</a>
            </div>
            <button onClick={() => setShowLimitModal(false)} className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700">No thanks, continue</button>
          </div>
        </div>
      )}
    </div>
  );
}

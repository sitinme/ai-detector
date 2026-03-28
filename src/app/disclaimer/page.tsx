import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Disclaimer', description: 'AIWritingCheck disclaimer, accuracy limitations, and affiliate disclosure.' };

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Disclaimer</h1>
      <div className="prose prose-lg prose-emerald max-w-none text-gray-700">
        <h2>Accuracy Disclaimer</h2>
        <p><strong>AIWritingCheck provides estimates only.</strong> Our statistical analysis is not 100% accurate and should not be used as definitive proof of AI authorship. AI detection technology across the industry has known limitations including false positives (human text flagged as AI) and false negatives (AI text not detected).</p>
        <p>Never use any AI detector — including ours — as the sole basis for academic disciplinary action, employment decisions, or content rejection.</p>
        <h2>Affiliate Disclosure</h2>
        <p>AIWritingCheck participates in affiliate programs with Originality.ai, GPTZero, Copyleaks, Grammarly, and other detection/writing tools. When you click links to these products and make a purchase, we may earn a commission at no additional cost to you.</p>
        <h2>No Warranty</h2>
        <p>This tool is provided &quot;as is&quot; without warranty of any kind. We make no guarantees about the accuracy, reliability, or suitability of the analysis results.</p>
        <h2>FTC Compliance</h2>
        <p>In accordance with FTC guidelines, we disclose that some links on this website are affiliate links.</p>
      </div>
    </div>
  );
}

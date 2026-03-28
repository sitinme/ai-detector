import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'AIWritingCheck privacy policy — your text stays in your browser.' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-lg prose-emerald max-w-none text-gray-700">
        <p><strong>Last updated:</strong> March 2026</p>
        <h2>Your Text Data</h2>
        <p><strong>We do not collect, store, or transmit any text you input.</strong> All AI analysis happens entirely in your browser using client-side JavaScript. Your text never leaves your device.</p>
        <h2>Analytics</h2>
        <p>We use Google Analytics 4 to understand website usage (page views, traffic sources). GA uses cookies. You can opt out using a browser extension.</p>
        <h2>localStorage</h2>
        <p>We store your recent detection history in your browser&apos;s localStorage for convenience. This data never leaves your browser and can be cleared through browser settings.</p>
        <h2>Third-Party Links</h2>
        <p>Our site contains links to affiliate partners. We are not responsible for their privacy practices.</p>
        <h2>Contact</h2>
        <p>For privacy questions, visit our About page.</p>
      </div>
    </div>
  );
}

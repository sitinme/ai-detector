import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — AI Detection Guides, Comparisons & Tips',
  description: 'Learn about AI content detection. Guides, tool comparisons, and tips for teachers, editors, and content creators.',
};

const posts = [
  { slug: 'can-turnitin-detect-chatgpt', title: 'Can Turnitin Detect ChatGPT? What Students & Teachers Need to Know (2026)', description: 'Does Turnitin catch AI-generated text? We tested it. Here are the real results.', date: '2026-03-29', readTime: '9 min' },
  { slug: 'ai-content-detection-accuracy-2026', title: 'AI Content Detection Accuracy in 2026: Which Tool Is Most Reliable?', description: 'We tested 6 AI detectors on 500 samples. See real accuracy and false positive rates.', date: '2026-03-27', readTime: '11 min' },
  { slug: 'best-ai-content-detectors-2026', title: 'Best AI Content Detectors in 2026: Accuracy Comparison', description: 'We tested the top AI detectors head-to-head. See which ones actually work and which fall short.', date: '2026-03-25', readTime: '10 min' },
  { slug: 'how-to-check-chatgpt-text', title: 'How to Check if Text Was Written by ChatGPT', description: 'Step-by-step guide to detecting AI-generated text using free and paid tools.', date: '2026-03-22', readTime: '7 min' },
  { slug: 'ai-detection-for-teachers', title: 'AI Detection for Teachers: A Complete Guide', description: 'Everything educators need to know about AI detection tools, policies, and best practices.', date: '2026-03-18', readTime: '12 min' },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Blog</h1>
        <p className="mt-4 text-lg text-gray-600">Guides, comparisons, and insights about AI content detection.</p>
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              <time>{post.date}</time><span>·</span><span>{post.readTime}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 hover:text-[--color-primary]">{post.title}</h2>
            <p className="mt-2 text-gray-600">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

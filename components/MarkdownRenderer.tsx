'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-gray max-w-none
      prose-headings:font-bold prose-headings:leading-tight prose-headings:text-gray-950
      prose-p:text-gray-700 prose-p:leading-relaxed
      prose-a:text-[#e5201b] prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900
      prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-sm
      prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg
      prose-img:rounded-sm prose-img:mx-auto
      prose-blockquote:border-l-4 prose-blockquote:border-[#e5201b] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
      prose-li:text-gray-700
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

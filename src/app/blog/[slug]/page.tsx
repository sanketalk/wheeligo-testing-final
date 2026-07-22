import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/app/actions';
import { Calendar, User, ArrowLeft, Bookmark } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getBlogBySlug(resolvedParams.slug);
  if (!post) return { title: 'Article Not Found | Wheeligo' };
  
  return {
    title: `${post.title} | Wheeligo Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getBlogBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <Link
        href="/blog"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-muted-foreground hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Articles</span>
      </Link>

      {/* Main Layout Card */}
      <article className="glass border border-border rounded-3xl overflow-hidden shadow-xl">
        {/* Cover Image */}
        <div className="aspect-video w-full bg-black/40 overflow-hidden relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <span className="absolute bottom-4 left-4 px-2.5 py-1 text-[9px] font-bold uppercase bg-black/60 backdrop-blur text-gold-400 rounded-md border border-gold-500/20">
            {post.category}
          </span>
        </div>

        {/* Article Body */}
        <div className="p-6 md:p-10 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
              {post.title}
            </h1>
            
            {/* Meta */}
            <div className="flex items-center space-x-4 text-[10px] font-bold text-muted-foreground pb-4 border-b border-border">
              <span className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-gold-500" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1.5 text-gold-500" />
                {post.author}
              </span>
              <span className="flex items-center">
                <Bookmark className="h-3.5 w-3.5 mr-1.5 text-gold-500" />
                {post.category}
              </span>
            </div>
          </div>

          {/* Typography Body Content */}
          <div
            className="text-xs sm:text-sm leading-relaxed text-muted-foreground/90 space-y-4 prose prose-invert max-w-none"
            style={{ whiteSpace: 'pre-line' }}
            dangerouslySetInnerHTML={{
              __html: post.content
                // Format markdown lists (basic check)
                .replace(/\* \*\*(.*?)\*\*/g, '<li><strong>$1</strong>')
                .replace(/### (.*?)\n/g, '<h3 class="text-lg font-bold text-foreground pt-4">$1</h3>')
                .replace(/\n\n/g, '<br /><br />')
            }}
          />
        </div>
      </article>
    </div>
  );
}

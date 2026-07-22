import React from 'react';
import Link from 'next/link';
import { getBlogs } from '@/app/actions';
import { Sparkles, Calendar, User, ArrowRight } from 'lucide-react';

export const revalidate = 1800; // Cache for 30 minutes

export const metadata = {
  title: 'Luxury Driving Guides & Travel Blogs | Wheeligo',
  description: 'Explore scenic road trip recommendations, electric vehicle renting advice, and self-drive car policies.',
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass border border-gold-500/20 text-gold-400 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Wheeligo Editorial</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Travel Guides & Tips
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground/80 font-medium leading-relaxed font-sans">
          Get inspired for your next weekend escape, read electric vehicle driving logs, and stay updated with travel safety suggestions.
        </p>
      </div>

      {/* Grid List */}
      {blogs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass border border-border text-xs text-muted-foreground">
          No articles posted yet. Stay tuned for luxury road trip logs and driving tutorials!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((post: any) => (
            <div
              key={post.id}
              className="luxury-card glass border border-border rounded-3xl overflow-hidden flex flex-col h-full group"
            >
              {/* Cover Image */}
              <div className="aspect-video bg-black/40 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <span className="absolute top-4 left-4 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur text-gold-400 rounded-md border border-gold-500/20">
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-3">
                  {/* Meta */}
                  <div className="flex items-center space-x-4 text-[10px] font-bold text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gold-500" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1.5 text-gold-500" />
                      {post.author}
                    </span>
                  </div>
                  {/* Title */}
                  <h2 className="text-xl font-bold text-foreground group-hover:text-gold-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="w-fit mt-auto text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center space-x-1.5 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

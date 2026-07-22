import React from 'react';
import FaqsBrowser from '@/components/faqs/FaqsBrowser';
import { HelpCircle, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions | Wheeligo FAQ',
  description: 'Find answers about KYC, driver limits, insurance covers, fuel rules, and refund schedules.',
};

export default function FaqsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass border border-gold-500/20 text-gold-400 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Policies & Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground/80 font-medium leading-relaxed font-sans">
          Have queries about driving limits, deposits, fuel rules, or insurance claims? Browse our comprehensive guide or ask our AI Travel Companion.
        </p>
      </div>

      {/* Accordion Interface */}
      <FaqsBrowser />
    </div>
  );
}

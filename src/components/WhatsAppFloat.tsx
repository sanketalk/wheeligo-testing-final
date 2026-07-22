'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show after 3 seconds
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Show tooltip after 6 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  if (!isVisible) return null;

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+919876543210';
  const cleanWAPhone = waNumber.replace(/[^\d+]/g, '');
  const promptMessage = encodeURIComponent(
    'Hi Wheeligo, I am interested in renting a premium self-drive car. Can you help me check availability?'
  );
  const waUrl = `https://wa.me/${cleanWAPhone}?text=${promptMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2">
      {/* Tooltip dialog */}
      {showTooltip && (
        <div className="glass relative px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground shadow-xl border border-gold-500/20 max-w-[200px] animate-fade-in mr-2">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1 right-1 p-0.5 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
          <span className="block text-[11px] text-gold-400 mb-0.5">Need assistance?</span>
          <span className="block text-muted-foreground">Chat with us on WhatsApp for instant booking!</span>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setShowTooltip(false)}
        className="flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform duration-300 relative group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-ping group-hover:animate-none" />
        <MessageSquare className="h-6 w-6 fill-white" />
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 border-2 border-background rounded-full" />
      </a>
    </div>
  );
}

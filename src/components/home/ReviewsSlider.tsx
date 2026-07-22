'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  isGoogleReview: boolean;
}

interface ReviewsSliderProps {
  reviews: Review[];
}

export default function ReviewsSlider({ reviews }: ReviewsSliderProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-play loop
  useEffect(() => {
    if (isHovered) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }

    autoplayTimer.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [index, isHovered]);

  const handleNext = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const handleDotClick = (idx: number) => {
    setDirection(idx > index ? 1 : -1);
    setIndex(idx);
  };

  // Motion variants for slide animations
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -150 : 150,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    })
  };

  // Drag thresholds
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const currentReview = reviews[index];

  return (
    <div 
      className="relative max-w-4xl mx-auto px-4 py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px]" />

      <div className="min-h-[280px] flex items-center justify-center relative overflow-hidden px-4 md:px-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                handleNext();
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrev();
              }
            }}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            {/* Main Testimonial Card */}
            <div className="glass border border-border p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[220px]">
              {/* Back quote background decoration */}
              <Quote className="absolute right-6 top-6 h-28 w-28 text-gold-500/[0.03] stroke-[1.5] pointer-events-none" />

              <div className="space-y-6">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4.5 w-4.5 ${
                        idx < currentReview.rating 
                          ? 'fill-gold-500 text-gold-500 text-glow-gold' 
                          : 'text-muted/40'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-base md:text-lg text-foreground font-medium leading-relaxed italic">
                  "{currentReview.text}"
                </p>
              </div>

              {/* Renter Details */}
              <div className="flex items-center justify-between border-t border-border/40 pt-6 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-gold-400">
                    {currentReview.author[0]}
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-foreground">
                      {currentReview.author}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center mt-0.5">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500 shrink-0" />
                      Google Verified Renter
                    </span>
                  </div>
                </div>

                {currentReview.isGoogleReview && (
                  <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 rounded-md border border-gold-500/25">
                    Google Review
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-20">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full glass border border-border text-muted-foreground hover:text-gold-400 hover:border-gold-500/30 transition-all flex items-center justify-center hover:scale-105 active:scale-95"
          aria-label="Previous Review"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 z-20">
        <button
          onClick={handleNext}
          className="p-3 rounded-full glass border border-border text-muted-foreground hover:text-gold-400 hover:border-gold-500/30 transition-all flex items-center justify-center hover:scale-105 active:scale-95"
          aria-label="Next Review"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center space-x-2.5 mt-8">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === index 
                ? 'w-6 bg-gold-500 glow-gold' 
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

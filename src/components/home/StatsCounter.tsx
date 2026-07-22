'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Award, Car, UserCheck, Star } from 'lucide-react';

interface StatItemProps {
  end: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  duration?: number;
  decimals?: number;
}

function Counter({ end, suffix, label, icon, duration = 1.5, decimals = 0 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      const currentVal = progress * end;
      setCount(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  const displayValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return (
    <div
      ref={elementRef}
      className="p-6 md:p-8 rounded-3xl glass border border-border flex flex-col items-center justify-center text-center shadow-xl hover:border-gold-500/20 transition-colors duration-300"
    >
      <div className="p-3.5 bg-gold-500/10 text-gold-400 rounded-2xl mb-4">
        {icon}
      </div>
      <span className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-2">
        {displayValue}
        <span className="text-gold-500">{suffix}</span>
      </span>
      <span className="text-xs md:text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <Counter
        icon={<Car className="h-6 w-6" />}
        end={50}
        suffix="+"
        label="Premium Vehicles"
      />
      <Counter
        icon={<UserCheck className="h-6 w-6" />}
        end={10}
        suffix="K+"
        label="Happy Clients"
      />
      <Counter
        icon={<Star className="h-6 w-6" />}
        end={4.9}
        suffix="/5"
        label="Google Reviews"
        decimals={1}
      />
      <Counter
        icon={<Award className="h-6 w-6" />}
        end={5}
        suffix="+"
        label="Years in Business"
      />
    </div>
  );
}

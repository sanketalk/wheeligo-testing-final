'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp, Vehicle } from '@/context/AppContext';
import { Fuel, ShieldCheck, Heart, GitCompare, Eye } from 'lucide-react';

interface FeaturedFleetProps {
  initialVehicles: Vehicle[];
}

export default function FeaturedFleet({ initialVehicles }: FeaturedFleetProps) {
  const { wishlist, toggleWishlist, addToComparison, comparisonList, removeFromComparison } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'SUV', 'Luxury', 'Electric'];

  const filteredVehicles = activeCategory === 'All'
    ? initialVehicles
    : initialVehicles.filter(v => v.category === activeCategory);

  const handleCompareClick = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.preventDefault();
    if (comparisonList.some(v => v.id === vehicle.id)) {
      removeFromComparison(vehicle.id);
    } else {
      addToComparison(vehicle);
    }
  };

  return (
    <div className="space-y-10">
      {/* Category Tabs */}
      <div className="flex justify-center">
        <div className="flex space-x-2 p-1.5 glass border border-white/5 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat === 'All' ? 'All Vehicles' : `${cat}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((car) => {
          const isWishlisted = wishlist.includes(car.id);
          const isCompared = comparisonList.some(v => v.id === car.id);

          return (
            <div
              key={car.id}
              className="luxury-card glass border border-border rounded-3xl overflow-hidden group flex flex-col h-full"
            >
              {/* Image Showcase */}
              <div className="relative aspect-video bg-black/40 overflow-hidden">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Accent overlay for premium reflection */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                {/* Tags */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur text-gold-400 rounded-md border border-gold-500/20">
                    {car.category}
                  </span>
                  {!car.available && (
                    <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-red-950/80 backdrop-blur text-red-400 rounded-md border border-red-500/20">
                      Booked Out
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(car.id);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 backdrop-blur border border-white/5 hover:border-gold-500/30 text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Add to Wishlist"
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      {car.brand}
                    </span>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-gold-400 transition-colors">
                      {car.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-muted-foreground font-semibold">Self-Drive</span>
                    <span className="text-xl font-black text-gold-400">
                      ₹{car.pricePerDay.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">/day</span>
                  </div>
                </div>

                {/* Features Badges */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-border text-[11px] font-medium text-muted-foreground">
                  <div className="flex items-center space-x-1.5">
                    <Fuel className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                    <span className="truncate">{car.fuelType}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 justify-center">
                    <span className="text-gold-500 font-bold">A/M</span>
                    <span className="truncate">{car.transmission.substring(0, 4)}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 justify-end">
                    <span className="text-gold-500 font-bold">⚙️</span>
                    <span>{car.seats} Seats</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center space-x-3 pt-2 mt-auto">
                  <button
                    onClick={(e) => handleCompareClick(e, car)}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                      isCompared
                        ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                        : 'border-border bg-secondary hover:border-gold-500/30 text-muted-foreground hover:text-foreground'
                    }`}
                    title="Add to Compare"
                  >
                    <GitCompare className="h-4 w-4" />
                  </button>

                  <Link
                    href={`/fleet/${car.id}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-secondary border border-border text-center text-xs font-bold text-foreground hover:border-gold-500/40 hover:bg-accent transition-all flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View & Estimate</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Clock, Search, ArrowRightLeft } from 'lucide-react';

const LOCATIONS = [
  'Jubilee Hills Hub (Main)',
  'Rajiv Gandhi Intl Airport (RGIA)',
  'Hitech City IT Corridor',
  'Gachibowli Financial District',
  'Secunderabad Station Pick-up',
];

export default function HeroSearch() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState(LOCATIONS[0]);
  const [dropoffLocation, setDropoffLocation] = useState(LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('10:00');

  // Set default dates (tomorrow for pickup, +3 days for return)
  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPickupDate(tomorrow.toISOString().split('T')[0]);

    const returnD = new Date();
    returnD.setDate(returnD.getDate() + 4);
    setReturnDate(returnD.toISOString().split('T')[0]);
  }, []);

  const handleSwapLocations = () => {
    const temp = pickupLocation;
    setPickupLocation(dropoffLocation);
    setDropoffLocation(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      pickupDate: `${pickupDate}T${pickupTime}`,
      returnDate: `${returnDate}T${returnTime}`,
    }).toString();

    router.push(`/fleet?${query}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full glass border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Locations Group */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-9 gap-3 items-center relative">
          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-gold-500" />
              Pickup Location
            </label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-secondary/80 border border-border rounded-xl px-3 py-3 text-xs font-medium text-foreground focus:outline-none focus:border-gold-500 transition-colors"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex justify-center pt-5 sm:pt-0">
            <button
              type="button"
              onClick={handleSwapLocations}
              className="h-8 w-8 rounded-full border border-border bg-secondary hover:border-gold-500 text-gold-400 hover:text-gold-300 transition-all flex items-center justify-center shrink-0 hover:scale-105"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 rotate-90 sm:rotate-0" />
            </button>
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-gold-500" />
              Drop-off Location
            </label>
            <select
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full bg-secondary/80 border border-border rounded-xl px-3 py-3 text-xs font-medium text-foreground focus:outline-none focus:border-gold-500 transition-colors"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Time Group */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {/* Pickup Date/Time */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-gold-500" />
              Pickup Date & Time
            </label>
            <div className="flex space-x-1">
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="flex-1 bg-secondary/80 border border-border rounded-xl px-2 py-3 text-xs font-medium text-foreground focus:outline-none focus:border-gold-500"
                required
              />
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-18 bg-secondary/80 border border-border rounded-xl px-1.5 py-3 text-xs font-medium text-foreground focus:outline-none focus:border-gold-500"
                required
              />
            </div>
          </div>

          {/* Return Date/Time */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-gold-500" />
              Return Date & Time
            </label>
            <div className="flex space-x-1">
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="flex-1 bg-secondary/80 border border-border rounded-xl px-2 py-3 text-xs font-medium text-foreground focus:outline-none focus:border-gold-500"
                required
              />
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-18 bg-secondary/80 border border-border rounded-xl px-1.5 py-3 text-xs font-medium text-foreground focus:outline-none focus:border-gold-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Search Button */}
        <div className="lg:col-span-2 pt-4 lg:pt-5 w-full">
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] shadow-lg shadow-gold-500/20"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span>Search Fleet</span>
          </button>
        </div>
      </div>
    </form>
  );
}

import React, { Suspense } from 'react';
import { getVehicles } from '@/app/actions';
import FleetBrowser from '@/components/fleet/FleetBrowser';
import { Sparkles } from 'lucide-react';

export const revalidate = 600; // Cache for 10 minutes

export default async function FleetPage() {
  const vehicles = await getVehicles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass border border-gold-500/20 text-gold-400 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated Premium Fleet</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Browse Our Vehicles
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground/80 font-medium leading-relaxed">
          From silent electric supercars to high-clearance family SUVs, select the perfect vehicle for your next elite journey.
        </p>
      </div>

      {/* Interactive Browser Layout */}
      <Suspense fallback={
        <div className="glass border border-border p-12 rounded-3xl text-center text-xs text-muted-foreground">
          Loading premium fleet browser...
        </div>
      }>
        <FleetBrowser vehicles={vehicles} />
      </Suspense>
    </div>
  );
}

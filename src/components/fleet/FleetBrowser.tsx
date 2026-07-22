'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp, Vehicle } from '@/context/AppContext';
import { Fuel, GitCompare, Eye, SlidersHorizontal, Search, X, Check, ArrowUpDown, Heart } from 'lucide-react';

interface FleetBrowserProps {
  vehicles: Vehicle[];
}

export default function FleetBrowser({ vehicles }: FleetBrowserProps) {
  const searchParams = useSearchParams();
  const { wishlist, toggleWishlist, comparisonList, addToComparison, removeFromComparison, clearComparison } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedSeats, setSelectedSeats] = useState('All');
  const [priceRange, setPriceRange] = useState(30000); // max price filter
  const [sortBy, setSortBy] = useState('popular'); // popular, price-asc, price-desc, rating

  // Show comparison modal
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Read URL search params if present (e.g. from homepage search widget)
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Filtering Logic
  const filteredVehicles = vehicles.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
    const matchesFuel = selectedFuel === 'All' || car.fuelType === selectedFuel;
    const matchesTransmission = selectedTransmission === 'All' || car.transmission === selectedTransmission;
    
    const matchesSeats =
      selectedSeats === 'All' ||
      (selectedSeats === '4' && car.seats <= 4) ||
      (selectedSeats === '5' && car.seats === 5) ||
      (selectedSeats === '7' && car.seats >= 6);

    const matchesPrice = car.pricePerDay <= priceRange;

    return matchesSearch && matchesCategory && matchesFuel && matchesTransmission && matchesSeats && matchesPrice;
  });

  // Sorting Logic
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // Default "Popular" sorted by review count
  });

  const categories = ['All', 'SUV', 'Luxury', 'Electric'];
  const fuelTypes = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions = ['All', 'Automatic', 'Manual'];
  const seatingCapacities = ['All', '4', '5', '7'];

  return (
    <div className="space-y-10 relative">
      {/* Top Filter and Search Bar */}
      <div className="glass border border-border p-6 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by brand, name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/45"
          />
        </div>

        {/* Category Selector */}
        <div className="lg:col-span-4 flex space-x-1 p-1 bg-secondary/80 rounded-xl border border-border">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 py-2 text-center rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-black shadow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="lg:col-span-4 relative flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-xs font-semibold text-foreground focus:outline-none focus:border-gold-500"
          >
            <option value="popular">Sort: Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating: Highest First</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: ADVANCED FILTERS (Sidebar on Desktop) */}
        <div className="lg:col-span-3 glass border border-border p-6 rounded-3xl space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-border">
            <SlidersHorizontal className="h-4 w-4 text-gold-500" />
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Advanced Filters
            </h3>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <label>Max Daily Budget</label>
              <span className="text-gold-400">₹{priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="8000"
              max="30000"
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full accent-gold-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>₹8K/day</span>
              <span>₹30K/day</span>
            </div>
          </div>

          {/* Fuel Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Fuel Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {fuelTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedFuel(type)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    selectedFuel === type
                      ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                      : 'border-border bg-secondary hover:border-gold-500/25 text-muted-foreground'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Transmission
            </label>
            <div className="flex flex-wrap gap-1.5">
              {transmissions.map((trans) => (
                <button
                  key={trans}
                  onClick={() => setSelectedTransmission(trans)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    selectedTransmission === trans
                      ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                      : 'border-border bg-secondary hover:border-gold-500/25 text-muted-foreground'
                  }`}
                >
                  {trans}
                </button>
              ))}
            </div>
          </div>

          {/* Seating Capacity Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Seating Capacity
            </label>
            <div className="flex flex-wrap gap-1.5">
              {seatingCapacities.map((seat) => (
                <button
                  key={seat}
                  onClick={() => setSelectedSeats(seat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                    selectedSeats === seat
                      ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                      : 'border-border bg-secondary hover:border-gold-500/25 text-muted-foreground'
                  }`}
                >
                  {seat === 'All' ? 'All' : `${seat} Seats`}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedFuel('All');
              setSelectedTransmission('All');
              setSelectedSeats('All');
              setPriceRange(30000);
              setSortBy('popular');
            }}
            className="w-full py-2.5 text-center text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all"
          >
            Clear Filters
          </button>
        </div>

        {/* RIGHT COLUMN: VEHICLES GRID */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold">
            <span>Showing {sortedVehicles.length} of {vehicles.length} premium cars</span>
          </div>

          {sortedVehicles.length === 0 ? (
            <div className="glass border border-border p-12 rounded-3xl text-center space-y-4">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-bold text-lg text-foreground">No matches found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Adjust your price range, change fuel preferences, or simplify your search query to find available vehicles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedVehicles.map((car) => {
                const isWishlisted = wishlist.includes(car.id);
                const isCompared = comparisonList.some((v) => v.id === car.id);

                return (
                  <div
                    key={car.id}
                    className="luxury-card glass border border-border rounded-3xl overflow-hidden group flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-video bg-black/40 overflow-hidden">
                      <img
                        src={car.image}
                        alt={`${car.brand} ${car.name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur text-gold-400 rounded-md border border-gold-500/20">
                          {car.category}
                        </span>
                      </div>

                      {/* Wishlist */}
                      <button
                        onClick={() => toggleWishlist(car.id)}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 backdrop-blur border border-white/5 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">
                              {car.brand}
                            </span>
                            <h4 className="text-base font-bold text-foreground group-hover:text-gold-400 transition-colors">
                              {car.name}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-gold-400">
                              ₹{car.pricePerDay.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-muted-foreground block">/day</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-[10px] font-medium text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Fuel className="h-3 w-3 text-gold-500" />
                          <span>{car.fuelType}</span>
                        </div>
                        <div className="flex items-center space-x-1 justify-end">
                          <span>⚙️</span>
                          <span>{car.transmission}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <button
                          onClick={() => {
                            if (isCompared) removeFromComparison(car.id);
                            else addToComparison(car);
                          }}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                            isCompared
                              ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                              : 'border-border bg-secondary hover:border-gold-500/30 text-muted-foreground hover:text-foreground'
                          }`}
                          title="Add to Compare"
                        >
                          <GitCompare className="h-3.5 w-3.5" />
                        </button>
                        <Link
                          href={`/fleet/${car.id}`}
                          className="flex-grow py-2.5 rounded-xl bg-secondary border border-border text-center text-[11px] font-bold text-foreground hover:border-gold-500/40 hover:bg-accent transition-all flex items-center justify-center space-x-2"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FLOAT COMPENSATING DRAWER FOR COMPARE */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass border border-gold-500/25 px-5 py-3 rounded-2xl flex items-center space-x-6 shadow-2xl animate-bounce-subtle">
          <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
            <GitCompare className="h-4 w-4 text-gold-500 animate-pulse" />
            <span>Compare Vehicles ({comparisonList.length}/3)</span>
          </div>

          <div className="flex space-x-1.5">
            {comparisonList.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-secondary text-[10px] font-semibold text-gold-400 border border-border"
              >
                {c.name}
                <button
                  onClick={() => removeFromComparison(c.id)}
                  className="ml-1.5 text-muted-foreground hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-[10px] font-bold transition-colors"
            >
              Compare Specs
            </button>
            <button
              onClick={clearComparison}
              className="text-[10px] font-bold text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE SPECS MODAL OVERLAY */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass border border-border w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-black/40">
              <h3 className="font-bold text-base text-foreground flex items-center space-x-2">
                <GitCompare className="h-5 w-5 text-gold-500" />
                <span>Side-by-Side Car Specifications Comparison</span>
              </h3>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-1.5 rounded-lg border border-border bg-secondary hover:text-gold-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-x-auto p-6">
              <table className="w-full border-collapse text-left text-xs text-muted-foreground">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 font-bold text-foreground w-1/4">Specs Key</th>
                    {comparisonList.map((car) => (
                      <th key={car.id} className="py-4 px-4 font-bold text-foreground text-center">
                        <div className="space-y-2">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="h-16 object-cover rounded bg-secondary mx-auto border border-border"
                          />
                          <span className="block text-sm font-black text-gold-400">
                            {car.brand} {car.name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-3 font-bold text-foreground">Category</td>
                    {comparisonList.map((car) => (
                      <td key={car.id} className="py-3 px-4 text-center text-foreground font-semibold">
                        {car.category}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-foreground">Rent per Day</td>
                    {comparisonList.map((car) => (
                      <td key={car.id} className="py-3 px-4 text-center text-gold-400 font-extrabold text-sm">
                        ₹{car.pricePerDay.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-foreground">Security Deposit</td>
                    {comparisonList.map((car) => (
                      <td key={car.id} className="py-3 px-4 text-center">
                        ₹{car.securityDeposit.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-foreground">Fuel Type</td>
                    {comparisonList.map((car) => (
                      <td key={car.id} className="py-3 px-4 text-center">
                        {car.fuelType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-foreground">Transmission</td>
                    {comparisonList.map((car) => (
                      <td key={car.id} className="py-3 px-4 text-center">
                        {car.transmission}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-foreground">Seating Capacity</td>
                    {comparisonList.map((car) => (
                      <td key={car.id} className="py-3 px-4 text-center">
                        {car.seats} Seats
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-foreground">Luggage Volume</td>
                    {comparisonList.map((car) => (
                      <td key={car.id} className="py-3 px-4 text-center">
                        {car.luggage} Standard Bags
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-foreground vertical-top">Features & Amenities</td>
                    {comparisonList.map((car) => (
                      <td key={car.id} className="py-3 px-4 text-center max-w-[200px] leading-relaxed">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {car.features.split(',').map((f) => (
                            <span
                              key={f}
                              className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-semibold border border-border text-foreground"
                            >
                              {f.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-foreground">Actions</td>
                    {comparisonList.map((car) => (
                      <td key={car.id} className="py-4 px-4 text-center">
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <Link
                            href={`/fleet/${car.id}`}
                            onClick={() => setIsCompareOpen(false)}
                            className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-[10px] font-bold"
                          >
                            Go Book
                          </Link>
                          <button
                            onClick={() => removeFromComparison(car.id)}
                            className="px-3 py-1.5 rounded-lg border border-border text-[10px] hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

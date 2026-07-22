'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp, Vehicle } from '@/context/AppContext';
import { createBooking, createReview } from '@/app/actions';
import {
  Calendar, MapPin, Fuel, Shield, MessageSquare, Info, Star,
  CheckCircle, PlusCircle, Check, Sparkles, Phone, Award,
  Smartphone, ShieldAlert, BadgeCheck, HelpCircle
} from 'lucide-react';

interface VehicleDetailContainerProps {
  vehicle: any; // includes reviews
  similarVehicles: Vehicle[];
}

const LOCATIONS = [
  'Jubilee Hills Hub (Main)',
  'Rajiv Gandhi Intl Airport (RGIA)',
  'Hitech City IT Corridor',
  'Gachibowli Financial District',
  'Secunderabad Station Pick-up',
];

const ADDONS = [
  { id: 'gps', name: 'GPS Navigation', price: 300, desc: 'Avoid roaming and stay on track.' },
  { id: 'childSeat', name: 'Child Safety Seat', price: 500, desc: 'Necessary protection for toddlers.' },
  { id: 'addDriver', name: 'Additional Driver', price: 500, desc: 'Register another driver to take turns.' },
  { id: 'dashcam', name: 'Premium Dashcam', price: 300, desc: 'Record your scenic road trip safeties.' },
  { id: 'charger', name: 'Fast Mobile Charger', price: 150, desc: 'Keep your devices topped up.' },
  { id: 'wifi', name: 'Portable Wi-Fi Hotspot', price: 400, desc: 'Stay connected on high-speed internet.' },
  { id: 'insurance', name: 'Zero-Dep Premium Insurance', price: 1000, desc: 'Zero excess liability for body panels.' },
  { id: 'roadside', name: 'Elite Roadside Assistance', price: 200, desc: 'Instant mechanical support 24/7.' }
];

export default function VehicleDetailContainer({ vehicle, similarVehicles }: VehicleDetailContainerProps) {
  const router = useRouter();
  const { user } = useApp();

  // Booking Calculator State
  const [pickupLoc, setPickupLoc] = useState(LOCATIONS[0]);
  const [dropoffLoc, setDropoffLoc] = useState(LOCATIONS[0]);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('10:00');
  
  // Selected add-ons list
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  // Quote Output States
  const [durationDays, setDurationDays] = useState(1);
  const [pricing, setPricing] = useState({
    baseRent: 0,
    addonsTotal: 0,
    subtotal: 0,
    tax: 0,
    grandTotal: 0,
  });

  // Review Form States
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');

  // Gallery Active Image
  const [activeImage, setActiveImage] = useState(vehicle.image);

  // Initialize dates
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPickupDate(tomorrow.toISOString().split('T')[0]);

    const returnD = new Date();
    returnD.setDate(returnD.getDate() + 4);
    setReturnDate(returnD.toISOString().split('T')[0]);
  }, []);

  // Calculate duration and prices when dates/add-ons change
  useEffect(() => {
    if (!pickupDate || !returnDate) return;

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    
    if (end.getTime() <= start.getTime()) {
      setDurationDays(1);
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    setDurationDays(days);

    const base = vehicle.pricePerDay * days;
    
    // Sum selected addons
    const addonsCost = ADDONS.reduce((sum, addon) => {
      if (selectedAddons.includes(addon.id)) {
        return sum + (addon.price * days);
      }
      return sum;
    }, 0);

    const sub = base + addonsCost;
    const gst = sub * 0.18;
    const total = sub + gst;

    setPricing({
      baseRent: base,
      addonsTotal: addonsCost,
      subtotal: sub,
      tax: gst,
      grandTotal: total
    });
  }, [pickupDate, pickupTime, returnDate, returnTime, selectedAddons, vehicle]);

  const handleAddonClick = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);

    if (end.getTime() <= start.getTime()) {
      alert('Return date/time must be after pickup date/time.');
      return;
    }

    setIsBooking(true);
    
    // Build comma-separated list of selected addons
    const extrasList = ADDONS
      .filter(a => selectedAddons.includes(a.id))
      .map(a => a.name)
      .join(', ') || 'None';

    try {
      const result = await createBooking({
        customerName: user ? user.name : 'Guest Customer',
        customerEmail: user ? user.email : 'guest@wheeligo.com',
        customerPhone: user ? user.phone : '+919876543210',
        pickupLocation: pickupLoc,
        dropoffLocation: dropoffLoc,
        pickupDate: start,
        returnDate: end,
        vehicleId: vehicle.id,
        extras: extrasList,
        totalPrice: Math.round(pricing.grandTotal),
      });

      if (result.success && result.waUrl) {
        // Log booking success in storage for mock tracking
        const storedBookings = localStorage.getItem('wheeligo-bookings') || '[]';
        const bookingsList = JSON.parse(storedBookings);
        bookingsList.push({
          id: result.bookingId,
          vehicleName: `${vehicle.brand} ${vehicle.name}`,
          pickupLocation: pickupLoc,
          dropoffLocation: dropoffLoc,
          pickupDate: start,
          returnDate: end,
          price: Math.round(pricing.grandTotal),
          status: 'PENDING',
        });
        localStorage.setItem('wheeligo-bookings', JSON.stringify(bookingsList));

        // Open WhatsApp booking thread
        window.open(result.waUrl, '_blank');
        router.push('/dashboard');
      } else {
        alert(result.error || 'Failed to initialize booking.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewText) {
      setReviewStatus('Name and comment are required.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewStatus('');

    try {
      const response = await createReview({
        author: reviewerName,
        rating,
        text: reviewText,
        vehicleId: vehicle.id
      });

      if (response.success) {
        setReviewStatus('SUCCESS');
        setReviewerName('');
        setReviewText('');
        // Reload details page
        router.refresh();
      } else {
        setReviewStatus(response.error || 'Failed to submit review.');
      }
    } catch (error) {
      console.error(error);
      setReviewStatus('Failed to submit review due to networking errors.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const featureList = vehicle.features.split(',').map((f: string) => f.trim());

  return (
    <div className="space-y-16 pb-24 relative">
      {/* Immersive Top Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Gallery & Specification Specs */}
        <div className="lg:col-span-7 space-y-8">
          {/* Gallery Widget */}
          <div className="glass border border-border rounded-3xl overflow-hidden shadow-xl space-y-4 p-4">
            <div className="aspect-[16/10] bg-black/40 rounded-2xl overflow-hidden relative">
              <img
                src={activeImage}
                alt={`${vehicle.brand} ${vehicle.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Simulated Thumbnails (Luxury multi-view) */}
            <div className="flex space-x-3">
              {[vehicle.image, vehicle.image].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-video w-24 bg-black/40 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-gold-500 scale-[1.02]' : 'border-transparent opacity-75'
                  }`}
                >
                  <img src={img} alt="Vehicle angle" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Specification Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Transmission', value: vehicle.transmission, sub: 'Automatic / Manual' },
              { label: 'Fuel & Engine', value: vehicle.fuelType, sub: 'Optimized efficiency' },
              { label: 'Seating Capacity', value: `${vehicle.seats} Adults`, sub: 'Spacious leather seats' },
              { label: 'Luggage Hold', value: `${vehicle.luggage} bags`, sub: 'Luggage space capacity' },
            ].map((spec, i) => (
              <div key={i} className="p-4 rounded-2xl glass border border-border text-center">
                <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">
                  {spec.label}
                </span>
                <span className="block text-sm font-black text-foreground">{spec.value}</span>
                <span className="block text-[9px] text-muted-foreground/60">{spec.sub}</span>
              </div>
            ))}
          </div>

          {/* Features and Amenities list */}
          <div className="glass border border-border p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border pb-3">
              Features & Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {featureList.map((feature: string) => (
                <div key={feature} className="flex items-center space-x-2 text-xs text-muted-foreground/90">
                  <CheckCircle className="h-4.5 w-4.5 text-gold-500 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Policies Tabs */}
          <div className="glass border border-border p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border pb-3">
              Rental Policies & Protection
            </h3>
            <div className="space-y-4 text-xs text-muted-foreground">
              <div className="flex items-start space-x-3 p-3 bg-secondary/35 rounded-xl border border-border">
                <Shield className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-foreground mb-0.5">Insurance Policy</span>
                  <p className="leading-relaxed text-[11px]">{vehicle.insuranceDetails}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-secondary/35 rounded-xl border border-border">
                <Fuel className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-foreground mb-0.5">Fuel Policy</span>
                  <p className="leading-relaxed text-[11px]">{vehicle.fuelPolicy}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-secondary/35 rounded-xl border border-border">
                <Info className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-foreground mb-0.5">Cancellation Policy</span>
                  <p className="leading-relaxed text-[11px]">{vehicle.cancellationPolicy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Live Quote Calculator */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="glass border border-border p-6 rounded-3xl shadow-xl space-y-5">
            <div>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                {vehicle.brand}
              </span>
              <h2 className="text-2xl font-black text-foreground">{vehicle.name}</h2>
              <div className="flex items-center space-x-1.5 mt-1">
                <div className="flex text-gold-400">
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
                <span className="text-xs font-bold text-foreground">{vehicle.rating}</span>
                <span className="text-xs text-muted-foreground">({vehicle.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* Locations */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-gold-500" />
                    Pickup Hub
                  </label>
                  <select
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-500"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-gold-500" />
                    Drop-off Hub
                  </label>
                  <select
                    value={dropoffLoc}
                    onChange={(e) => setDropoffLoc(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold-500"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gold-500" />
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl px-2.5 py-2.5 text-xs text-foreground focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gold-500" />
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl px-2.5 py-2.5 text-xs text-foreground focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Addons Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Select Add-ons (Per Day)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleAddonClick(addon.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer select-none transition-all flex items-start space-x-2 ${
                          isChecked
                            ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                            : 'border-border bg-secondary hover:border-gold-500/15'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <div className="h-3.5 w-3.5 rounded bg-gold-500 text-black flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="h-3.5 w-3.5 rounded border border-muted" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[11px] font-bold truncate text-foreground">{addon.name}</span>
                          <span className="block text-[9px] text-muted-foreground">₹{addon.price}/day</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Cost Output */}
              <div className="p-4 bg-black/50 border border-border rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Daily Rate</span>
                  <span>₹{vehicle.pricePerDay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rental Duration</span>
                  <span className="text-gold-400 font-bold">{durationDays} Day{durationDays > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Rent</span>
                  <span>₹{pricing.baseRent.toLocaleString()}</span>
                </div>
                {pricing.addonsTotal > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Add-ons Cost</span>
                    <span>₹{pricing.addonsTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>GST Tax (18%)</span>
                  <span>₹{Math.round(pricing.tax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground font-black text-sm pt-2 border-t border-border">
                  <span>Estimated Total</span>
                  <span className="text-gold-400 text-glow-gold">₹{Math.round(pricing.grandTotal).toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-muted-foreground/60 border-t border-border pt-1.5">
                  Refundable deposit of **₹{vehicle.securityDeposit.toLocaleString()}** to be paid separately.
                </div>
              </div>

              {/* WhatsApp submit button */}
              <button
                type="submit"
                disabled={isBooking}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Phone className="h-4 w-4 fill-black shrink-0" />
                <span>{isBooking ? 'Generating Summary...' : 'Book via WhatsApp'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Post Review Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t border-border">
        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-bold text-lg text-foreground flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-gold-500" />
            <span>Customer Reviews ({vehicle.reviews.length})</span>
          </h3>

          {vehicle.reviews.length === 0 ? (
            <div className="p-8 rounded-2xl glass border border-border text-center text-xs text-muted-foreground">
              No reviews yet for this vehicle. Be the first to share your driving experience!
            </div>
          ) : (
            <div className="space-y-4">
              {vehicle.reviews.map((rev: any) => (
                <div key={rev.id} className="p-5 rounded-2xl glass border border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block font-bold text-xs text-foreground">{rev.author}</span>
                      <span className="block text-[9px] text-muted-foreground">{new Date(rev.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex text-gold-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-muted'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review form */}
        <div className="lg:col-span-5">
          <div className="glass border border-border p-6 rounded-3xl space-y-4">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Share Your Experience
            </h4>

            {reviewStatus === 'SUCCESS' ? (
              <div className="p-4 bg-green-500/10 text-green-400 text-xs border border-green-500/20 rounded-xl text-center font-bold">
                Review posted successfully! Thank you for sharing.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Your Name</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Rohit Sharma"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-xs text-foreground focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase block">Rating</label>
                  <div className="flex space-x-1 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-gold-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`h-5 w-5 ${star <= rating ? 'fill-current' : 'text-muted'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Comment</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="How was the acceleration, cleanliness, and delivery?"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-xs text-foreground focus:outline-none resize-none"
                    required
                  />
                </div>

                {reviewStatus && reviewStatus !== 'SUCCESS' && (
                  <div className="text-red-400 text-xs font-semibold">
                    {reviewStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold transition-colors"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Similar Vehicles Recommendation */}
      <div className="space-y-6 pt-8 border-t border-border">
        <h3 className="font-bold text-lg text-foreground flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-gold-500 animate-pulse" />
          <span>Similar Vehicles You May Like</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarVehicles.slice(0, 3).map((car) => (
            <div
              key={car.id}
              className="glass border border-border rounded-2xl overflow-hidden group hover:border-gold-500/20 transition-all duration-300"
            >
              <div className="aspect-video bg-black/40 overflow-hidden relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase block">{car.brand}</span>
                  <span className="font-bold text-sm text-foreground">{car.name}</span>
                </div>
                <Link
                  href={`/fleet/${car.id}`}
                  className="px-3 py-1.5 rounded-lg bg-secondary border border-border hover:border-gold-500/40 text-[10px] font-bold text-foreground"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STICKY BOTTOM BOOKING FOOTER BAR (MOBILE SPECIFIC ACTION) */}
      <div className="fixed bottom-0 left-0 w-full glass border-t border-border py-3 px-4 flex items-center justify-between md:hidden z-30 shadow-2xl">
        <div>
          <span className="text-[9px] text-muted-foreground block font-bold uppercase">Rent Rate</span>
          <span className="text-base font-black text-gold-400">₹{vehicle.pricePerDay.toLocaleString()}/day</span>
        </div>
        <button
          onClick={handleBookingSubmit}
          disabled={isBooking}
          className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black font-black text-xs uppercase tracking-wide flex items-center space-x-1.5 shadow-lg shadow-gold-500/25 animate-pulse"
        >
          <Phone className="h-3.5 w-3.5 fill-black shrink-0" />
          <span>{isBooking ? 'Wait...' : 'Book via WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { getVehicles, getReviews, getBlogs } from '@/app/actions';
import HeroSearch from '@/components/home/HeroSearch';
import FeaturedFleet from '@/components/home/FeaturedFleet';
import StatsCounter from '@/components/home/StatsCounter';
import HomeFaqs from '@/components/home/HomeFaqs';
import QuickInquiry from '@/components/home/QuickInquiry';
import ReviewsSlider from '@/components/home/ReviewsSlider';
import { ShieldCheck, Sparkles, Map, PhoneCall, Compass, CheckCircle2, ChevronRight, UserCheck, Star } from 'lucide-react';

export const revalidate = 3600; // Cache page for 1 hour

export default async function HomePage() {
  // Parallel fetch of home screen data
  const [vehicles, reviews, blogs] = await Promise.all([
    getVehicles(),
    getReviews(),
    getBlogs(),
  ]);

  const featuredFleet = vehicles.filter((v: any) => v.featured);
  const googleReviews = reviews.filter((r: any) => r.isGoogleReview);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION WITH CINEMATIC BACKGROUND */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 -mt-20">
        {/* Luxury backdrop overlays */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/60 z-10" />
        
        {/* Dynamic mesh gradient backdrops */}
        <div className="absolute inset-0 -z-10 bg-radial-gradient">
          <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-gold-500/5 dark:bg-gold-600/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-gold-400/5 blur-[150px] animate-pulse [animation-delay:2s]" />
        </div>

        {/* Ambient Darkened Studio Grid lines */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center space-y-12">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-gold-500/25 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-widest animate-fade-in shadow-md shadow-gold-500/5">
            <Sparkles className="h-4.5 w-4.5" />
            <span>Sensational Drives, Unparalleled Luxury</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Prestige Self-Drive <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-600 to-gold-800 dark:from-gold-400 dark:via-gold-200 dark:to-gold-500 dark:text-glow-gold">
                Car Rentals
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground/80 font-medium max-w-2xl mx-auto leading-relaxed">
              Skip the ordinary. Drive the extraordinary. Handpicked selection of Tesla, Porsche, BMW, and Mercedes. Direct WhatsApp booking, zero hidden charges.
            </p>
          </div>

          {/* Vehicle Search Widget */}
          <div className="max-w-5xl mx-auto pt-6">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsCounter />
      </section>

      {/* 3. FEATURED FLEET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block">
            Our Elite Fleet
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Select Your Machine
          </h2>
          <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto font-medium">
            Explore premium crossovers, electric supercars, and executive saloons, configured for performance and comfort.
          </p>
        </div>

        <FeaturedFleet initialVehicles={featuredFleet.length > 0 ? featuredFleet : vehicles.slice(0, 3)} />
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block">
            The Wheeligo Standards
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Engineered For Trust
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Zero Depreciation Insurance',
              desc: 'Every rental includes comprehensive zero depreciation cover. Your financial liability is strictly capped, giving you total peace of mind.',
              icon: <ShieldCheck className="h-6 w-6 text-gold-400" />
            },
            {
              title: 'Premium Doorstep Delivery',
              desc: 'Your selected vehicle is detailed, sanitized, and delivered straight to your home, office, or airport terminal, fully ready for the road.',
              icon: <Compass className="h-6 w-6 text-gold-400" />
            },
            {
              title: '24/7 Roadside Assistance',
              desc: 'Flat tire? Battery issue? Our dedicated mechanical support team is on standby 24 hours a day, 7 days a week, across all routes.',
              icon: <PhoneCall className="h-6 w-6 text-gold-400" />
            }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl glass border border-border space-y-4 hover:border-gold-500/20 transition-all duration-300">
              <div className="p-3 bg-gold-500/10 rounded-2xl w-fit">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="relative border-y border-border py-20 bg-secondary/20">
        <div className="absolute inset-0 -z-10 bg-radial-gradient">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-gold-500/5 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block">
              Direct & Frictionless
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Four Steps to Drive
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Choose Your Car', desc: 'Select your vehicle, customize your pick-up times, and add any options.' },
              { step: '02', title: 'Generate Quote', desc: 'Verify estimated rent, deposits, and add-on pricing instantly.' },
              { step: '03', title: 'Inquire on WhatsApp', desc: 'Click to transfer details via pre-filled text. Confirm availability.' },
              { step: '04', title: 'Upload KYC & Drive', desc: 'Complete DL verification online, pay security deposit, and take delivery.' }
            ].map((item, i) => (
              <div key={i} className="relative space-y-3 p-4">
                <span className="block text-4xl font-black text-gold-500/25 tracking-wider font-mono">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS & TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block">
            Verified Experiences
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            What Drivers Say
          </h2>
        </div>

        <ReviewsSlider reviews={googleReviews.length > 0 ? googleReviews : reviews} />
      </section>



      {/* 8. FAQs & CALLBACK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block">
              Got Questions?
            </span>
            <h2 className="text-3xl font-black tracking-tight">
              Frequently Asked
            </h2>
          </div>
          <HomeFaqs />
        </div>

        {/* Callback Form */}
        <div className="lg:col-span-5">
          <QuickInquiry />
        </div>
      </section>
    </div>
  );
}

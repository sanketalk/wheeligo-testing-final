import React from 'react';
import { Compass, ShieldCheck, HeartHandshake, Eye, Award, Users, Star, Car } from 'lucide-react';

export const metadata = {
  title: 'About Us | Wheeligo Premium Car Rentals',
  description: 'Learn about Wheeligo, our journey, mission, and why we are the city\'s most trusted self-drive car rental company.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* 1. Intro Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block">
          Our Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Redefining Self-Drive
        </h1>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Founded in 2021, Wheeligo was born out of a simple passion: to make driving luxury vehicles accessible, straightforward, and secure, without the overheads of ownership.
        </p>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Vehicles', val: '50+', desc: 'Premium hand-detailed fleet' },
          { label: 'Renters', val: '10K+', desc: 'Satisfied local & global clients' },
          { label: 'Google Rating', val: '4.9★', desc: 'Top rated in the metropolis' },
          { label: 'Cities', val: '3+', desc: 'Expanding luxury hubs' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl glass border border-border text-center">
            <span className="block text-3xl font-black text-gold-400 mb-1">{stat.val}</span>
            <span className="block text-xs font-bold text-foreground mb-1 uppercase tracking-wide">{stat.label}</span>
            <span className="block text-[10px] text-muted-foreground/70">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* 3. Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="p-8 rounded-3xl glass border border-border space-y-4">
          <div className="p-3 bg-gold-500/10 text-gold-400 rounded-2xl w-fit">
            <Eye className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Our Vision</h2>
          <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
            To become the premier platform for on-demand high-performance and luxury mobility. We envision a future where accessing a premium sports car, a smart electric utility vehicle, or an executive sedan is as seamless as a click on WhatsApp, making traditional car ownership an option, not a necessity.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass border border-border space-y-4">
          <div className="p-3 bg-gold-500/10 text-gold-400 rounded-2xl w-fit">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Our Mission</h2>
          <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed">
            To deliver an uncompromising self-drive experience through a meticulously curated fleet, absolute billing transparency, and zero depreciation coverage. We commit to reliability, ensuring every vehicle is delivered showroom-clean and backed by robust roadside safety protocols.
          </p>
        </div>
      </div>

      {/* 4. Core Values */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Our Pillars of Excellence</h2>
          <p className="text-xs text-muted-foreground">Why elite renters trust Wheeligo for their journeys</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Meticulous Inspections',
              desc: 'Every vehicle undergoes a rigid 150-point diagnostic check before dispatch. We examine engine compression, battery states, tire tread, and digital systems.',
              icon: <ShieldCheck className="h-5 w-5 text-gold-400" />
            },
            {
              title: 'Concierge Deliveries',
              desc: 'We respect your schedule. Our uniformed delivery agents drop off and pick up the vehicles at your doorstep, detailed inside and out.',
              icon: <Award className="h-5 w-5 text-gold-400" />
            },
            {
              title: 'Uncompromised Integrity',
              desc: 'We operate with zero hidden charges. No fuel surcharges, no surprise fees, and a transparent security deposit refund tracking program.',
              icon: <HeartHandshake className="h-5 w-5 text-gold-400" />
            }
          ].map((v, i) => (
            <div key={i} className="space-y-3 p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary border border-border rounded-xl text-gold-400">
                  {v.icon}
                </div>
                <h3 className="font-bold text-sm text-foreground">{v.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground/85 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Search, Plus, Minus, HelpCircle, FileText, Settings, ShieldAlert, BadgeCent } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All FAQs', icon: <HelpCircle className="h-4 w-4" /> },
  { id: 'kyc', name: 'KYC & Verification', icon: <FileText className="h-4 w-4" /> },
  { id: 'policy', name: 'Fuel & Speed Policy', icon: <Settings className="h-4 w-4" /> },
  { id: 'insurance', name: 'Insurance & Claims', icon: <ShieldAlert className="h-4 w-4" /> },
  { id: 'payment', name: 'Deposits & Payments', icon: <BadgeCent className="h-4 w-4" /> }
];

const FAQS = [
  {
    category: 'kyc',
    q: 'What documents are required to book a car?',
    a: 'Renters must provide a valid Driving License (DL) with at least 3 years of active driving history, and an Aadhaar Card or PAN Card (for domestic renters). International renters must supply a valid Passport and International Driving Permit (IDP).'
  },
  {
    category: 'kyc',
    q: 'Can someone else drive the car during the trip?',
    a: 'Only the primary driver registered during booking is authorized to drive. To register another driver, select the "Additional Driver" add-on service during checkout and upload their license details for KYC approval.'
  },
  {
    category: 'policy',
    q: 'What is the fuel policy?',
    a: 'We operate on a strict "Full to Full" policy. The car is delivered to you with a full tank of fuel and must be returned full. If not, refueling charges plus a service fee of ₹500 will apply. For EVs, the car is delivered with at least 80% charge and must be returned with 50% or more.'
  },
  {
    category: 'policy',
    q: 'Is there a speed limit?',
    a: 'To ensure safety and comply with local regulations, a speed limit of 120 km/h is monitored on national highways, and 80 km/h in urban zones. Exceeding 120 km/h triggers system alerts and a penalty of ₹1,000 per violation.'
  },
  {
    category: 'policy',
    q: 'Is there a limit on daily kilometers?',
    a: 'Each booking includes a daily allowance of 250 km. Cumulative kilometers above this cap are charged starting at ₹15/km depending on the vehicle class.'
  },
  {
    category: 'insurance',
    q: 'What insurance is included with the rental?',
    a: 'Every car comes with zero-depreciation comprehensive insurance covering third-party liability and damage to the car. Your financial liability for minor body damage is capped at the security deposit amount, provided speed limits and policies were followed.'
  },
  {
    category: 'insurance',
    q: 'What happens in case of an accident or breakdown?',
    a: 'In case of any incident, immediately contact our 24/7 Roadside Assistance helpline (+91 74394 97628). Do not attempt to move the vehicle or authorize repairs without our consent. Take photos and register a police report if necessary.'
  },
  {
    category: 'payment',
    q: 'When and how do I pay the security deposit?',
    a: 'The refundable security deposit is charged via bank transfer or credit card hold 24 hours prior to vehicle dispatch. Online booking inquiries do not require immediate payments as we approve bookings via WhatsApp first.'
  },
  {
    category: 'payment',
    q: 'How long does it take to refund the security deposit?',
    a: 'Once the vehicle is returned and inspected, the refund is processed within 48 to 72 hours. Processing times depend on your bank (UPI/Netbanking refunds are usually instant once approved).'
  }
];

export default function FaqsBrowser() {
  const [activeCat, setActiveCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCat === 'all' || faq.category === activeCat;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (idx: number) => {
    if (openIdx === idx) {
      setOpenIdx(null);
    } else {
      setOpenIdx(idx);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar: Categories */}
      <div className="lg:col-span-4 space-y-4">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none"
          />
        </div>

        <div className="glass border border-border p-4 rounded-3xl space-y-2 flex flex-col">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCat(cat.id);
                setOpenIdx(null);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeCat === cat.id
                  ? 'bg-gold-500 text-black'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="lg:col-span-8 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass border border-border text-xs text-muted-foreground">
            No matches found. Try searching for other keywords like "fuel", "deposit", "speed", or "license".
          </div>
        ) : (
          filteredFaqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="rounded-2xl glass border border-border overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-xs md:text-sm text-foreground hover:text-gold-400"
                >
                  <span>{faq.q}</span>
                  <span className={`p-1 rounded-lg bg-secondary text-gold-500 border border-border transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[250px] border-t border-border opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="p-5 text-xs md:text-sm text-muted-foreground/80 leading-relaxed bg-secondary/15">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'What documents are required for KYC verification?',
    a: 'To rent a car, you must submit a valid Driving License (DL) with at least 3 years of active driving history, along with an Aadhaar Card or PAN Card. For international customers, a valid Passport and International Driving Permit (IDP) are required.',
  },
  {
    q: 'What is your fuel policy?',
    a: 'We operate on a "Full to Full" fuel policy. The car is delivered to you with a full tank of fuel, and you must return it with a full tank. For electric vehicles (EVs), we deliver them with at least 80% charge and expect them to be returned with at least 50% charge.',
  },
  {
    q: 'How does the security deposit work and when is it refunded?',
    a: 'A refundable security deposit (varying between ₹15,000 to ₹35,000 depending on the vehicle class) is charged before vehicle delivery. The deposit is refunded to your bank account within 48 to 72 hours after the vehicle is returned and inspected for minor damages or traffic violations.',
  },
  {
    q: 'Is there a speed limit or mileage limit on your cars?',
    a: 'Yes, for safety, our speed limit is set at 120 km/h on expressways and 80 km/h on other roads. Our rentals come with a generous daily mileage limit of 250 km. Additional kilometers driven are charged starting at ₹15/km depending on the vehicle.',
  },
  {
    q: 'Are your vehicles insured? What is my liability in an accident?',
    a: 'Yes, all Wheeligo cars are covered under comprehensive zero-depreciation insurance. In the unfortunate event of an accident, your maximum liability is limited to the security deposit amount, provided you were complying with our speed limit, driving license, and traffic policies.',
  },
];

export default function HomeFaqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className="rounded-2xl glass border border-border overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleFaq(idx)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-sm md:text-base text-foreground hover:text-gold-400 transition-colors"
            >
              <span>{faq.q}</span>
              <span className={`p-1 rounded-lg bg-secondary/80 text-gold-500 border border-border transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>

            {/* Accordion body wrapper */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[300px] border-t border-border opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <div className="p-5 text-xs md:text-sm text-muted-foreground/80 leading-relaxed bg-secondary/20">
                {faq.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

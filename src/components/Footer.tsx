'use client';

import React from 'react';
import Link from 'next/link';
import { Car, Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck, HeartHandshake, Compass } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Local Business SEO Schema
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'CarRentalBusiness',
    'name': 'Wheeligo Self-Drive Car Rentals',
    'image': 'https://wheeligo.com/images/og-share.jpg',
    '@id': 'https://wheeligo.com/#rental',
    'url': 'https://wheeligo.com',
    'telephone': '+917439497628',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '101, Luxury Drive Road, Jubilee Hills',
      'addressLocality': 'Hyderabad',
      'postalCode': '500033',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 17.43,
      'longitude': 78.40
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '09:00',
      'closes': '21:00'
    },
    'sameAs': [
      'https://www.facebook.com/wheeligo',
      'https://www.instagram.com/wheeligo',
      'https://www.twitter.com/wheeligo'
    ]
  };

  return (
    <footer className="relative border-t border-border bg-black pt-16 pb-8 text-muted-foreground overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-gold-500/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-gold-500/5 blur-[120px]" />

      {/* SEO Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg">
                <Car className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-wider uppercase text-foreground">
                Wheeligo
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground/80">
              Experience the pinnacle of self-drive luxury. From pure electric performance to executive cruisers, rent your dream machine on a flexible schedule with direct WhatsApp support.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              {/* Trust Badges */}
              <div className="flex items-center space-x-1.5 text-xs text-foreground font-semibold">
                <ShieldCheck className="h-4 w-4 text-gold-500" />
                <span>Zero Dep Cover</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-foreground font-semibold">
                <HeartHandshake className="h-4 w-4 text-gold-500" />
                <span>24/7 Roadside</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">
              Our Services
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/fleet?category=Luxury" className="hover:text-gold-400 transition-colors">
                  Luxury Sedan Hire
                </Link>
              </li>
              <li>
                <Link href="/fleet?category=Electric" className="hover:text-gold-400 transition-colors">
                  Tesla & Electric Rentals
                </Link>
              </li>
              <li>
                <Link href="/fleet?category=SUV" className="hover:text-gold-400 transition-colors">
                  Premium SUV fleet
                </Link>
              </li>
              <li>
                <Link href="/fleet" className="hover:text-gold-400 transition-colors">
                  All Self-Drive Cars
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">
              Information
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  About Wheeligo
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-gold-400 transition-colors">
                  Rental Policies & FAQs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gold-400 transition-colors">
                  Travel & Driving Blogs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-gold-400 transition-colors">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">
              Store Location & Contact
            </h3>
            <ul className="space-y-4 text-sm text-muted-foreground/80">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-gold-500 shrink-0 mt-0.5" />
                <span>101, Luxury Drive Road, Jubilee Hills, Hyderabad, TS, 500033</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-gold-500 shrink-0" />
                <a href="tel:+917439497628" className="hover:text-foreground transition-colors">
                  +91 74394 97628
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gold-500 shrink-0" />
                <a href="mailto:contact.wheeligo@gmail.com" className="hover:text-foreground transition-colors">
                  contact.wheeligo@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-foreground font-semibold">Store Timing:</span>
                  <span className="block text-xs">Mon - Sun: 09:00 AM - 09:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-border my-12" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground/60 text-center sm:text-left">
            &copy; {currentYear} Wheeligo Car Rental Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-muted-foreground/60">
            <Link href="/faqs" className="hover:underline hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/faqs" className="hover:underline hover:text-foreground">
              Terms & Conditions
            </Link>
            <Link href="/faqs" className="hover:underline hover:text-foreground">
              Fuel & Speed Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

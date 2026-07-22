import React from 'react';
import ContactForm from '@/components/contact/ContactForm';
import { Mail, Phone, MapPin, Clock, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Wheeligo Premium Car Rentals',
  description: 'Get in touch with Wheeligo. Visit our main office or contact us via phone, email, or WhatsApp.',
};

export default function ContactPage() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+919876543210';
  const cleanWAPhone = waNumber.replace(/[^\d+]/g, '');
  const waUrl = `https://wa.me/${cleanWAPhone}?text=${encodeURIComponent('Hi Wheeligo, I would like to inquire about self-drive bookings.')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Page Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Contact Wheeligo
        </h1>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          Need a custom booking arrangement, corporate presentation, or have questions about rental policies? Reach out to our concierge desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info column */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-foreground">Office Locations & Hub</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Our central operations office is situated in Jubilee Hills. We offer pick-up and return service hubs across major stations and terminals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl glass border border-border space-y-3">
              <MapPin className="h-5 w-5 text-gold-500" />
              <h3 className="font-bold text-sm text-foreground">Jubilee Hills Hub</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                101, Luxury Drive Road, Jubilee Hills, Hyderabad, TS, 500033
              </p>
            </div>

            <div className="p-5 rounded-2xl glass border border-border space-y-3">
              <Clock className="h-5 w-5 text-gold-500" />
              <h3 className="font-bold text-sm text-foreground">Operational Hours</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Concierge Desk: 9:00 AM - 9:00 PM<br />
                Roadside Assistance: 24/7 Active
              </p>
            </div>

            <div className="p-5 rounded-2xl glass border border-border space-y-3">
              <Phone className="h-5 w-5 text-gold-500" />
              <h3 className="font-bold text-sm text-foreground">Direct Telephones</h3>
              <a href="tel:+917439497628" className="block text-[11px] text-muted-foreground hover:text-gold-400">
                Primary: +91 74394 97628
              </a>
              <a href="mailto:contact.wheeligo@gmail.com" className="block text-[11px] text-muted-foreground hover:text-gold-400">
                Email: contact.wheeligo@gmail.com
              </a>
            </div>

            <div className="p-5 rounded-2xl glass border border-border space-y-3">
              <MessageSquare className="h-5 w-5 text-gold-500" />
              <h3 className="font-bold text-sm text-foreground">WhatsApp Chat</h3>
              <p className="text-[11px] text-muted-foreground mb-2">
                Fast responses for fleet checkups.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba59] text-[10px] font-bold text-center"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="h-[200px] w-full rounded-3xl glass border border-border overflow-hidden relative flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-slate-200/50 dark:bg-black/40 -z-10" />
            <div className="space-y-2 p-6">
              <Compass className="h-8 w-8 text-gold-500 mx-auto animate-spin-slow" />
              <span className="block font-bold text-xs text-foreground">Jubilee Hills Hub Location Map</span>
              <span className="block text-[10px] text-muted-foreground">Interactive maps placeholder - Hub covers Airport (RGIA) and Financial District</span>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

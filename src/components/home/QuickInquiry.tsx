'use client';

import React, { useState } from 'react';
import { createInquiry } from '@/app/actions';
import { Mail, Phone, User, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QuickInquiry() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'CALLBACK' | 'GENERAL'>('CALLBACK');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setErrorMsg('Name and Phone number are required.');
      setStatus('ERROR');
      return;
    }

    setStatus('LOADING');
    try {
      const response = await createInquiry({
        name,
        email,
        phone,
        message: message || `Requested a callback for a car rental enquiry. Preferred type: ${type}`,
        type,
      });

      if (response.success) {
        setStatus('SUCCESS');

        // Generate WhatsApp redirect message including details
        const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '917439497628';
        const cleanWAPhone = waPhone.replace(/[^\d+]/g, '');
        const messageText = `*New Callback Request - Wheeligo*\n\n` +
          `👤 *Name:* ${name}\n` +
          `📞 *Phone:* ${phone}\n` +
          `📧 *Email:* ${email || 'Not Provided'}\n` +
          `📝 *Type:* ${type === 'CALLBACK' ? '15-Min Callback' : 'General Inquiry'}\n` +
          `💬 *Message:* ${message || 'No additional details.'}\n\n` +
          `_Please connect me with an agent!_`;

        const waUrl = `https://wa.me/${cleanWAPhone}?text=${encodeURIComponent(messageText)}`;

        // Reset inputs
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');

        // Open WhatsApp chat in a new tab
        window.open(waUrl, '_blank');
      } else {
        setErrorMsg(response.error || 'Failed to submit request.');
        setStatus('ERROR');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('A network error occurred. Please try again.');
      setStatus('ERROR');
    }
  };

  return (
    <div className="glass border border-border p-6 md:p-8 rounded-3xl shadow-xl max-w-lg mx-auto">
      {status === 'SUCCESS' ? (
        <div className="text-center py-8 space-y-4">
          <div className="inline-flex p-3 bg-green-500/10 text-green-400 rounded-full">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Inquiry Submitted!</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you for reaching out. A Wheeligo executive will call you back on your number within 15 minutes.
          </p>
          <button
            onClick={() => setStatus('IDLE')}
            className="mt-4 px-5 py-2.5 rounded-xl border border-border bg-secondary hover:border-gold-500/30 text-xs font-bold text-gold-400"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Request a Callback</h3>
            <p className="text-xs text-muted-foreground">
              Submit your contact info and our luxury concierge team will call you back instantly.
            </p>
          </div>

          {/* Form Type Selector */}
          <div className="flex space-x-2 p-1 bg-secondary/80 rounded-xl border border-border text-xs">
            <button
              type="button"
              onClick={() => setType('CALLBACK')}
              className={`flex-1 py-2 text-center rounded-lg font-bold transition-all ${
                type === 'CALLBACK' ? 'bg-gold-500 text-black shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              15-Min Callback
            </button>
            <button
              type="button"
              onClick={() => setType('GENERAL')}
              className={`flex-1 py-2 text-center rounded-lg font-bold transition-all ${
                type === 'GENERAL' ? 'bg-gold-500 text-black shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              General Inquiry
            </button>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                <User className="h-3 w-3 mr-1.5 text-gold-500" />
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Mehta"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/30"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                <Phone className="h-3 w-3 mr-1.5 text-gold-500 animate-pulse" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/30"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                <Mail className="h-3 w-3 mr-1.5 text-gold-500" />
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@mehta.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/30"
              />
            </div>

            {/* Message (only for general query) */}
            {type === 'GENERAL' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  How can we help you?
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your requirements..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/30 resize-none"
                />
              </div>
            )}
          </div>

          {/* Status Messages */}
          {status === 'ERROR' && (
            <div className="p-3 bg-red-950/40 rounded-xl border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'LOADING'}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] shadow-md shadow-gold-500/10"
          >
            <span>{status === 'LOADING' ? 'Sending...' : 'Request callback'}</span>
            <Send className="h-3.5 w-3.5 shrink-0" />
          </button>
        </form>
      )}
    </div>
  );
}

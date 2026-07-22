'use client';

import React, { useState } from 'react';
import { createInquiry } from '@/app/actions';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      setErrorMsg('Name, Phone, and Message are required.');
      setStatus('ERROR');
      return;
    }

    setStatus('LOADING');
    try {
      const response = await createInquiry({
        name,
        email,
        phone,
        message,
        type: 'GENERAL',
      });

      if (response.success) {
        setStatus('SUCCESS');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMsg(response.error || 'Failed to submit contact message.');
        setStatus('ERROR');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('A network error occurred. Please try again.');
      setStatus('ERROR');
    }
  };

  return (
    <div className="glass border border-border p-6 md:p-8 rounded-3xl shadow-xl">
      {status === 'SUCCESS' ? (
        <div className="text-center py-10 space-y-4">
          <div className="inline-flex p-3 bg-green-500/10 text-green-400 rounded-full">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
          <p className="text-xs md:text-sm text-muted-foreground/80 leading-relaxed max-w-sm mx-auto">
            We have received your message. Our customer service team will reach out to you shortly.
          </p>
          <button
            onClick={() => setStatus('IDLE')}
            className="px-5 py-2 rounded-xl bg-secondary border border-border text-gold-400 text-xs font-bold"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Send a Message</h3>
            <p className="text-xs text-muted-foreground">
              Fill out the form below and we will get back to you within 24 hours.
            </p>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center">
              <User className="h-3 w-3 mr-1 text-gold-500" />
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rohit Sharma"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center">
              <Mail className="h-3 w-3 mr-1 text-gold-500" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rohit@gmail.com"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center">
              <Phone className="h-3 w-3 mr-1 text-gold-500" />
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center">
              <MessageSquare className="h-3 w-3 mr-1 text-gold-500" />
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What details are you inquiring about?"
              rows={4}
              className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none resize-none"
              required
            />
          </div>

          {status === 'ERROR' && (
            <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'LOADING'}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-xs uppercase tracking-wider transition-all"
          >
            {status === 'LOADING' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}

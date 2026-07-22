'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, User, Mail, Phone, ShieldCheck, Award, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const { login, signup } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  
  // Sign Up Form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  
  // Custom Login Form state
  const [loginEmail, setLoginEmail] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpName || !signUpEmail || !signUpPhone) {
      setErrorMsg('All fields are required.');
      return;
    }

    try {
      signup(signUpName, signUpEmail, signUpPhone, 'Silver');
      setSuccessMsg('Account created successfully!');
      
      // Auto close after 1.5 seconds
      setTimeout(() => {
        onClose();
        setSignUpName('');
        setSignUpEmail('');
        setSignUpPhone('');
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      setErrorMsg('Failed to create account. Please try again.');
    }
  };

  const handleDemoLogin = (role: 'customer' | 'admin') => {
    login(role);
    setSuccessMsg(`Logged in successfully as ${role === 'admin' ? 'Admin' : 'Customer'}!`);
    setTimeout(() => {
      onClose();
      setSuccessMsg('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md glass border border-border rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Radial Glow */}
        <div className="absolute top-0 right-0 -z-10 h-[200px] w-[200px] rounded-full bg-gold-500/5 blur-[80px]" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full border border-border bg-secondary hover:border-gold-500/30 hover:text-gold-400 transition-all"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header Tab Toggles */}
        <div className="flex border-b border-border bg-secondary/30">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'login' ? 'border-gold-500 text-gold-400' : 'border-transparent text-muted-foreground'
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'signup' ? 'border-gold-500 text-gold-400' : 'border-transparent text-muted-foreground'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Brand Logo Header */}
          <div className="text-center">
            <span className="text-2xl font-black tracking-wider uppercase text-foreground">
              WHEELI<span className="text-gold-500">GO</span>
            </span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
              {activeTab === 'login' ? 'Welcome back to luxury' : 'Begin your premium journey'}
            </p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 bg-red-950/40 rounded-xl border border-red-500/20 text-red-400 text-xs text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-950/40 rounded-xl border border-green-500/20 text-green-400 text-xs text-center font-bold">
              {successMsg}
            </div>
          )}

          {activeTab === 'login' ? (
            /* LOGIN TAB */
            <div className="space-y-6">
              <div className="space-y-3.5">
                <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                  Quick Access Demo Accounts
                </span>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDemoLogin('customer')}
                    className="p-4 rounded-2xl border border-border bg-secondary hover:border-gold-500/30 text-left hover:scale-[1.02] transition-all flex flex-col items-center justify-center space-y-2 group"
                  >
                    <div className="p-2.5 bg-gold-500/10 rounded-full text-gold-400 group-hover:bg-gold-500/20 transition-all">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xs text-foreground text-center">Customer Demo</span>
                    <span className="text-[9px] text-muted-foreground text-center">Gold Membership Perks</span>
                  </button>

                  <button
                    onClick={() => handleDemoLogin('admin')}
                    className="p-4 rounded-2xl border border-border bg-secondary hover:border-gold-500/30 text-left hover:scale-[1.02] transition-all flex flex-col items-center justify-center space-y-2 group"
                  >
                    <div className="p-2.5 bg-gold-500/10 rounded-full text-gold-400 group-hover:bg-gold-500/20 transition-all">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-xs text-foreground text-center">Admin Console</span>
                    <span className="text-[9px] text-muted-foreground text-center">Manage Fleet & Approvals</span>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <span className="relative px-3 bg-black/80 text-[9px] text-muted-foreground uppercase tracking-widest">
                  Custom Accounts
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your registered email..."
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/30"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!loginEmail.trim()) {
                      setErrorMsg('Please enter an email address.');
                      return;
                    }
                    const savedUserString = localStorage.getItem('wheeligo-user');
                    if (savedUserString) {
                      const parsed = JSON.parse(savedUserString);
                      if (parsed.email.toLowerCase() === loginEmail.toLowerCase()) {
                        setSuccessMsg(`Welcome back, ${parsed.name}!`);
                        setTimeout(() => {
                          onClose();
                          setSuccessMsg('');
                          setLoginEmail('');
                        }, 1200);
                        return;
                      }
                    }
                    
                    signup('Premium Guest', loginEmail, '+91 74394 97628', 'Silver');
                    setSuccessMsg('Signed in as a Premium Guest!');
                    setTimeout(() => {
                      onClose();
                      setSuccessMsg('');
                      setLoginEmail('');
                    }, 1200);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-gold-500/10 hover:scale-[1.02]"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Access Dashboard</span>
                </button>
              </div>
            </div>
          ) : (
            /* SIGN UP TAB */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                  <User className="h-3.5 w-3.5 mr-1.5 text-gold-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Mehta"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/30"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-1.5 text-gold-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. aarav@mehta.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/30"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1.5 text-gold-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 74394 97628"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/30"
                  required
                />
              </div>



              {/* Submit Sign Up */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-gold-500/10 hover:scale-[1.02]"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

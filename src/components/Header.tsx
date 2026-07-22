'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Car, Menu, X, Phone, User, Moon, Sun, ShieldAlert, Award } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme, user, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollWidth, setScrollWidth] = useState('0%');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  // Track scroll position for glass background and progress indicator
  useEffect(() => {
    const handleScroll = () => {
      // Background effect
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const scrolledPercentage = (window.scrollY / totalScroll) * 100;
        setScrollWidth(`${scrolledPercentage}%`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'About', path: '/about' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div id="scroll-progress" style={{ width: scrollWidth }} />

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg group-hover:scale-105 transition-transform duration-300">
                <Car className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-gold-600 to-gold-800 dark:from-gold-400 dark:via-gold-200 dark:to-gold-500">
                Wheeligo
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-sm font-semibold tracking-wide transition-colors duration-300 hover:text-gold-400 ${
                    pathname === link.path ? 'text-gold-500 text-glow-gold' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Phone Quick Call */}
              <a
                href="tel:+917439497628"
                className="flex items-center text-sm font-bold text-muted-foreground hover:text-gold-400 transition-colors"
              >
                <Phone className="h-4 w-4 mr-1 text-gold-500 animate-pulse" />
                <span>+91 74394 97628</span>
              </a>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-border bg-secondary hover:bg-accent hover:border-gold-400 transition-all duration-300"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-gold-400" />
                ) : (
                  <Moon className="h-4 w-4 text-gold-600" />
                )}
              </button>

              {/* User Account Menu / Dashboard Links */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href={user.isAdmin ? '/admin' : '/dashboard'}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gold-500/20 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 transition-all text-xs font-bold"
                  >
                    {user.isAdmin ? (
                      <ShieldAlert className="h-3.5 w-3.5" />
                    ) : (
                      <Award className="h-3.5 w-3.5" />
                    )}
                    <span>{user.isAdmin ? 'Admin Console' : `${user.membership} Member`}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-xs font-bold text-red-400 hover:text-red-300 hover:underline transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => {
                      setAuthModalTab('login');
                      setAuthModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold hover:border-gold-500/30 transition-all text-muted-foreground hover:text-foreground hover:scale-105"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalTab('signup');
                      setAuthModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black text-xs font-bold transition-all shadow-md shadow-gold-500/10 hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center space-x-4 md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-border bg-secondary"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-gold-400" /> : <Moon className="h-4 w-4 text-gold-600" />}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg border border-border bg-secondary hover:text-gold-400 transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden glass animate-fade-in absolute w-full left-0 py-4 px-6 border-b border-border shadow-lg">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-semibold tracking-wide ${
                    pathname === link.path ? 'text-gold-500 font-bold' : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-border pt-4 mt-2 flex flex-col space-y-3">
                <a
                  href="tel:+917439497628"
                  className="flex items-center text-sm font-bold text-muted-foreground"
                >
                  <Phone className="h-4 w-4 mr-2 text-gold-500" />
                  +91 74394 97628
                </a>

                {user ? (
                  <div className="flex items-center justify-between">
                    <Link
                      href={user.isAdmin ? '/admin' : '/dashboard'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-xs font-bold text-gold-400 bg-gold-500/10 px-3 py-1.5 rounded"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>{user.isAdmin ? 'Admin Dashboard' : `My Dashboard (${user.membership})`}</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="text-xs font-bold text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setAuthModalTab('login');
                        setAuthModalOpen(true);
                        setIsOpen(false);
                      }}
                      className="flex-1 py-2 text-center rounded border border-border text-xs font-bold text-muted-foreground"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalTab('signup');
                        setAuthModalOpen(true);
                        setIsOpen(false);
                      }}
                      className="flex-1 py-2 text-center rounded bg-gold-500 text-black text-xs font-bold"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
}

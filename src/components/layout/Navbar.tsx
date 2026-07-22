"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X, Phone } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  })

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "glass-card border-b-0 m-4 w-[calc(100%-2rem)]" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-heading font-bold text-gradient">WHEELIGO</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/fleet" className="hover:text-primary transition-colors">Fleet</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/corporate" className="hover:text-primary transition-colors">Corporate</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold border border-primary/50 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-all">
            <Phone size={16} /> Book via WhatsApp
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-4 shadow-2xl"
        >
          <Link href="/fleet" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Fleet</Link>
          <Link href="/about" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link href="/corporate" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Corporate</Link>
          <Link href="/contact" className="text-lg hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </motion.div>
      )}
    </motion.header>
  )
}

"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, MapPin, Calendar, Car, Shield, Star, ThumbsUp } from "lucide-react"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background - placeholder color gradient for cinematic feel */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-background to-background"></div>
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1503376760302-7c5aafc440c9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="flex-1 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight">
              Drive The <br/> <span className="text-gradient">Extraordinary.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Experience the thrill of the world's most premium vehicles. Luxury self-drive car rentals designed for those who demand perfection.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/fleet" className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors">
                Explore Fleet <ChevronRight size={20} />
              </Link>
              <Link href="/contact" className="glass font-semibold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 relative w-full aspect-video md:aspect-square flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Mock Image of a car for the hero */}
            <div className="w-full h-64 md:h-96 relative">
               <img src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1000&auto=format&fit=crop" alt="Premium Sports Car" className="object-contain w-full h-full drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)]"/>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Widget (Simplified) */}
      <section className="relative z-20 -mt-16 container mx-auto px-6">
        <motion.div 
          className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-full space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2"><MapPin size={16}/> Pickup Location</label>
            <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none appearance-none">
              <option>Select City</option>
              <option>New York</option>
              <option>Los Angeles</option>
              <option>Miami</option>
            </select>
          </div>
          <div className="w-full space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2"><Calendar size={16}/> Pickup Date</label>
            <input type="date" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" />
          </div>
          <div className="w-full space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2"><Calendar size={16}/> Return Date</label>
            <input type="date" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" />
          </div>
          <button className="w-full md:w-auto bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap h-[50px]">
            Find Vehicles
          </button>
        </motion.div>
      </section>

      {/* Featured Fleet Preview */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Our Premium Fleet</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Select from our meticulously maintained collection of the world's most prestigious automotive brands.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Porsche 911 GT3", category: "Sports", price: "$499/day", img: "https://images.unsplash.com/photo-1503376760302-7c5aafc440c9?q=80&w=800&auto=format&fit=crop" },
            { name: "Mercedes G63 AMG", category: "Luxury SUV", price: "$599/day", img: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=800&auto=format&fit=crop" },
            { name: "Audi RS e-tron GT", category: "Electric", price: "$399/day", img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop" }
          ].map((car, i) => (
            <motion.div 
              key={i}
              className="glass-card overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-48 overflow-hidden relative">
                <img src={car.img} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
                  {car.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-primary font-bold text-lg">{car.price}</span>
                  <Link href="/fleet" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
                    Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/fleet" className="inline-block border border-white/20 hover:border-primary hover:text-primary transition-all px-8 py-3 rounded-full font-semibold">
            View All Vehicles
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-zinc-900/30 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Car size={32} />
              </div>
              <h3 className="text-xl font-bold">Immaculate Fleet</h3>
              <p className="text-muted-foreground">Every vehicle is detailed, serviced, and inspected before every rental.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold">Comprehensive Insurance</h3>
              <p className="text-muted-foreground">Drive with peace of mind knowing you're fully covered by our premium policies.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold">VIP Service</h3>
              <p className="text-muted-foreground">24/7 concierge support and roadside assistance anywhere you go.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

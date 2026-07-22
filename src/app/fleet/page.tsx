"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Filter, Car, Fuel, Settings, Users } from "lucide-react"
import { mockVehicles } from "@/lib/mock-data"

export default function FleetPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Sports", "Luxury SUV", "Sedan", "Electric"]
  
  const filteredVehicles = selectedCategory === "All" 
    ? mockVehicles 
    : mockVehicles.filter(v => v.category === selectedCategory)

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Fleet</h1>
          <p className="text-muted-foreground max-w-2xl">Browse our meticulously maintained collection of premium vehicles and find the perfect match for your next journey.</p>
        </div>
        
        {/* Simple Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors border ${
                selectedCategory === cat 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-white/5 border-white/10 hover:border-primary/50 text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((car, i) => (
          <motion.div 
            key={car.id}
            className="glass-card flex flex-col h-full group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="h-56 overflow-hidden relative rounded-t-2xl">
              <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
                {car.category}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-2xl font-bold mb-1">{car.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{car.brand}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-zinc-300">
                <div className="flex items-center gap-2"><Users size={16} className="text-primary"/> {car.specs.seats} Seats</div>
                <div className="flex items-center gap-2"><Settings size={16} className="text-primary"/> {car.specs.transmission}</div>
                <div className="flex items-center gap-2"><Fuel size={16} className="text-primary"/> {car.specs.fuelType}</div>
                <div className="flex items-center gap-2"><Car size={16} className="text-primary"/> {car.specs.luggage} Bags</div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">${car.price}</span>
                  <span className="text-muted-foreground text-sm">/day</span>
                </div>
                <Link href={`/fleet/${car.id}`} className="bg-white/10 hover:bg-primary hover:text-primary-foreground border border-white/20 hover:border-primary px-6 py-2 rounded-lg font-semibold transition-all">
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

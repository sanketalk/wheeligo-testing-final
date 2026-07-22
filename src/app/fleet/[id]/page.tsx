"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { mockVehicles } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Check, ShieldCheck, MapPin, Calendar, Clock, MessageCircle } from "lucide-react"

export default function VehicleDetailsPage({ params }: { params: { id: string } }) {
  const vehicle = mockVehicles.find(v => v.id === params.id)
  
  if (!vehicle) {
    notFound()
  }

  const [pickupLocation, setPickupLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  
  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Format the WhatsApp message
    const message = `*New Booking Inquiry - Wheeligo*%0A%0A*Vehicle:* ${vehicle.name}%0A*Price:* $${vehicle.price}/day%0A%0A*Pickup Location:* ${pickupLocation}%0A*Pickup Date:* ${pickupDate}%0A*Return Date:* ${returnDate}%0A%0AHello, I would like to check availability and book this vehicle.`;
    
    // Use the actual business number provided by the client later. For now, a placeholder.
    const whatsappNumber = "1234567890" 
    const url = `https://wa.me/${whatsappNumber}?text=${message}`
    
    window.open(url, "_blank")
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Images and Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Main Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden glass-card relative aspect-[16/9]"
          >
            <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover" />
          </motion.div>

          {/* Details */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-heading font-bold">{vehicle.name}</h1>
              <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-semibold">{vehicle.category}</span>
            </div>
            <p className="text-xl text-muted-foreground mb-8">{vehicle.description}</p>
            
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">Features & Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vehicle.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-zinc-300">
                  <Check size={18} className="text-primary" /> {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <motion.div 
            className="glass-card p-6 md:p-8 sticky top-28"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-end gap-2 mb-6 pb-6 border-b border-white/10">
              <span className="text-4xl font-bold text-white">${vehicle.price}</span>
              <span className="text-muted-foreground pb-1">/ day</span>
            </div>

            <form onSubmit={handleWhatsAppBooking} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground flex items-center gap-2"><MapPin size={16}/> Pickup & Drop-off Location</label>
                <select 
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none appearance-none"
                >
                  <option value="" disabled>Select Location</option>
                  <option value="New York - JFK Airport">New York - JFK Airport</option>
                  <option value="Los Angeles - LAX Airport">Los Angeles - LAX Airport</option>
                  <option value="Miami - MIA Airport">Miami - MIA Airport</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2"><Calendar size={16}/> Pickup</label>
                  <input 
                    type="date" 
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2"><Calendar size={16}/> Return</label>
                  <input 
                    type="date" 
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" 
                  />
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-primary mt-1 flex-shrink-0" size={20} />
                  <p className="text-xs text-muted-foreground">This vehicle requires a security deposit. Standard insurance is included. KYC verification required before key handover.</p>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-8"
              >
                <MessageCircle size={20} />
                Book via WhatsApp
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

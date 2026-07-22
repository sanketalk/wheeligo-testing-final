'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Calculator, HelpCircle, Car, RefreshCw, SendToBack } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getVehicles } from '@/app/actions';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  type?: 'text' | 'recommendation' | 'quote';
  data?: any;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'quote' | 'faq'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fleet, setFleet] = useState<any[]>([]);

  // Quote Calculator Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [rentalDays, setRentalDays] = useState(3);
  const [gpsAddon, setGpsAddon] = useState(false);
  const [childSeatAddon, setChildSeatAddon] = useState(false);
  const [insuranceAddon, setInsuranceAddon] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch vehicles for recommendation logic and quotes
  useEffect(() => {
    async function loadFleet() {
      const data = await getVehicles();
      setFleet(data);
      if (data.length > 0) {
        setSelectedVehicleId(data[0].id);
      }
    }
    loadFleet();
  }, []);

  // Initialize Chat Messages
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: 'Welcome to Wheeligo Premium Assistance. I am your AI Travel Companion. How can I help you today? You can ask me to recommend a car, calculate rental quotes, or explain our fuel policies!',
        },
      ]);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Calculate quote dynamically
  useEffect(() => {
    if (fleet.length === 0 || !selectedVehicleId) return;
    const vehicle = fleet.find((v) => v.id === selectedVehicleId);
    if (!vehicle) return;

    const baseRent = vehicle.pricePerDay * rentalDays;
    let addonPrice = 0;
    const selectedAddons: string[] = [];

    if (gpsAddon) {
      addonPrice += 300 * rentalDays;
      selectedAddons.push('GPS Navigation');
    }
    if (childSeatAddon) {
      addonPrice += 500 * rentalDays;
      selectedAddons.push('Child Seat');
    }
    if (insuranceAddon) {
      addonPrice += 1000 * rentalDays;
      selectedAddons.push('Premium Insurance');
    }

    const subTotal = baseRent + addonPrice;
    const tax = subTotal * 0.18; // 18% GST
    const grandTotal = subTotal + tax;

    setQuoteDetails({
      vehicle,
      baseRent,
      addonPrice,
      selectedAddons,
      subTotal,
      tax,
      grandTotal,
      securityDeposit: vehicle.securityDeposit,
    });
  }, [selectedVehicleId, rentalDays, gpsAddon, childSeatAddon, insuranceAddon, fleet]);

  const sendMessageText = (text: string) => {
    const textToSend = text.trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiText = '';
      let type: Message['type'] = 'text';
      let data: any = null;

      const query = textToSend.toLowerCase();

      // 1. Greetings
      if (query.match(/\b(hi|hello|hey|greetings|yo|hello there|good morning|good afternoon|good evening)\b/)) {
        aiText = `Hello! I am your Wheeligo Concierge. How can I assist you with your luxury self-drive experience today?\n\nYou can ask me to **recommend a vehicle**, check **rental requirements**, estimate a **quote**, or find out how to **contact us**!`;
      }
      // 2. Locations, delivery, address
      else if (query.includes('location') || query.includes('where') || query.includes('address') || query.includes('office') || query.includes('hub') || query.includes('airport') || query.includes('deliver') || query.includes('pickup') || query.includes('dropoff') || query.includes('hyderabad') || query.includes('jubilee')) {
        aiText = `*Wheeligo Hub & Delivery Policies:*\n\n📍 **Our Premium Hub:** 101, Luxury Drive Road, Jubilee Hills, Hyderabad, TS, 500033.\n\n🚗 **Doorstep Concierge Service:** We deliver and pick up vehicles directly from your home, office, hotel, or Rajiv Gandhi International Airport (RGIA).\n\n✨ *Note:* Doorstep concierge delivery is **free** for rentals of 3 days or more! For shorter durations, a nominal transport fee of ₹1,000 applies.`;
      }
      // 3. Contact information
      else if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('number') || query.includes('support') || query.includes('call') || query.includes('whatsapp')) {
        aiText = `*Get In Touch With Wheeligo:*\n\n📞 **Helpline:** +91 74394 97628 (Calls & WhatsApp)\n📧 **Email:** contact.wheeligo@gmail.com\n🕒 **Operating Hours:** 9:00 AM - 9:00 PM (Roadside Assistance is active 24/7).\n\nYou can also request a direct phone callback by choosing the **15-Min Callback** option on our forms!`;
      }
      // 4. Membership details
      else if (query.includes('member') || query.includes('loyalty') || query.includes('gold') || query.includes('platinum') || query.includes('discount') || query.includes('offer') || query.includes('deal') || query.includes('perk') || query.includes('club')) {
        aiText = `*Wheeligo Luxury Club Perks:*\n\nOur loyalty program reward system updates automatically based on your bookings:\n🏅 **Gold Tier (3+ Rentals):** 5% discount on all bookings, complimentary premium GPS addons, and priority delivery queue.\n👑 **Platinum Tier (8+ Rentals):** 10% discount on all bookings, waiver of security deposits for selected vehicles, free airport concierge services, and late returns up to 2 hours.\n\nCheck your membership rank progress bar inside the **Customer Dashboard**!`;
      }
      // 5. Booking process
      else if (query.includes('book') || query.includes('how to') || query.includes('rent') || query.includes('reserve') || query.includes('inquiry') || query.includes('process')) {
        aiText = `*Simple 4-Step Booking Process:*\n\n1. **Browse & Choose:** Select a luxury car from our fleet page.\n2. **Generate Quote:** Use our live estimator to check rents and GST.\n3. **Inquire via WhatsApp:** Send details automatically. Our representative approves availability.\n4. **Submit KYC & Drive:** Upload your Driving License and ID on the dashboard, complete deposit, and drive!\n\nNo online payment is required initially; we align and confirm all reservations via WhatsApp chat.`;
      }
      // 6. Fuel Policy
      else if (query.includes('fuel') || query.includes('policy') || query.includes('gas') || query.includes('petrol') || query.includes('diesel') || query.includes('tank')) {
        aiText = `*Wheeligo Fuel Policy:*\nOur standard policy is **Full to Full**. All vehicles are delivered with a full tank of fuel (or fully charged for EVs) and must be returned with a full tank. If not returned full, refueling charges plus a service fee of ₹500 will apply.`;
      }
      // 7. Security Deposit
      else if (query.includes('deposit') || query.includes('security') || query.includes('refund') || query.includes('money')) {
        aiText = `*Security Deposit & Payments:*\nWe require a fully refundable security deposit for all self-drive rentals. The deposit varies from ₹15,000 (Tesla) up to ₹35,000 (Mercedes S-Class) to cover potential minor damages, speeding violations, or toll fees. Deposits are processed via bank transfer or credit card holds and refunded within 48-72 hours of vehicle return.`;
      }
      // 8. KYC Requirements
      else if (query.includes('license') || query.includes('kyc') || query.includes('aadhaar') || query.includes('passport') || query.includes('document') || query.includes('pan') || query.includes('dl') || query.includes('verify')) {
        aiText = `*KYC & Verification Requirements:*\nTo drive our luxury cars, you must submit:\n1. A valid Driving License (minimum 3 years of driving history, age 21+).\n2. Aadhaar Card / PAN Card for domestic renters.\n3. Passport + International Driving Permit (IDP) for foreign nationals.\n\nYou can upload these documents directly in your **Customer Dashboard** for express verification.`;
      }
      // 9. Speed Limit
      else if (query.includes('speed') || query.includes('limit') || query.includes('fastest') || query.includes('track') || query.includes('gps')) {
        aiText = `*Speed Limit Policy:*\nTo ensure safety, all vehicles are speed governed or monitored. The maximum speed limit is **120 km/h** on national expressways and **80 km/h** on state highways. Exceeding 120 km/h triggers warning alerts and a penalty of ₹1,000 per violation.`;
      }
      // 10. Insurance, breakdowns, accidents
      else if (query.includes('insurance') || query.includes('accident') || query.includes('damage') || query.includes('breakdown') || query.includes('crash') || query.includes('scratch') || query.includes('roadside')) {
        aiText = `*Insurance & Roadside Safety:*\n\n🛡️ **Zero-Depreciation Cover:** Every vehicle is fully insured. Your maximum liability for accidental damages is strictly capped at your security deposit amount.\n🛠️ **24/7 Roadside Assistance:** In the event of an incident or breakdown, contact our mechanical support line immediately at **+91 74394 97628**. Do not attempt unauthorized repairs.`;
      }
      // 11. Cancellation
      else if (query.includes('cancel') || query.includes('refund') || query.includes('cancellation')) {
        aiText = `*Cancellation & Refund Policy:*\n- **Free Cancellation:** Up to 24 hours prior to scheduled pickup time.\n- **Late Cancellation:** Cancellations within 24 hours of pickup incur a 1-day rental charge penalty.\n- **No Show:** No refunds are issued for failure to show up at the scheduled time.`;
      }
      // 12. Recommendations / Fleet Matching
      else if (query.includes('recommend') || query.includes('suggest') || query.includes('choose') || query.includes('find') || query.includes('suv') || query.includes('car') || query.includes('electric') || query.includes('ev') || query.includes('tesla') || query.includes('porsche') || query.includes('audi') || query.includes('bmw') || query.includes('mercedes') || query.includes('luxury') || query.includes('fast') || query.includes('sedan') || query.includes('budget') || query.includes('cheap')) {
        // AI Recommendation matching
        let matched = [...fleet];
        if (query.includes('electric') || query.includes('ev') || query.includes('tesla') || query.includes('porsche')) {
          matched = fleet.filter((v) => v.fuelType === 'Electric');
        } else if (query.includes('suv') || query.includes('large') || query.includes('family')) {
          matched = fleet.filter((v) => v.category === 'SUV');
        } else if (query.includes('fast') || query.includes('sports') || query.includes('luxury') || query.includes('m4') || query.includes('taycan')) {
          matched = fleet.filter((v) => v.category === 'Luxury' || v.brand === 'Porsche');
        } else if (query.includes('cheap') || query.includes('budget') || query.includes('low')) {
          matched = fleet.filter((v) => v.pricePerDay < 15000);
        }

        if (matched.length > 0) {
          aiText = `Based on your request, I highly recommend checking out these premium vehicles from our fleet:`;
          type = 'recommendation';
          data = matched;
        } else {
          aiText = `I couldn't find a specific match for that in our premium fleet, but here are our featured luxury vehicles. Let me know if you would like to filter by SUVs, Electrics, or high-performance Coupes!`;
          type = 'recommendation';
          data = fleet.slice(0, 3);
        }
      }
      // 13. General Conversational / Fallback replies
      else {
        aiText = `I want to give you the most accurate answer! Could you please ask me about one of the following topics?\n\n🚗 **Fleet Matching** (e.g., "Show me SUVs" or "recommend an electric car")\n📅 **Rental Quotes** (Use the 'Quote Estimator' tab above to calculate totals)\n📜 **Guidelines** (Fuel, Security Deposit, KYC Documents, Speed Limits, Insurance, Cancellation)\n📞 **Support Info** (Helplines, Jubilee Hills Hub address, delivery info)\n\nOr type a direct query and I will guide you instantly!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: aiText,
          type,
          data,
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessageText(inputValue);
    setInputValue('');
  };

  const handleQuickQuestion = (question: string) => {
    sendMessageText(question);
  };

  const generateWhatsAppFromQuote = () => {
    if (!quoteDetails) return '#';
    const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+919876543210';
    const cleanWAPhone = waPhone.replace(/[^\d+]/g, '');

    const messageText = `*Quote Inquiry - Wheeligo AI Assistant*\n\n` +
      `🚗 *Vehicle:* ${quoteDetails.vehicle.brand} ${quoteDetails.vehicle.name}\n` +
      `📅 *Duration:* ${rentalDays} Days\n` +
      `🎁 *Selected Add-ons:* ${quoteDetails.selectedAddons.join(', ') || 'None'}\n` +
      `💰 *Estimated Total Price (incl. GST):* ₹${Math.round(quoteDetails.grandTotal).toLocaleString()}\n` +
      `🔒 *Refundable Deposit:* ₹${quoteDetails.securityDeposit.toLocaleString()}\n\n` +
      `_Please confirm availability for booking!_`;

    return `https://wa.me/${cleanWAPhone}?text=${encodeURIComponent(messageText)}`;
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-40 flex items-center space-x-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-xs"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-4 w-4 animate-spin-slow" />
        <span className="hidden sm:inline">AI Travel Assistant</span>
      </button>

      {/* Main Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] glass shadow-2xl border-l border-border flex flex-col animate-slide-in">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-black/40">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gold-500/20 text-gold-400 rounded-lg">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Wheeligo AI Companion</h3>
                <span className="text-[10px] text-green-400 font-semibold flex items-center">
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                  Online & Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg border border-border bg-secondary hover:text-gold-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border bg-secondary/50 text-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-center font-bold border-b-2 transition-all ${
                activeTab === 'chat' ? 'border-gold-500 text-gold-400' : 'border-transparent text-muted-foreground'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" />
              AI Chat & Guide
            </button>
            <button
              onClick={() => setActiveTab('quote')}
              className={`flex-1 py-3 text-center font-bold border-b-2 transition-all ${
                activeTab === 'quote' ? 'border-gold-500 text-gold-400' : 'border-transparent text-muted-foreground'
              }`}
            >
              <Calculator className="h-3.5 w-3.5 inline mr-1.5" />
              Quote Estimator
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-3 text-center font-bold border-b-2 transition-all ${
                activeTab === 'faq' ? 'border-gold-500 text-gold-400' : 'border-transparent text-muted-foreground'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 inline mr-1.5" />
              Policy Help
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'chat' && (
              <>
                {/* Messages List */}
                <div className="space-y-4 min-h-[250px]">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-muted-foreground mb-1">
                        {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <div
                        className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gold-500 text-black font-semibold rounded-tr-none'
                            : 'bg-secondary border border-border text-foreground rounded-tl-none'
                        }`}
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {msg.text}

                        {/* Rendering Car Recommendations */}
                        {msg.type === 'recommendation' && msg.data && (
                          <div className="grid grid-cols-1 gap-2 mt-3 pt-3 border-t border-border">
                            {msg.data.map((car: any) => (
                              <div
                                key={car.id}
                                className="flex items-center space-x-3 p-2 bg-black/40 rounded-lg border border-border"
                              >
                                <img
                                  src={car.image}
                                  alt={car.name}
                                  className="h-10 w-16 object-cover rounded bg-secondary"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="block font-bold text-xs truncate text-foreground">
                                    {car.brand} {car.name}
                                  </span>
                                  <span className="block text-[10px] text-gold-400">
                                    ₹{car.pricePerDay.toLocaleString()}/day
                                  </span>
                                </div>
                                <a
                                  href={`/fleet/${car.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="px-2 py-1 rounded bg-gold-500 hover:bg-gold-400 text-black text-[10px] font-bold"
                                >
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-muted-foreground mb-1">AI Assistant</span>
                      <div className="bg-secondary border border-border p-3 rounded-xl rounded-tl-none">
                        <div className="flex space-x-1.5 items-center">
                          <span className="h-1.5 w-1.5 bg-gold-400 rounded-full animate-bounce" />
                          <span className="h-1.5 w-1.5 bg-gold-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="h-1.5 w-1.5 bg-gold-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* FAQ Quick suggestions */}
                {messages.length === 1 && (
                  <div className="space-y-2 pt-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Common Queries:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Recommend a family SUV',
                        'What is the fuel policy?',
                        'How much is the deposit?',
                        'What KYC docs are needed?',
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQuickQuestion(q)}
                          className="px-2.5 py-1.5 rounded-lg border border-border bg-secondary/80 text-[10px] text-muted-foreground hover:text-gold-400 hover:border-gold-500/30 transition-all font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'quote' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Estimate Your Trip Total
                </h4>

                {/* Car Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground">Select Vehicle</label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none"
                  >
                    {fleet.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.name} (₹{car.pricePerDay.toLocaleString()}/day)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                    <label>Duration</label>
                    <span className="text-gold-400">{rentalDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value))}
                    className="w-full accent-gold-500"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground">
                    <span>1 Day</span>
                    <span>15 Days</span>
                    <span>30 Days</span>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground block">Optional Add-ons</label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2 rounded-lg border border-border bg-secondary/50 cursor-pointer hover:border-gold-500/20">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={gpsAddon}
                          onChange={(e) => setGpsAddon(e.target.checked)}
                          className="accent-gold-500"
                        />
                        <span className="text-xs text-foreground">GPS Navigation</span>
                      </div>
                      <span className="text-[10px] text-gold-400 font-bold">₹300/day</span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg border border-border bg-secondary/50 cursor-pointer hover:border-gold-500/20">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={childSeatAddon}
                          onChange={(e) => setChildSeatAddon(e.target.checked)}
                          className="accent-gold-500"
                        />
                        <span className="text-xs text-foreground">Child Safety Seat</span>
                      </div>
                      <span className="text-[10px] text-gold-400 font-bold">₹500/day</span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg border border-border bg-secondary/50 cursor-pointer hover:border-gold-500/20">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={insuranceAddon}
                          onChange={(e) => setInsuranceAddon(e.target.checked)}
                          className="accent-gold-500"
                        />
                        <span className="text-xs text-foreground">Zero Excess Insurance</span>
                      </div>
                      <span className="text-[10px] text-gold-400 font-bold">₹1,000/day</span>
                    </label>
                  </div>
                </div>

                {/* Pricing Summary */}
                {quoteDetails && (
                  <div className="p-3 bg-black/40 rounded-xl border border-gold-500/20 space-y-2.5 text-xs text-muted-foreground">
                    <div className="flex justify-between font-bold text-foreground text-xs pb-1.5 border-b border-border">
                      <span>{quoteDetails.vehicle.brand} {quoteDetails.vehicle.name}</span>
                      <span className="text-gold-400">₹{quoteDetails.vehicle.pricePerDay}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base Rent ({rentalDays} Days)</span>
                      <span>₹{quoteDetails.baseRent.toLocaleString()}</span>
                    </div>
                    {quoteDetails.addonPrice > 0 && (
                      <div className="flex justify-between">
                        <span>Selected Add-ons</span>
                        <span>₹{quoteDetails.addonPrice.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{Math.round(quoteDetails.tax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-foreground font-bold text-sm pt-1.5 border-t border-border">
                      <span>Estimated Total</span>
                      <span className="text-gold-400">₹{Math.round(quoteDetails.grandTotal).toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 border-t border-border pt-1.5">
                      * Refundable Security Deposit of **₹{quoteDetails.securityDeposit.toLocaleString()}** to be paid separately before vehicle delivery.
                    </div>
                    <a
                      href={generateWhatsAppFromQuote()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-2 py-2.5 flex items-center justify-center space-x-2 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba59] transition-all font-bold text-xs uppercase tracking-wide"
                    >
                      <span>Inquire via WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Policy Quick Check
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      q: 'What is the minimum age to rent?',
                      a: 'The minimum age requirement is **21 years** with at least **3 years of active driving license history**.',
                    },
                    {
                      q: 'What is the fuel policy?',
                      a: 'All our rentals follow a **Full to Full** policy. Cars are delivered full and must be returned full. EVs are delivered with a minimum 80% charge.',
                    },
                    {
                      q: 'How is the security deposit refunded?',
                      a: 'The refundable security deposit is refunded within **48 to 72 working hours** after car return, post verification of minor damages, parking tolls, or traffic violations.',
                    },
                    {
                      q: 'Are there any speed limits?',
                      a: 'Yes, a speed limit of **120 km/h** is enforced on expressways and **80 km/h** in cities. Over-speeding triggers penalty charges.',
                    },
                    {
                      q: 'What is your insurance coverage?',
                      a: 'All vehicles come with comprehensive zero-depreciation insurance. In case of an accident, maximum user liability is limited to the security deposit amount if policies are complied with.',
                    },
                  ].map((faq, i) => (
                    <div key={i} className="p-3 bg-secondary/50 rounded-xl border border-border space-y-1.5">
                      <span className="block font-bold text-xs text-gold-400">{faq.q}</span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message Input Footer (only for chat tab) */}
          {activeTab === 'chat' && (
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-black/40 flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me about cars, pricing, or rules..."
                className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-secondary text-xs text-foreground focus:border-gold-500 focus:outline-none placeholder-muted-foreground/50"
              />
              <button
                type="submit"
                className="p-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black transition-all flex items-center justify-center shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { submitKyc, getBookingsByPhone, getKycByPhone } from '@/app/actions';
import {
  User, Award, BadgeCheck, FileText, CheckCircle2, AlertCircle,
  Clock, ShieldAlert, Calendar, MapPin, Upload, RefreshCw
} from 'lucide-react';

export default function DashboardContainer() {
  const { user, updateKycStatus } = useApp();

  // KYC form states
  const [docType, setDocType] = useState('Driving License');
  const [docNumber, setDocNumber] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
  const [kycSubmitStatus, setKycSubmitStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  // Bookings list state
  const [bookings, setBookings] = useState<any[]>([]);
  const [dbKyc, setDbKyc] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      setIsLoadingData(true);
      try {
        // Fetch bookings matching this user's phone number
        const dbBookings = await getBookingsByPhone(user.phone);
        
        // Match with localStorage bookings
        const local = localStorage.getItem('wheeligo-bookings') || '[]';
        const localBookings = JSON.parse(local);
        
        // Combine duplicates based on ID
        const combined = [...dbBookings];
        localBookings.forEach((lb: any) => {
          if (!combined.some(db => db.id === lb.id)) {
            combined.push({
              id: lb.id,
              customerPhone: user.phone,
              pickupLocation: lb.pickupLocation,
              dropoffLocation: lb.dropoffLocation,
              pickupDate: new Date(lb.pickupDate),
              returnDate: new Date(lb.returnDate),
              totalPrice: lb.price,
              status: lb.status,
              vehicle: { name: lb.vehicleName, brand: '', category: '' } as any,
              createdAt: new Date(),
            } as any);
          }
        });

        // Sort by date desc
        combined.sort((a, b) => new Date(b.pickupDate).getTime() - new Date(a.pickupDate).getTime());
        setBookings(combined);

        // Fetch database KYC record
        const kycRecord = await getKycByPhone(user.phone);
        if (kycRecord) {
          setDbKyc(kycRecord);
          updateKycStatus(kycRecord.status as any);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-gold-500 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold">Please Login first</h3>
        <p className="text-xs text-muted-foreground">Click "Login" on the top right navigation bar.</p>
      </div>
    );
  }

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) {
      alert('Document number is required.');
      return;
    }

    setKycSubmitStatus('LOADING');
    try {
      const mockFile = fileUrl || `simulated_files/${docType.toLowerCase().replace(/\s/g, '_')}_copy.jpg`;
      const mockSelfie = selfieUrl || 'simulated_files/customer_selfie.jpg';

      const response = await submitKyc({
        customerPhone: user.phone,
        docType,
        docNumber,
        fileUrl: mockFile,
        selfieUrl: mockSelfie,
      });

      if (response.success) {
        setKycSubmitStatus('SUCCESS');
        updateKycStatus('SUBMITTED');
        // Refresh local view
        setDbKyc(response.kyc);
      } else {
        setKycSubmitStatus('ERROR');
      }
    } catch (err) {
      console.error(err);
      setKycSubmitStatus('ERROR');
    }
  };

  // Membership Tier Configs
  const membershipTiers = {
    Silver: { progress: 30, nextTier: 'Gold', points: '120 / 300 pts', discount: '5% rent discount', upgrade: 'Free GPS Navigation' },
    Gold: { progress: 75, nextTier: 'Platinum', points: '450 / 600 pts', discount: '10% rent discount', upgrade: 'Priority concierge delivery, 50% deposit waiver' },
    Platinum: { progress: 100, nextTier: 'Max Tier reached', points: 'Elite Status', discount: '15% rent discount', upgrade: 'Guaranteed model upgrades, 100% deposit waiver' }
  };

  const currentTier = membershipTiers[user.membership] || membershipTiers.Silver;

  return (
    <div className="space-y-12">
      {/* 1. Profile and Membership summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Card */}
        <div className="lg:col-span-5 glass border border-border p-6 rounded-3xl flex items-center space-x-6 relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-gold-500/10 blur-2xl" />
          
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-black text-2xl shrink-0">
            {user.name.substring(0, 2).toUpperCase()}
          </div>

          <div className="space-y-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground truncate">{user.name}</h2>
            <span className="block text-xs text-muted-foreground truncate">{user.email}</span>
            <span className="block text-xs text-muted-foreground">{user.phone}</span>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-gold-500/10 text-[10px] font-bold text-gold-400 border border-gold-500/20 mt-2">
              <Award className="h-3.5 w-3.5" />
              <span>{user.membership} Member</span>
            </div>
          </div>
        </div>

        {/* Membership Tracker */}
        <div className="lg:col-span-7 glass border border-border p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
            <span>Membership Progress ({user.membership})</span>
            <span className="text-gold-400">{currentTier.points}</span>
          </div>

          <div className="h-2.5 w-full bg-secondary border border-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
              style={{ width: `${currentTier.progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-secondary/50 rounded-xl border border-border">
              <span className="block text-[10px] text-muted-foreground font-semibold">Tier Discount</span>
              <span className="block font-bold text-gold-400">{currentTier.discount}</span>
            </div>
            <div className="p-3 bg-secondary/50 rounded-xl border border-border">
              <span className="block text-[10px] text-muted-foreground font-semibold">Unlocked Upgrade</span>
              <span className="block font-bold text-foreground truncate">{currentTier.upgrade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KYC status and verification form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Status indicator / info panel */}
        <div className="lg:col-span-5 glass border border-border p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider flex items-center">
            <BadgeCheck className="h-4.5 w-4.5 mr-2 text-gold-500" />
            KYC Verification
          </h3>

          <div className="p-4 bg-secondary/60 rounded-2xl border border-border flex items-center space-x-4">
            {user.kycStatus === 'APPROVED' ? (
              <>
                <div className="p-2.5 bg-green-500/10 text-green-400 rounded-full shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-green-400">KYC Verified & Approved</span>
                  <span className="block text-[10px] text-muted-foreground leading-normal">
                    Your driving credentials are active. You can pick up any luxury vehicle instantly.
                  </span>
                </div>
              </>
            ) : user.kycStatus === 'SUBMITTED' ? (
              <>
                <div className="p-2.5 bg-yellow-500/10 text-yellow-400 rounded-full shrink-0 animate-pulse">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-yellow-400">Verification Pending</span>
                  <span className="block text-[10px] text-muted-foreground leading-normal">
                    We have received your files. An executive is auditing your license and will approve within 30 minutes.
                  </span>
                </div>
              </>
            ) : user.kycStatus === 'REJECTED' ? (
              <>
                <div className="p-2.5 bg-red-500/10 text-red-400 rounded-full shrink-0">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-red-400">KYC Declined</span>
                  <span className="block text-[10px] text-muted-foreground leading-normal">
                    Uploaded file was blurry or document expired. Please re-submit your driving license.
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="p-2.5 bg-red-500/10 text-red-400 rounded-full shrink-0">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-xs text-red-400">KYC Required</span>
                  <span className="block text-[10px] text-muted-foreground leading-normal">
                    Please submit your driving license and national identity details to enable express vehicle dispatch.
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground leading-relaxed space-y-2 font-sans pt-2">
            <span className="block font-bold text-foreground">Why do we require KYC?</span>
            <p>
              Self-drive insurance policies require verifying driver ages (21+) and active driving licenses (min 3 years). All data is encrypted and used only for booking audits.
            </p>
          </div>
        </div>

        {/* Upload form */}
        <div className="lg:col-span-7 glass border border-border p-6 rounded-3xl">
          {user.kycStatus === 'APPROVED' ? (
            <div className="text-center py-10 space-y-4">
              <div className="p-4 bg-green-500/10 text-green-400 rounded-full inline-flex">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Verified Account Details</h4>
              <div className="max-w-xs mx-auto p-3.5 bg-secondary/85 rounded-xl text-left text-xs border border-border">
                <span className="block text-muted-foreground mb-1">Uploaded credentials:</span>
                <span className="block font-semibold">Document: {dbKyc?.docType || 'Driving License'}</span>
                <span className="block font-semibold">License No: {dbKyc?.docNumber || '******98'}</span>
                <span className="block text-[10px] text-green-400 mt-2">✓ Verified via Wheeligo Audit</span>
              </div>
            </div>
          ) : kycSubmitStatus === 'SUCCESS' ? (
            <div className="text-center py-10 space-y-4">
              <div className="p-3 bg-green-500/10 text-green-400 rounded-full inline-flex">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-sm text-foreground">KYC Submitted Successfully!</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Thank you. We have saved your driving license copy and verification selfie. Our admin queue will review and update your status shortly.
              </p>
              <button
                onClick={() => setKycSubmitStatus('IDLE')}
                className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-gold-400"
              >
                Edit Uploads
              </button>
            </div>
          ) : (
            <form onSubmit={handleKycSubmit} className="space-y-4">
              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider mb-2">
                Submit Verification Documents
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none"
                  >
                    <option>Driving License</option>
                    <option>Aadhaar Card</option>
                    <option>Passport</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Document Number</label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="DL-362026000100"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Simulated file selector inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DL Image */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center">
                    <Upload className="h-3 w-3 mr-1 text-gold-500" />
                    Upload Document Copy
                  </label>
                  <input
                    type="text"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="Simulate path/filename.png"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none"
                  />
                  <span className="text-[9px] text-muted-foreground/60 block">
                    Select a document photo (or leave blank to auto-generate mock upload).
                  </span>
                </div>

                {/* Selfie */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center">
                    <Upload className="h-3 w-3 mr-1 text-gold-500" />
                    Upload Verification Selfie
                  </label>
                  <input
                    type="text"
                    value={selfieUrl}
                    onChange={(e) => setSelfieUrl(e.target.value)}
                    placeholder="Simulate selfie.png"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-xs text-foreground focus:outline-none"
                  />
                  <span className="text-[9px] text-muted-foreground/60 block">
                    Upload a portrait photo for identity comparison audits.
                  </span>
                </div>
              </div>

              {kycSubmitStatus === 'ERROR' && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl">
                  Failed to process KYC files. Please check parameters and try again.
                </div>
              )}

              <button
                type="submit"
                disabled={kycSubmitStatus === 'LOADING'}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-xs uppercase tracking-wider transition-all"
              >
                {kycSubmitStatus === 'LOADING' ? 'Uploading Files...' : 'Submit Verification Files'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3. Booking History Table */}
      <div className="glass border border-border p-6 md:p-8 rounded-3xl space-y-6">
        <h3 className="font-bold text-sm text-foreground uppercase tracking-wider border-b border-border pb-3 flex items-center">
          <Clock className="h-4.5 w-4.5 mr-2 text-gold-500" />
          Rental Booking History
        </h3>

        {isLoadingData ? (
          <div className="text-center py-10 flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin text-gold-500" />
            <span>Loading booking history...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
            <span>You have not made any booking inquiries yet.</span>
            <Link href="/fleet" className="block text-gold-400 hover:underline font-bold">
              Browse our fleet and calculate your first quote!
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground border-collapse">
              <thead>
                <tr className="border-b border-border text-foreground font-bold">
                  <th className="py-3">Booking ID</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Rental Period</th>
                  <th className="py-3 px-4 text-center">Hubs</th>
                  <th className="py-3 px-4 text-right">Rent Paid</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-4 font-mono text-[10px] text-foreground">{b.id.substring(0, 8)}...</td>
                    <td className="py-4 px-4 font-bold text-foreground">{b.vehicle.brand} {b.vehicle.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1 text-[10px]">
                        <Calendar className="h-3 w-3 text-gold-500 mr-1 shrink-0" />
                        <span>
                          {new Date(b.pickupDate).toLocaleDateString()} - {new Date(b.returnDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1 text-[9px] text-muted-foreground/80">
                        <MapPin className="h-3 w-3 text-gold-500 shrink-0" />
                        <span className="truncate max-w-[120px]" title={`From ${b.pickupLocation} to ${b.dropoffLocation}`}>
                          {b.pickupLocation.split(' ')[0]}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-gold-400 font-extrabold">₹{b.totalPrice.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                          b.status === 'APPROVED'
                            ? 'bg-green-950/40 border-green-500/25 text-green-400'
                            : b.status === 'PENDING'
                            ? 'bg-yellow-950/40 border-yellow-500/25 text-yellow-400 animate-pulse'
                            : 'bg-red-950/40 border-red-500/25 text-red-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

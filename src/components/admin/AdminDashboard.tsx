'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  updateBookingStatus,
  updateKycStatusAction,
  updateVehicleAvailability,
  getAdminData,
  createVehicleAction,
  updateVehicleAction,
  deleteVehicleAction
} from '@/app/actions';
import {
  ShieldAlert, Settings, LayoutDashboard, Clock, FileText,
  Car, MessageSquare, Check, X, RefreshCw, CheckCircle,
  Eye, ToggleLeft, ToggleRight, Phone, AlertCircle, Plus, Edit, Trash2
} from 'lucide-react';

interface AdminDashboardProps {
  initialData: {
    bookings: any[];
    inquiries: any[];
    kycDocs: any[];
    vehicles: any[];
  };
}

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const { user } = useApp();
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<'bookings' | 'kyc' | 'fleet' | 'inquiries'>('bookings');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Vehicle Form state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleFormMode, setVehicleFormMode] = useState<'add' | 'edit'>('add');
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const [vBrand, setVBrand] = useState('');
  const [vName, setVName] = useState('');
  const [vCategory, setVCategory] = useState('Luxury');
  const [vPrice, setVPrice] = useState(12000);
  const [vTransmission, setVTransmission] = useState('Automatic');
  const [vFuel, setVFuel] = useState('Petrol');
  const [vSeats, setVSeats] = useState(5);
  const [vLuggage, setVLuggage] = useState(3);
  const [vImage, setVImage] = useState('/images/fleet/porsche_taycan.png');
  const [vFeatures, setVFeatures] = useState('');
  const [vDeposit, setVDeposit] = useState(15000);
  const [vFuelPolicy, setVFuelPolicy] = useState('Full to Full');
  const [vInsurance, setVInsurance] = useState('Zero Depreciation Cover Included');
  const [vCancellation, setVCancellation] = useState('Free cancellation up to 24 hours before pickup');
  const [vFeatured, setVFeatured] = useState(false);

  const [vFormStatus, setVFormStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [vFormError, setVFormError] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const refreshed = await getAdminData();
      setData(refreshed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const openAddVehicleModal = () => {
    setVehicleFormMode('add');
    setEditingVehicleId(null);
    setVBrand('');
    setVName('');
    setVCategory('Luxury');
    setVPrice(12000);
    setVTransmission('Automatic');
    setVFuel('Petrol');
    setVSeats(5);
    setVLuggage(3);
    setVImage('/images/fleet/porsche_taycan.png');
    setVFeatures('Panoramic Roof, Apple CarPlay, Premium Sound');
    setVDeposit(15000);
    setVFuelPolicy('Full to Full');
    setVInsurance('Zero Depreciation Cover Included');
    setVCancellation('Free cancellation up to 24 hours before pickup');
    setVFeatured(false);
    setVFormStatus('IDLE');
    setIsVehicleModalOpen(true);
  };

  const openEditVehicleModal = (v: any) => {
    setVehicleFormMode('edit');
    setEditingVehicleId(v.id);
    setVBrand(v.brand);
    setVName(v.name);
    setVCategory(v.category);
    setVPrice(v.pricePerDay);
    setVTransmission(v.transmission);
    setVFuel(v.fuelType);
    setVSeats(v.seats);
    setVLuggage(v.luggage);
    setVImage(v.image);
    setVFeatures(v.features);
    setVDeposit(v.securityDeposit);
    setVFuelPolicy(v.fuelPolicy);
    setVInsurance(v.insuranceDetails);
    setVCancellation(v.cancellationPolicy);
    setVFeatured(v.featured);
    setVFormStatus('IDLE');
    setIsVehicleModalOpen(true);
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vBrand || !vName) {
      setVFormError('Brand and Name are required.');
      setVFormStatus('ERROR');
      return;
    }

    setVFormStatus('LOADING');
    try {
      const payload = {
        brand: vBrand,
        name: vName,
        category: vCategory,
        pricePerDay: Number(vPrice),
        transmission: vTransmission,
        fuelType: vFuel,
        seats: Number(vSeats),
        luggage: Number(vLuggage),
        image: vImage,
        features: vFeatures,
        securityDeposit: Number(vDeposit),
        fuelPolicy: vFuelPolicy,
        insuranceDetails: vInsurance,
        cancellationPolicy: vCancellation,
        featured: vFeatured
      };

      if (vehicleFormMode === 'add') {
        const res = await createVehicleAction(payload);
        if (res.success && res.vehicle) {
          setVFormStatus('SUCCESS');
          setData(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, res.vehicle].sort((a, b) => a.brand.localeCompare(b.brand))
          }));
          setIsVehicleModalOpen(false);
        } else {
          setVFormError(res.error || 'Failed to add vehicle.');
          setVFormStatus('ERROR');
        }
      } else {
        if (!editingVehicleId) return;
        const res = await updateVehicleAction(editingVehicleId, payload);
        if (res.success && res.vehicle) {
          setVFormStatus('SUCCESS');
          setData(prev => ({
            ...prev,
            vehicles: prev.vehicles.map(v => v.id === editingVehicleId ? res.vehicle : v)
          }));
          setIsVehicleModalOpen(false);
        } else {
          setVFormError(res.error || 'Failed to update vehicle.');
          setVFormStatus('ERROR');
        }
      }
    } catch (err) {
      console.error(err);
      setVFormError('An unexpected server error occurred.');
      setVFormStatus('ERROR');
    }
  };

  const handleVehicleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to remove ${name} from the fleet? This will permanently delete all associated booking records and reviews.`)) {
      return;
    }
    try {
      const res = await deleteVehicleAction(id);
      if (res.success) {
        setData(prev => ({
          ...prev,
          vehicles: prev.vehicles.filter(v => v.id !== id)
        }));
      } else {
        alert(res.error || 'Failed to delete vehicle.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold">Admin Authorization Required</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Please log in as an administrator to access this interface. You can click the **"Admin Demo"** button in the header menu to mock an admin session.
        </p>
      </div>
    );
  }

  const handleBookingAction = async (id: string, status: string) => {
    try {
      const res = await updateBookingStatus(id, status);
      if (res.success) {
        // Update local state
        setData(prev => ({
          ...prev,
          bookings: prev.bookings.map(b => b.id === id ? { ...b, status } : b)
        }));
      } else {
        alert('Failed to update booking status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKycAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await updateKycStatusAction(id, status);
      if (res.success) {
        setData(prev => ({
          ...prev,
          kycDocs: prev.kycDocs.map(k => k.id === id ? { ...k, status } : k),
          // Also sync statuses in booking views if loaded
          bookings: prev.bookings.map(b => b.customerPhone === res.kyc?.customerPhone ? { ...b, kycStatus: status } : b)
        }));
      } else {
        alert('Failed to update KYC status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVehicleToggle = async (id: string, currentlyAvailable: boolean) => {
    try {
      const targetState = !currentlyAvailable;
      const res = await updateVehicleAvailability(id, targetState);
      if (res.success) {
        setData(prev => ({
          ...prev,
          vehicles: prev.vehicles.map(v => v.id === id ? { ...v, available: targetState } : v)
        }));
      } else {
        alert('Failed to toggle vehicle availability.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // KPI Calculations
  const totalInquiries = data.inquiries.length;
  const pendingKycCount = data.kycDocs.filter(k => k.status === 'PENDING').length;
  const activeBookings = data.bookings.filter(b => b.status === 'APPROVED').length;
  const pendingBookings = data.bookings.filter(b => b.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      {/* 1. Header with refresh controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-gold-500" />
            <span>Wheeligo Administration Portal</span>
          </h1>
          <p className="text-xs text-muted-foreground">Manage fleet rentals, approve customer driving licenses, and trace callback messages.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 text-xs font-bold bg-secondary hover:bg-accent border border-border hover:border-gold-500/30 text-gold-400 rounded-xl transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Database'}</span>
        </button>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pending Bookings', val: pendingBookings, col: 'text-yellow-400', desc: 'Awaiting WhatsApp audit' },
          { label: 'Active Rentals', val: activeBookings, col: 'text-green-400', desc: 'Approved & ongoing trips' },
          { label: 'Pending KYC Checks', val: pendingKycCount, col: 'text-red-400', desc: 'License uploads to verify' },
          { label: 'Active Callback Feeds', val: totalInquiries, col: 'text-gold-400', desc: 'Website general queries' },
        ].map((kpi, idx) => (
          <div key={idx} className="p-5 rounded-3xl glass border border-border space-y-1">
            <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{kpi.label}</span>
            <span className={`block text-2xl font-black ${kpi.col}`}>{kpi.val}</span>
            <span className="block text-[9px] text-muted-foreground/60">{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* 3. Tab selectors */}
      <div className="flex border-b border-border text-xs md:text-sm">
        {[
          { id: 'bookings', name: 'Booking Queue', badge: pendingBookings, icon: <Clock className="h-4 w-4" /> },
          { id: 'kyc', name: 'KYC Checker', badge: pendingKycCount, icon: <FileText className="h-4 w-4" /> },
          { id: 'fleet', name: 'Fleet Toggles', icon: <Car className="h-4 w-4" /> },
          { id: 'inquiries', name: 'Callback Feeds', badge: totalInquiries, icon: <MessageSquare className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-4 font-bold border-b-2 transition-all relative ${
              activeTab === tab.id
                ? 'border-gold-500 text-gold-400 bg-gold-500/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="h-4.5 min-w-4.5 flex items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-1 ml-1 shrink-0">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. Queue Content tables */}
      <div className="glass border border-border rounded-3xl p-6 overflow-hidden">
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              WhatsApp Booking Requests Queue
            </h3>
            {data.bookings.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground">No bookings found in database.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse text-muted-foreground">
                  <thead>
                    <tr className="border-b border-border text-foreground font-bold">
                      <th className="py-3">Customer details</th>
                      <th className="py-3 px-4">Vehicle Selected</th>
                      <th className="py-3 px-4 text-center">Rental Period</th>
                      <th className="py-3 px-4 text-center">KYC status</th>
                      <th className="py-3 px-4 text-right">Quote</th>
                      <th className="py-3 px-4 text-right">Status</th>
                      <th className="py-3 px-4 text-center">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {data.bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-secondary/15">
                        <td className="py-4">
                          <span className="block font-bold text-foreground">{b.customerName}</span>
                          <span className="block text-[10px] text-muted-foreground">{b.customerPhone}</span>
                        </td>
                        <td className="py-4 px-4 font-bold text-foreground">
                          {b.vehicle.brand} {b.vehicle.name}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="block">{new Date(b.pickupDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}</span>
                          <span className="block text-[10px] text-muted-foreground">({b.duration} Days)</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                              b.kycStatus === 'APPROVED'
                                ? 'bg-green-950/40 border-green-500/25 text-green-400'
                                : b.kycStatus === 'SUBMITTED'
                                ? 'bg-yellow-950/40 border-yellow-500/25 text-yellow-400 animate-pulse'
                                : 'bg-red-950/40 border-red-500/25 text-red-400'
                            }`}
                          >
                            {b.kycStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-extrabold text-gold-400">₹{b.totalPrice.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                              b.status === 'APPROVED'
                                ? 'bg-green-950/40 border-green-500/25 text-green-400'
                                : b.status === 'PENDING'
                                ? 'bg-yellow-950/40 border-yellow-500/25 text-yellow-400'
                                : 'bg-red-950/40 border-red-500/25 text-red-400'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {b.status === 'PENDING' && (
                            <div className="flex space-x-1.5 justify-center">
                              <button
                                onClick={() => handleBookingAction(b.id, 'APPROVED')}
                                className="p-1 rounded bg-green-500 text-black hover:bg-green-400"
                                title="Approve Booking"
                              >
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </button>
                              <button
                                onClick={() => handleBookingAction(b.id, 'CANCELLED')}
                                className="p-1 rounded bg-red-500 text-black hover:bg-red-400"
                                title="Cancel Booking"
                              >
                                <X className="h-3.5 w-3.5 stroke-[3]" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              KYC Document Approvals Queue
            </h3>
            {data.kycDocs.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground">No KYC documents uploaded in database.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse text-muted-foreground">
                  <thead>
                    <tr className="border-b border-border text-foreground font-bold">
                      <th className="py-3">Phone number</th>
                      <th className="py-3 px-4">Doc Type</th>
                      <th className="py-3 px-4">Doc Number</th>
                      <th className="py-3 px-4 text-center">Auditing Files</th>
                      <th className="py-3 px-4 text-right">Status</th>
                      <th className="py-3 px-4 text-center">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {data.kycDocs.map((k) => (
                      <tr key={k.id} className="hover:bg-secondary/15">
                        <td className="py-4 font-semibold text-foreground">{k.customerPhone}</td>
                        <td className="py-4 px-4">{k.docType}</td>
                        <td className="py-4 px-4 font-mono">{k.docNumber}</td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex space-x-2 justify-center text-[10px] text-gold-400 font-bold">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              Doc Copy
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              Selfie
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                              k.status === 'APPROVED'
                                ? 'bg-green-950/40 border-green-500/25 text-green-400'
                                : k.status === 'PENDING'
                                ? 'bg-yellow-950/40 border-yellow-500/25 text-yellow-400 animate-pulse'
                                : 'bg-red-950/40 border-red-500/25 text-red-400'
                            }`}
                          >
                            {k.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {k.status === 'PENDING' && (
                            <div className="flex space-x-1.5 justify-center">
                              <button
                                onClick={() => handleKycAction(k.id, 'APPROVED')}
                                className="px-2 py-1 rounded bg-green-500 text-black hover:bg-green-400 font-bold text-[10px] flex items-center"
                              >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleKycAction(k.id, 'REJECTED')}
                                className="px-2 py-1 rounded bg-red-500 text-black hover:bg-red-400 font-bold text-[10px] flex items-center"
                              >
                                <X className="h-3.5 w-3.5 mr-1" />
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
                Fleet Availability Management
              </h3>
              <button
                onClick={openAddVehicleModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-black text-[10px] font-bold rounded-lg transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Vehicle</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse text-muted-foreground">
                <thead>
                  <tr className="border-b border-border text-foreground font-bold">
                    <th className="py-3">Vehicle Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Transmission</th>
                    <th className="py-3 px-4">Fuel</th>
                    <th className="py-3 px-4 text-right">Rent / Day</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-secondary/15">
                      <td className="py-4 flex items-center space-x-3">
                        <img
                          src={v.image}
                          alt={v.name}
                          className="h-9 w-14 object-cover rounded bg-secondary border border-border"
                        />
                        <span className="font-bold text-foreground">{v.brand} {v.name}</span>
                      </td>
                      <td className="py-4 px-4">{v.category}</td>
                      <td className="py-4 px-4">{v.transmission}</td>
                      <td className="py-4 px-4">{v.fuelType}</td>
                      <td className="py-4 px-4 text-right font-bold text-gold-400">₹{v.pricePerDay.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border ${
                            v.available
                              ? 'bg-green-950/40 border-green-500/25 text-green-400'
                              : 'bg-red-950/40 border-red-500/25 text-red-400'
                          }`}
                        >
                          {v.available ? 'AVAILABLE' : 'RENTED OUT'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditVehicleModal(v)}
                            className="p-1.5 rounded bg-secondary border border-border hover:border-gold-500/40 text-gold-400 hover:text-gold-300 transition-all animate-fade-in"
                            title="Edit Vehicle Specs"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleVehicleDelete(v.id, `${v.brand} ${v.name}`)}
                            className="p-1.5 rounded bg-red-500/10 border border-red-500/20 hover:border-red-500 hover:bg-red-500 text-red-400 hover:text-black transition-all animate-fade-in"
                            title="Remove Vehicle"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggle(v.id, v.available)}
                            className="p-1 rounded text-gold-400 hover:text-gold-300 transition-transform"
                            title="Toggle Availability"
                          >
                            {v.available ? (
                              <ToggleRight className="h-6 w-6 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              General Inquiries & Callback Leads
            </h3>
            {data.inquiries.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground">No inquiry messages in database.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.inquiries.map((inq) => (
                  <div key={inq.id} className="p-5 rounded-2xl bg-secondary/50 border border-border space-y-3 relative">
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded bg-gold-500/10 text-[9px] font-bold text-gold-400 border border-gold-500/20">
                      {inq.type}
                    </span>

                    <div className="space-y-0.5">
                      <span className="block font-bold text-foreground text-sm">{inq.name}</span>
                      <span className="block text-[10px] text-muted-foreground">{inq.email}</span>
                      <span className="block text-[10px] text-muted-foreground flex items-center pt-1 font-bold">
                        <Phone className="h-3 w-3 mr-1 text-gold-500" />
                        {inq.phone}
                      </span>
                    </div>

                    <div className="p-3 bg-black/40 border border-border rounded-xl text-xs leading-relaxed text-muted-foreground/80">
                      {inq.message}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/50 pt-2 border-t border-border/40">
                      <span>Received: {new Date(inq.createdAt).toLocaleString()}</span>
                      <span className="flex items-center text-green-400 font-bold">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Lead Logged
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* VEHICLE ADD/EDIT MODAL OVERLAY */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass border border-border w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-black/40">
              <h3 className="font-bold text-sm text-foreground flex items-center space-x-2">
                <Car className="h-4.5 w-4.5 text-gold-500" />
                <span>{vehicleFormMode === 'add' ? 'Add New Fleet Car' : 'Edit Vehicle Specifications'}</span>
              </h3>
              <button
                onClick={() => setIsVehicleModalOpen(false)}
                className="p-1.5 rounded-lg border border-border bg-secondary hover:text-gold-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleVehicleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Brand</label>
                  <input
                    type="text"
                    value={vBrand}
                    onChange={(e) => setVBrand(e.target.value)}
                    placeholder="E.g., Tesla"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Model Name</label>
                  <input
                    type="text"
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                    placeholder="E.g., Model Y"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
                  <select
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  >
                    <option>SUV</option>
                    <option>Sedan</option>
                    <option>Hatchback</option>
                    <option>Luxury</option>
                    <option>Electric</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Rent / Day (₹)</label>
                  <input
                    type="number"
                    value={vPrice}
                    onChange={(e) => setVPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Transmission</label>
                  <select
                    value={vTransmission}
                    onChange={(e) => setVTransmission(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Fuel Type</label>
                  <select
                    value={vFuel}
                    onChange={(e) => setVFuel(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Seats</label>
                  <input
                    type="number"
                    value={vSeats}
                    onChange={(e) => setVSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Luggage bags</label>
                  <input
                    type="number"
                    value={vLuggage}
                    onChange={(e) => setVLuggage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Security Deposit</label>
                  <input
                    type="number"
                    value={vDeposit}
                    onChange={(e) => setVDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Featured Car</label>
                  <div className="pt-2">
                    <input
                      type="checkbox"
                      checked={vFeatured}
                      onChange={(e) => setVFeatured(e.target.checked)}
                      className="accent-gold-500 h-4 w-4"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Image Path</label>
                <input
                  type="text"
                  value={vImage}
                  onChange={(e) => setVImage(e.target.value)}
                  placeholder="/images/fleet/carname.png"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Features (Comma-separated)</label>
                <textarea
                  value={vFeatures}
                  onChange={(e) => setVFeatures(e.target.value)}
                  placeholder="E.g., Panoramic sunroof, Apple CarPlay, HEPA Filter..."
                  rows={2}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Fuel Policy</label>
                  <input
                    type="text"
                    value={vFuelPolicy}
                    onChange={(e) => setVFuelPolicy(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Insurance Details</label>
                  <input
                    type="text"
                    value={vInsurance}
                    onChange={(e) => setVInsurance(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase font-sans">Cancellation Policy</label>
                  <input
                    type="text"
                    value={vCancellation}
                    onChange={(e) => setVCancellation(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {vFormStatus === 'ERROR' && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{vFormError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={vFormStatus === 'LOADING'}
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                {vFormStatus === 'LOADING' ? 'Saving Vehicle...' : 'Save Vehicle to Fleet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Helper toggle compatibility
  function handleToggle(id: string, available: boolean) {
    handleVehicleToggle(id, available);
  }
}

'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

// Mapping utilities for SQLite
const mapVehicle = (row: any) => row ? {
  ...row,
  available: Boolean(row.available),
  featured: Boolean(row.featured),
} : null;

const mapBooking = (row: any) => row ? {
  ...row,
  pickupDate: new Date(row.pickupDate),
  returnDate: new Date(row.returnDate),
  createdAt: new Date(row.createdAt),
} : null;

const mapReview = (row: any) => row ? {
  ...row,
  isGoogleReview: Boolean(row.isGoogleReview),
  date: new Date(row.date),
} : null;

const mapInquiry = (row: any) => row ? {
  ...row,
  resolved: Boolean(row.resolved),
  createdAt: new Date(row.createdAt),
} : null;

const mapBlog = (row: any) => row ? {
  ...row,
  createdAt: new Date(row.createdAt),
} : null;

const mapKyc = (row: any) => row ? {
  ...row,
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt),
} : null;

// --- VEHICLE ACTIONS ---

export async function getVehicles() {
  try {
    const rows = db.prepare('SELECT * FROM Vehicle ORDER BY pricePerDay ASC').all();
    return rows.map(mapVehicle);
  } catch (error) {
    console.error('Failed to get vehicles:', error);
    return [];
  }
}

export async function getVehicleById(id: string) {
  try {
    const row = db.prepare('SELECT * FROM Vehicle WHERE id = ?').get(id);
    if (!row) return null;
    const vehicle = mapVehicle(row);
    const reviews = db.prepare('SELECT * FROM Review WHERE vehicleId = ?').all(id).map(mapReview);
    return { ...vehicle, reviews };
  } catch (error) {
    console.error(`Failed to get vehicle by id ${id}:`, error);
    return null;
  }
}

// --- BOOKING ACTIONS ---

export async function createBooking(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  returnDate: Date;
  vehicleId: string;
  extras: string;
  totalPrice: number;
}) {
  try {
    const pickupDateObj = new Date(data.pickupDate);
    const returnDateObj = new Date(data.returnDate);
    const diffTime = Math.abs(returnDateObj.getTime() - pickupDateObj.getTime());
    const duration = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const vehicleRow = db.prepare('SELECT * FROM Vehicle WHERE id = ?').get(data.vehicleId);
    if (!vehicleRow) throw new Error('Vehicle not found');
    const vehicle = mapVehicle(vehicleRow) as any;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO Booking (
        id, customerName, customerEmail, customerPhone, pickupLocation, dropoffLocation,
        pickupDate, returnDate, duration, totalPrice, status, vehicleId, extras, kycStatus, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.customerName, data.customerEmail, data.customerPhone, data.pickupLocation, data.dropoffLocation,
      pickupDateObj.toISOString(), returnDateObj.toISOString(), duration, data.totalPrice, 'PENDING',
      data.vehicleId, data.extras, 'PENDING', now
    );

    const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+919876543210';
    const cleanWAPhone = waPhone.replace(/[^\d+]/g, '');
    const messageText = `*New Booking Inquiry - Wheeligo Premium Car Rental*\n\n` +
      `👤 *Customer Name:* ${data.customerName}\n` +
      `📞 *Phone:* ${data.customerPhone}\n` +
      `🚗 *Vehicle:* ${vehicle.brand} ${vehicle.name} (${vehicle.category})\n` +
      `📍 *Pickup:* ${data.pickupLocation}\n` +
      `📍 *Drop-off:* ${data.dropoffLocation}\n` +
      `📅 *Pickup Date/Time:* ${pickupDateObj.toLocaleString()}\n` +
      `📅 *Return Date/Time:* ${returnDateObj.toLocaleString()}\n` +
      `⏱️ *Duration:* ${duration} Day${duration > 1 ? 's' : ''}\n` +
      `🎁 *Add-ons:* ${data.extras || 'None'}\n` +
      `💰 *Estimated Rent:* ₹${data.totalPrice.toLocaleString()}\n\n` +
      `_Please confirm availability and KYC steps._`;

    const encodedMessage = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${cleanWAPhone}?text=${encodedMessage}`;

    revalidatePath('/admin');
    return { success: true, bookingId: id, waUrl };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return { success: false, error: 'Failed to submit booking inquiry.' };
  }
}

export async function getBookingsByPhone(phone: string) {
  try {
    const rows = db.prepare('SELECT * FROM Booking WHERE customerPhone = ? ORDER BY createdAt DESC').all(phone);
    return rows.map((row: any) => {
      const b = mapBooking(row);
      const v = db.prepare('SELECT * FROM Vehicle WHERE id = ?').get(row.vehicleId);
      return { ...b, vehicle: mapVehicle(v) };
    });
  } catch (error) {
    console.error(`Failed to get bookings for phone ${phone}:`, error);
    return [];
  }
}

// --- KYC ACTIONS ---

export async function getKycByPhone(phone: string) {
  try {
    const row = db.prepare('SELECT * FROM KYCDocument WHERE customerPhone = ?').get(phone);
    return mapKyc(row);
  } catch (error) {
    console.error(`Failed to get KYC by phone ${phone}:`, error);
    return null;
  }
}

export async function submitKyc(data: {
  customerPhone: string;
  docType: string;
  docNumber: string;
  fileUrl: string;
  selfieUrl: string;
}) {
  try {
    const now = new Date().toISOString();
    const existing = db.prepare('SELECT id FROM KYCDocument WHERE customerPhone = ?').get(data.customerPhone);
    let id;
    if (existing) {
      id = (existing as any).id;
      db.prepare(`
        UPDATE KYCDocument SET docType = ?, docNumber = ?, fileUrl = ?, selfieUrl = ?, status = 'PENDING', updatedAt = ?
        WHERE customerPhone = ?
      `).run(data.docType, data.docNumber, data.fileUrl, data.selfieUrl, now, data.customerPhone);
    } else {
      id = crypto.randomUUID();
      db.prepare(`
        INSERT INTO KYCDocument (id, customerPhone, docType, docNumber, fileUrl, selfieUrl, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)
      `).run(id, data.customerPhone, data.docType, data.docNumber, data.fileUrl, data.selfieUrl, now, now);
    }

    db.prepare(`
      UPDATE Booking SET kycStatus = 'SUBMITTED' WHERE customerPhone = ? AND kycStatus = 'PENDING'
    `).run(data.customerPhone);

    const kyc = db.prepare('SELECT * FROM KYCDocument WHERE id = ?').get(id);

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, kyc: mapKyc(kyc) };
  } catch (error) {
    console.error('Failed to submit KYC:', error);
    return { success: false, error: 'Failed to process KYC verification files.' };
  }
}

// --- INQUIRY & CALLBACK ACTIONS ---

export async function createInquiry(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  type: 'GENERAL' | 'CORPORATE' | 'CALLBACK';
}) {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO Inquiry (id, name, email, phone, message, type, resolved, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?)
    `).run(id, data.name, data.email, data.phone, data.message, data.type, now);
    
    revalidatePath('/admin');
    return { success: true, inquiryId: id };
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    return { success: false, error: 'Failed to send inquiry.' };
  }
}

// --- BLOG ACTIONS ---

export async function getBlogs() {
  try {
    const rows = db.prepare('SELECT * FROM BlogPost ORDER BY createdAt DESC').all();
    return rows.map(mapBlog);
  } catch (error) {
    console.error('Failed to get blogs:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const row = db.prepare('SELECT * FROM BlogPost WHERE slug = ?').get(slug);
    return mapBlog(row);
  } catch (error) {
    console.error(`Failed to get blog by slug ${slug}:`, error);
    return null;
  }
}

// --- REVIEWS & TESTIMONIALS ---

export async function getReviews(vehicleId?: string) {
  try {
    let rows;
    if (vehicleId) {
      rows = db.prepare('SELECT * FROM Review WHERE vehicleId = ? ORDER BY date DESC').all(vehicleId);
    } else {
      rows = db.prepare('SELECT * FROM Review ORDER BY date DESC').all();
    }
    return rows.map(mapReview);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return [];
  }
}

export async function createReview(data: {
  author: string;
  rating: number;
  text: string;
  vehicleId?: string;
}) {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO Review (id, author, rating, text, date, vehicleId, isGoogleReview)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).run(id, data.author, data.rating, data.text, now, data.vehicleId || null);

    if (data.vehicleId) {
      const allVehicleReviews = db.prepare('SELECT rating FROM Review WHERE vehicleId = ?').all(data.vehicleId);
      const reviewsCount = allVehicleReviews.length;
      const averageRating = parseFloat(
        (allVehicleReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewsCount).toFixed(1)
      );

      db.prepare(`
        UPDATE Vehicle SET rating = ?, reviewsCount = ? WHERE id = ?
      `).run(averageRating, reviewsCount, data.vehicleId);
    }

    const review = db.prepare('SELECT * FROM Review WHERE id = ?').get(id);

    revalidatePath(`/fleet/${data.vehicleId}`);
    return { success: true, review: mapReview(review) };
  } catch (error) {
    console.error('Failed to create review:', error);
    return { success: false, error: 'Failed to post review.' };
  }
}

// --- ADMIN CONTROL ACTIONS ---

export async function getAdminData() {
  try {
    const bookingRows = db.prepare('SELECT * FROM Booking ORDER BY createdAt DESC').all();
    const bookings = bookingRows.map((row: any) => {
      const b = mapBooking(row);
      const v = db.prepare('SELECT * FROM Vehicle WHERE id = ?').get(row.vehicleId);
      return { ...b, vehicle: mapVehicle(v) };
    });

    const inquiries = db.prepare('SELECT * FROM Inquiry ORDER BY createdAt DESC').all().map(mapInquiry);
    const kycDocs = db.prepare('SELECT * FROM KYCDocument ORDER BY updatedAt DESC').all().map(mapKyc);
    const vehicles = db.prepare('SELECT * FROM Vehicle ORDER BY brand ASC').all().map(mapVehicle);

    return { bookings, inquiries, kycDocs, vehicles };
  } catch (error) {
    console.error('Failed to load admin data:', error);
    return { bookings: [], inquiries: [], kycDocs: [], vehicles: [] };
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    db.prepare('UPDATE Booking SET status = ? WHERE id = ?').run(status, id);
    const booking = db.prepare('SELECT * FROM Booking WHERE id = ?').get(id);
    
    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, booking: mapBooking(booking) };
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return { success: false, error: 'Failed to update status.' };
  }
}

export async function updateKycStatusAction(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
  try {
    db.prepare('UPDATE KYCDocument SET status = ? WHERE id = ?').run(status, id);
    const kyc = db.prepare('SELECT * FROM KYCDocument WHERE id = ?').get(id) as any;

    if (kyc) {
      db.prepare('UPDATE Booking SET kycStatus = ? WHERE customerPhone = ?').run(status, kyc.customerPhone);
    }

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    return { success: true, kyc: mapKyc(kyc) };
  } catch (error) {
    console.error('Failed to update KYC status:', error);
    return { success: false, error: 'Failed to update status.' };
  }
}

export async function updateVehicleAvailability(id: string, available: boolean) {
  try {
    db.prepare('UPDATE Vehicle SET available = ? WHERE id = ?').run(available ? 1 : 0, id);
    const vehicle = db.prepare('SELECT * FROM Vehicle WHERE id = ?').get(id);
    
    revalidatePath('/fleet');
    revalidatePath(`/fleet/${id}`);
    revalidatePath('/admin');
    return { success: true, vehicle: mapVehicle(vehicle) };
  } catch (error) {
    console.error('Failed to update vehicle availability:', error);
    return { success: false, error: 'Failed to change availability.' };
  }
}

export async function createVehicleAction(data: {
  name: string;
  brand: string;
  category: string;
  pricePerDay: number;
  transmission: string;
  fuelType: string;
  seats: number;
  luggage: number;
  image: string;
  features: string;
  securityDeposit?: number;
  fuelPolicy?: string;
  insuranceDetails?: string;
  cancellationPolicy?: string;
  featured?: boolean;
}) {
  try {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const pricePerDay = parseFloat(data.pricePerDay as any);
    const seats = parseInt(data.seats as any);
    const luggage = parseInt(data.luggage as any);
    const image = data.image || '/images/fleet/porsche_taycan.png';
    const features = data.features || 'Standard Air Conditioning, Bluetooth Audio';
    const securityDeposit = data.securityDeposit ? parseFloat(data.securityDeposit as any) : 5000;
    const fuelPolicy = data.fuelPolicy || 'Full to Full';
    const insuranceDetails = data.insuranceDetails || 'Zero Depreciation Cover Included';
    const cancellationPolicy = data.cancellationPolicy || 'Free cancellation up to 24 hours before pickup';
    const featured = data.featured ? 1 : 0;

    db.prepare(`
      INSERT INTO Vehicle (
        id, name, brand, category, pricePerDay, transmission, fuelType, seats, luggage,
        image, images, rating, reviewsCount, securityDeposit, fuelPolicy, insuranceDetails,
        cancellationPolicy, features, available, featured, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    `).run(
      id, data.name, data.brand, data.category, pricePerDay, data.transmission, data.fuelType, seats, luggage,
      image, image, securityDeposit, fuelPolicy, insuranceDetails, cancellationPolicy, features, featured, now, now
    );

    const vehicle = db.prepare('SELECT * FROM Vehicle WHERE id = ?').get(id);

    revalidatePath('/fleet');
    revalidatePath('/admin');
    return { success: true, vehicle: mapVehicle(vehicle) };
  } catch (error) {
    console.error('Failed to create vehicle:', error);
    return { success: false, error: 'Failed to create vehicle in database.' };
  }
}

export async function updateVehicleAction(
  id: string,
  data: {
    name: string;
    brand: string;
    category: string;
    pricePerDay: number;
    transmission: string;
    fuelType: string;
    seats: number;
    luggage: number;
    image: string;
    features: string;
    securityDeposit?: number;
    fuelPolicy?: string;
    insuranceDetails?: string;
    cancellationPolicy?: string;
    featured?: boolean;
  }
) {
  try {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE Vehicle SET
        name = COALESCE(?, name),
        brand = COALESCE(?, brand),
        category = COALESCE(?, category),
        pricePerDay = COALESCE(?, pricePerDay),
        transmission = COALESCE(?, transmission),
        fuelType = COALESCE(?, fuelType),
        seats = COALESCE(?, seats),
        luggage = COALESCE(?, luggage),
        image = COALESCE(?, image),
        images = COALESCE(?, images),
        features = COALESCE(?, features),
        securityDeposit = COALESCE(?, securityDeposit),
        fuelPolicy = COALESCE(?, fuelPolicy),
        insuranceDetails = COALESCE(?, insuranceDetails),
        cancellationPolicy = COALESCE(?, cancellationPolicy),
        featured = COALESCE(?, featured),
        updatedAt = ?
      WHERE id = ?
    `).run(
      data.name ?? null,
      data.brand ?? null,
      data.category ?? null,
      data.pricePerDay !== undefined ? parseFloat(data.pricePerDay as any) : null,
      data.transmission ?? null,
      data.fuelType ?? null,
      data.seats !== undefined ? parseInt(data.seats as any) : null,
      data.luggage !== undefined ? parseInt(data.luggage as any) : null,
      data.image ?? null,
      data.image ?? null,
      data.features ?? null,
      data.securityDeposit !== undefined ? parseFloat(data.securityDeposit as any) : null,
      data.fuelPolicy ?? null,
      data.insuranceDetails ?? null,
      data.cancellationPolicy ?? null,
      data.featured !== undefined ? (data.featured ? 1 : 0) : null,
      now,
      id
    );

    const vehicle = db.prepare('SELECT * FROM Vehicle WHERE id = ?').get(id);

    revalidatePath('/fleet');
    revalidatePath(`/fleet/${id}`);
    revalidatePath('/admin');
    return { success: true, vehicle: mapVehicle(vehicle) };
  } catch (error) {
    console.error(`Failed to update vehicle ${id}:`, error);
    return { success: false, error: 'Failed to update vehicle details.' };
  }
}

export async function deleteVehicleAction(id: string) {
  try {
    const deleteReviews = db.prepare('DELETE FROM Review WHERE vehicleId = ?');
    const deleteBookings = db.prepare('DELETE FROM Booking WHERE vehicleId = ?');
    const deleteVehicle = db.prepare('DELETE FROM Vehicle WHERE id = ?');
    
    // Execute in a transaction
    const transaction = db.transaction(() => {
      deleteReviews.run(id);
      deleteBookings.run(id);
      deleteVehicle.run(id);
    });
    
    transaction();

    revalidatePath('/fleet');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete vehicle ${id}:`, error);
    return { success: false, error: 'Failed to delete vehicle.' };
  }
}

import React from 'react';
import { getAdminData } from '@/app/actions';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Console | Wheeligo Car Rentals',
  description: 'Manage car rental bookings, inquiries, KYC documents, and vehicle availabilities.',
};

export default async function AdminPage() {
  const adminData = await getAdminData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AdminDashboard initialData={adminData} />
    </div>
  );
}

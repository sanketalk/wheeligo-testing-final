import React from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';

export const metadata = {
  title: 'Customer Dashboard | Wheeligo Car Rentals',
  description: 'Manage your active self-drive car reservations, check membership status, and submit KYC credentials.',
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DashboardContainer />
    </div>
  );
}

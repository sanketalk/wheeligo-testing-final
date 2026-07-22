import React from 'react';
import { notFound } from 'next/navigation';
import { getVehicleById, getVehicles } from '@/app/actions';
import VehicleDetailContainer from '@/components/fleet/VehicleDetailContainer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const vehicle = await getVehicleById(resolvedParams.id);
  if (!vehicle) return { title: 'Vehicle Not Found | Wheeligo' };
  
  return {
    title: `Rent ${vehicle.brand} ${vehicle.name} | Wheeligo`,
    description: `Rent the premium self-drive ${vehicle.brand} ${vehicle.name} (${vehicle.category}) starting at ₹${vehicle.pricePerDay.toLocaleString()} per day. Comprehensive insurance cover.`,
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const [vehicle, allVehicles] = await Promise.all([
    getVehicleById(resolvedParams.id),
    getVehicles()
  ]);

  if (!vehicle) {
    notFound();
  }

  // Filter similar category or brand cars, excluding the current car
  const similarVehicles = allVehicles.filter(
    (v: any) => (v.category === vehicle.category || v.brand === vehicle.brand) && v.id !== vehicle.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <VehicleDetailContainer
        vehicle={vehicle}
        similarVehicles={similarVehicles.length > 0 ? similarVehicles : allVehicles.filter((v: any) => v.id !== vehicle.id)}
      />
    </div>
  );
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: string;
  pricePerDay: number;
  transmission: string;
  fuelType: string;
  seats: number;
  luggage: number;
  image: string;
  images: string;
  rating: number;
  reviewsCount: number;
  securityDeposit: number;
  fuelPolicy: string;
  insuranceDetails: string;
  cancellationPolicy: string;
  features: string;
  available: boolean;
  featured: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  membership: 'Silver' | 'Gold' | 'Platinum';
  kycStatus: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  isAdmin: boolean;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  user: User | null;
  login: (role: 'customer' | 'admin') => void;
  signup: (name: string, email: string, phone: string, membership: 'Silver' | 'Gold' | 'Platinum') => void;
  logout: () => void;
  wishlist: string[];
  toggleWishlist: (vehicleId: string) => void;
  comparisonList: Vehicle[];
  addToComparison: (vehicle: Vehicle) => boolean;
  removeFromComparison: (vehicleId: string) => void;
  clearComparison: () => void;
  updateKycStatus: (status: User['kycStatus']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme Management
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // User Authentication Simulation
  const [user, setUser] = useState<User | null>(null);

  // Wishlist and Comparison lists
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [comparisonList, setComparisonList] = useState<Vehicle[]>([]);

  // Load configuration from local storage
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('wheeligo-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      document.documentElement.className = 'dark';
    }

    // Load user
    const savedUser = localStorage.getItem('wheeligo-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Default auto-login as customer for premium preview convenience
      const defaultUser: User = {
        name: 'Aarav Mehta',
        email: 'aarav.mehta@gmail.com',
        phone: '+919876543210',
        membership: 'Gold',
        kycStatus: 'PENDING',
        isAdmin: false,
      };
      setUser(defaultUser);
      localStorage.setItem('wheeligo-user', JSON.stringify(defaultUser));
    }

    // Load wishlist
    const savedWishlist = localStorage.getItem('wheeligo-wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('wheeligo-theme', nextTheme);
    document.documentElement.className = nextTheme;
  };

  const login = (role: 'customer' | 'admin') => {
    let loggedUser: User;
    if (role === 'admin') {
      loggedUser = {
        name: 'Wheeligo Executive',
        email: 'admin@wheeligo.com',
        phone: '+919999988888',
        membership: 'Platinum',
        kycStatus: 'APPROVED',
        isAdmin: true,
      };
    } else {
      loggedUser = {
        name: 'Aarav Mehta',
        email: 'aarav.mehta@gmail.com',
        phone: '+919876543210',
        membership: 'Gold',
        kycStatus: 'PENDING',
        isAdmin: false,
      };
    }
    setUser(loggedUser);
    localStorage.setItem('wheeligo-user', JSON.stringify(loggedUser));
  };

  const signup = (name: string, email: string, phone: string, membership: 'Silver' | 'Gold' | 'Platinum') => {
    const newUser: User = {
      name,
      email,
      phone,
      membership,
      kycStatus: 'PENDING',
      isAdmin: false,
    };
    setUser(newUser);
    localStorage.setItem('wheeligo-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wheeligo-user');
  };

  const updateKycStatus = (status: User['kycStatus']) => {
    if (!user) return;
    const updatedUser = { ...user, kycStatus: status };
    setUser(updatedUser);
    localStorage.setItem('wheeligo-user', JSON.stringify(updatedUser));
  };

  const toggleWishlist = (vehicleId: string) => {
    let nextWishlist: string[];
    if (wishlist.includes(vehicleId)) {
      nextWishlist = wishlist.filter((id) => id !== vehicleId);
    } else {
      nextWishlist = [...wishlist, vehicleId];
    }
    setWishlist(nextWishlist);
    localStorage.setItem('wheeligo-wishlist', JSON.stringify(nextWishlist));
  };

  const addToComparison = (vehicle: Vehicle) => {
    if (comparisonList.some((v) => v.id === vehicle.id)) return false;
    if (comparisonList.length >= 3) {
      alert('You can compare a maximum of 3 vehicles at a time.');
      return false;
    }
    setComparisonList([...comparisonList, vehicle]);
    return true;
  };

  const removeFromComparison = (vehicleId: string) => {
    setComparisonList(comparisonList.filter((v) => v.id !== vehicleId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        login,
        signup,
        logout,
        wishlist,
        toggleWishlist,
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        updateKycStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

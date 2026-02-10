export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Barbershop {
  id: string;
  name: string;
  description: string;
  address: string;
  distance?: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isOpen: boolean;
  openingHours: string;
}

export interface Stylist {
  id: string;
  name: string;
  shopId: string;
  avatarUrl: string;
  specialty: string;
  rating: number;
  reviewCount: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  shopId: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  shopId: string;
  stylistId: string;
  serviceId: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  shop: Barbershop;
  stylist: Stylist;
  service: Service;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  shopId: string;
  rating: number;
  comment: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

import type {
  Barbershop,
  Stylist,
  Service,
  Appointment,
  Review,
  TimeSlot,
} from "@/types";

export const mockShops: Barbershop[] = [
  {
    id: "shop-1",
    name: "The Gentleman's Cut",
    description:
      "Premium barbershop experience with skilled stylists and a relaxing atmosphere.",
    address: "123 Main Street, Downtown",
    distance: "0.5 km",
    rating: 4.8,
    reviewCount: 256,
    imageUrl:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800",
    isOpen: true,
    openingHours: "9:00 AM - 8:00 PM",
  },
  {
    id: "shop-2",
    name: "Urban Fade Studio",
    description:
      "Modern cuts and classic styles. Specializing in fades and beard grooming.",
    address: "456 Oak Avenue, Midtown",
    distance: "1.2 km",
    rating: 4.6,
    reviewCount: 189,
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800",
    isOpen: true,
    openingHours: "10:00 AM - 9:00 PM",
  },
  {
    id: "shop-3",
    name: "Classic Cuts Barbershop",
    description:
      "Traditional barbershop with a modern twist. Hot towel shaves and precision cuts.",
    address: "789 Elm Street, Uptown",
    distance: "2.0 km",
    rating: 4.9,
    reviewCount: 312,
    imageUrl:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800",
    isOpen: false,
    openingHours: "8:00 AM - 6:00 PM",
  },
  {
    id: "shop-4",
    name: "The Barber Lounge",
    description:
      "Luxury grooming experience. Complimentary drinks and premium products.",
    address: "321 Pine Road, East Side",
    distance: "3.5 km",
    rating: 4.7,
    reviewCount: 178,
    imageUrl:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800",
    isOpen: true,
    openingHours: "9:00 AM - 7:00 PM",
  },
];

export const mockStylists: Stylist[] = [
  {
    id: "stylist-1",
    name: "Marcus Williams",
    shopId: "shop-1",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    specialty: "Fades & Tapers",
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: "stylist-2",
    name: "James Thompson",
    shopId: "shop-1",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    specialty: "Classic Cuts",
    rating: 4.7,
    reviewCount: 67,
  },
  {
    id: "stylist-3",
    name: "David Chen",
    shopId: "shop-2",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    specialty: "Beard Styling",
    rating: 4.8,
    reviewCount: 54,
  },
  {
    id: "stylist-4",
    name: "Michael Brown",
    shopId: "shop-2",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    specialty: "Modern Styles",
    rating: 4.6,
    reviewCount: 43,
  },
];

export const mockServices: Service[] = [
  {
    id: "service-1",
    name: "Classic Haircut",
    description: "Traditional haircut with clippers and scissors",
    price: 25,
    duration: 30,
    shopId: "shop-1",
  },
  {
    id: "service-2",
    name: "Fade & Style",
    description: "Precision fade with styling",
    price: 35,
    duration: 45,
    shopId: "shop-1",
  },
  {
    id: "service-3",
    name: "Beard Trim",
    description: "Shape and trim your beard",
    price: 15,
    duration: 20,
    shopId: "shop-1",
  },
  {
    id: "service-4",
    name: "Hot Towel Shave",
    description: "Relaxing hot towel treatment with straight razor shave",
    price: 30,
    duration: 40,
    shopId: "shop-1",
  },
  {
    id: "service-5",
    name: "Full Service",
    description: "Haircut, beard trim, and hot towel treatment",
    price: 55,
    duration: 75,
    shopId: "shop-1",
  },
];

export const mockReviews: Review[] = [
  {
    id: "review-1",
    userId: "user-1",
    shopId: "shop-1",
    rating: 5,
    comment: "Best haircut I've ever had! Marcus really knows his craft.",
    userName: "John D.",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "review-2",
    userId: "user-2",
    shopId: "shop-1",
    rating: 4,
    comment: "Great atmosphere and skilled barbers. Will definitely come back.",
    userName: "Mike R.",
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: "review-3",
    userId: "user-3",
    shopId: "shop-1",
    rating: 5,
    comment:
      "Premium experience from start to finish. The hot towel shave is amazing.",
    userName: "Chris L.",
    createdAt: "2024-01-05T16:45:00Z",
  },
];

export function generateTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const available = Math.random() > 0.3;
      slots.push({
        id: `slot-${hour}-${minute}`,
        time,
        available,
      });
    }
  }

  return slots;
}

export function getShopById(id: string): Barbershop | undefined {
  return mockShops.find((shop) => shop.id === id);
}

export function getStylistsByShopId(shopId: string): Stylist[] {
  return mockStylists.filter((stylist) => stylist.shopId === shopId);
}

export function getServicesByShopId(shopId: string): Service[] {
  return mockServices.filter((service) => service.shopId === shopId);
}

export function getReviewsByShopId(shopId: string): Review[] {
  return mockReviews.filter((review) => review.shopId === shopId);
}

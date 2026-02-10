import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Appointment, User, Barbershop, Stylist, Service } from "@/types";

const KEYS = {
  USER: "@tatekulu/user",
  APPOINTMENTS: "@tatekulu/appointments",
  FAVORITES: "@tatekulu/favorites",
  RECENT_SEARCHES: "@tatekulu/recent_searches",
};

// User
export async function getStoredUser(): Promise<User | null> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setStoredUser(user: User): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export async function clearStoredUser(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.USER);
}

// Appointments
export async function getStoredAppointments(): Promise<Appointment[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function setStoredAppointments(
  appointments: Appointment[],
): Promise<void> {
  await AsyncStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

export async function addAppointment(appointment: Appointment): Promise<void> {
  const appointments = await getStoredAppointments();
  appointments.unshift(appointment);
  await setStoredAppointments(appointments);
}

export async function updateAppointment(
  id: string,
  updates: Partial<Appointment>,
): Promise<void> {
  const appointments = await getStoredAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates };
    await setStoredAppointments(appointments);
  }
}

export async function cancelAppointment(id: string): Promise<void> {
  await updateAppointment(id, { status: "cancelled" });
}

// Favorites
export async function getFavoriteShops(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function toggleFavoriteShop(shopId: string): Promise<boolean> {
  const favorites = await getFavoriteShops();
  const index = favorites.indexOf(shopId);
  if (index !== -1) {
    favorites.splice(index, 1);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    return false;
  } else {
    favorites.push(shopId);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
  }
}

// Recent Searches
export async function getRecentSearches(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.RECENT_SEARCHES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addRecentSearch(query: string): Promise<void> {
  const searches = await getRecentSearches();
  const filtered = searches.filter((s) => s !== query);
  filtered.unshift(query);
  const limited = filtered.slice(0, 10);
  await AsyncStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(limited));
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

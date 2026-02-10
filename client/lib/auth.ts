import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, getApiUrl } from "@/lib/query-client";

// Token keys
const ACCESS_TOKEN_KEY = "tatekulu_access_token";
const REFRESH_TOKEN_KEY = "tatekulu_refresh_token";
const USER_KEY = "tatekulu_user";

export type UserRole = "customer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// Secure storage helpers (uses SecureStore on native, AsyncStorage on web)
async function secureSet(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function secureGet(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(key);
  } else {
    return SecureStore.getItemAsync(key);
  }
}

async function secureDelete(key: string): Promise<void> {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

// Token management
export async function storeTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    secureSet(ACCESS_TOKEN_KEY, tokens.accessToken),
    secureSet(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return secureGet(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return secureGet(REFRESH_TOKEN_KEY);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    secureDelete(ACCESS_TOKEN_KEY),
    secureDelete(REFRESH_TOKEN_KEY),
    secureDelete(USER_KEY),
  ]);
}

// User storage
export async function storeUser(user: AuthUser): Promise<void> {
  await secureSet(USER_KEY, JSON.stringify(user));
}

export async function getStoredAuthUser(): Promise<AuthUser | null> {
  try {
    const data = await secureGet(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// API calls (these would connect to your backend)
export async function loginApi(
  credentials: LoginCredentials,
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  // Simulated API response for demo - replace with actual API call
  // const response = await apiRequest("POST", "/api/auth/login", credentials);
  // const data = await response.json();

  // Demo implementation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (
    credentials.email === "admin@tatekulu.com" &&
    credentials.password === "admin123"
  ) {
    return {
      user: {
        id: "admin-1",
        email: credentials.email,
        name: "Admin User",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      tokens: {
        accessToken: "demo_access_token_admin",
        refreshToken: "demo_refresh_token_admin",
        expiresIn: 3600,
      },
    };
  }

  if (credentials.email && credentials.password === "password123") {
    return {
      user: {
        id: `user-${Date.now()}`,
        email: credentials.email,
        name: credentials.email.split("@")[0],
        role: "customer",
        createdAt: new Date().toISOString(),
      },
      tokens: {
        accessToken: "demo_access_token",
        refreshToken: "demo_refresh_token",
        expiresIn: 3600,
      },
    };
  }

  throw new Error("Invalid email or password");
}

export async function signupApi(
  credentials: SignupCredentials,
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  // Simulated API response for demo
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    user: {
      id: `user-${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      phone: credentials.phone,
      role: "customer",
      createdAt: new Date().toISOString(),
    },
    tokens: {
      accessToken: "demo_access_token",
      refreshToken: "demo_refresh_token",
      expiresIn: 3600,
    },
  };
}

export async function requestPasswordResetApi(
  data: PasswordResetRequest,
): Promise<void> {
  // Simulated API response
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // In production: await apiRequest("POST", "/api/auth/forgot-password", data);
}

export async function confirmPasswordResetApi(
  data: PasswordResetConfirm,
): Promise<void> {
  // Simulated API response
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // In production: await apiRequest("POST", "/api/auth/reset-password", data);
}

export async function refreshTokensApi(
  refreshToken: string,
): Promise<AuthTokens> {
  // Simulated API response
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    accessToken: "new_access_token",
    refreshToken: "new_refresh_token",
    expiresIn: 3600,
  };
}

export async function logoutApi(): Promise<void> {
  await clearTokens();
}

// JWT decode helper (basic implementation - use jwt-decode in production)
export function decodeToken(
  token: string,
): { exp: number; role: UserRole } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}

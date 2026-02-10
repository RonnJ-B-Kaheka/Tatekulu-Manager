import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const secureStorage = {
  async setToken(token: string) {
    if (Platform.OS === "web") {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  },

  async getToken() {
    if (Platform.OS === "web") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken() {
    if (Platform.OS === "web") {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },

  async setUser(user: any) {
    const data = JSON.stringify(user);
    if (Platform.OS === "web") {
      localStorage.setItem(USER_KEY, data);
    } else {
      await SecureStore.setItemAsync(USER_KEY, data);
    }
  },

  async getUser() {
    let data;
    if (Platform.OS === "web") {
      data = localStorage.getItem(USER_KEY);
    } else {
      data = await SecureStore.getItemAsync(USER_KEY);
    }
    return data ? JSON.parse(data) : null;
  },

  async removeUser() {
    if (Platform.OS === "web") {
      localStorage.removeItem(USER_KEY);
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  },
};

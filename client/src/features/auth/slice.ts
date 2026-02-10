import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { secureStorage } from "../../lib/storage";

interface User {
  id: string;
  email: string;
  role: "admin" | "customer" | "barber";
  name: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true, // Start loading to check storage
  error: null,
  isAuthenticated: false,
};

// Async Thunks
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUser",
  async () => {
    const token = await secureStorage.getToken();
    const user = await secureStorage.getUser();
    if (token && user) {
      return { token, user };
    }
    return null;
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      // Mock API call - replace with real API
      // const response = await api.post('/auth/login', credentials);
      // return response.data;

      // SIMULATED RESPONSE
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (credentials.email === "admin@tatekulu.com") {
        return {
          token: "mock-jwt-token-admin",
          user: {
            id: "1",
            email: credentials.email,
            role: "admin" as const,
            name: "Admin User",
          },
        };
      }
      return {
        token: "mock-jwt-token-customer",
        user: {
          id: "2",
          email: credentials.email,
          role: "customer" as const,
          name: "John Doe",
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await secureStorage.removeToken();
  await secureStorage.removeUser();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load User
    builder.addCase(loadUserFromStorage.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadUserFromStorage.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    });
    builder.addCase(loadUserFromStorage.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // Persist
        secureStorage.setToken(action.payload.token);
        secureStorage.setUser(action.payload.user);
      },
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

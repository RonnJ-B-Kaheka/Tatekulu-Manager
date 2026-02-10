import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import * as Haptics from "expo-haptics";
import {
  AuthUser,
  UserRole,
  LoginCredentials,
  SignupCredentials,
  PasswordResetRequest,
  loginApi,
  signupApi,
  requestPasswordResetApi,
  logoutApi,
  storeTokens,
  storeUser,
  getStoredAuthUser,
  getAccessToken,
  clearTokens,
} from "@/lib/auth";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [token, user] = await Promise.all([
        getAccessToken(),
        getStoredAuthUser(),
      ]);

      if (token && user) {
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const { user, tokens } = await loginApi(credentials);

      await Promise.all([storeTokens(tokens), storeUser(user)]);

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const { user, tokens } = await signupApi(credentials);

      await Promise.all([storeTokens(tokens), storeUser(user)]);

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear local state even if API fails
      await clearTokens();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const requestPasswordReset = useCallback(
    async (data: PasswordResetRequest) => {
      await requestPasswordResetApi(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [],
  );

  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!state.user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(state.user.role);
    },
    [state.user],
  );

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    logout,
    requestPasswordReset,
    hasRole,
    isAdmin: state.user?.role === "admin",
    isCustomer: state.user?.role === "customer",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// HOC for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole | UserRole[],
): React.FC<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, hasRole, isLoading } = useAuth();

    if (isLoading) {
      return null; // Or loading spinner
    }

    if (!isAuthenticated) {
      return null; // Navigation should handle redirect
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return null; // Unauthorized
    }

    return <Component {...props} />;
  };
}

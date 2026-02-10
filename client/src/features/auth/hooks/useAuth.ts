import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store"; // We need to create store first
import { loginUser, logoutUser, clearError } from "../slice";
import { useCallback } from "react";

// NOTE: This file assumes store is set up. We need to create client/src/store/index.ts

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const login = useCallback(
    (credentials: any) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    resetError,
    isAdmin,
    isCustomer,
  };
};

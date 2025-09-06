import { useJWTAuth, useJWTAuthActions } from "@/services/jwt-auth/JWTAuthProvider";

export const useAuthUser = () => {
  const { user, isAuthenticated, isLoading } = useJWTAuth();
  return { user, isAuthenticated, isLoading };
};
export const useAuthActions = () => {
  const { signInUser, logout, requestPasswordReset, resetPassword } =
    useJWTAuthActions();
  return { signInUser, logout, requestPasswordReset, resetPassword };
};

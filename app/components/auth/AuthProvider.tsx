"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import VisitorModal from "./VisitorModal";
import {
  getCognitoOAuthUrl,
  refreshTokens,
  revokeToken,
  getUserInfoFromToken,
  isTokenExpired,
  decodeJWT,
} from "ditwaru-aws-helpers";
import { User } from "@/app/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVisitor: boolean;
  signInWithSSO: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisitor, setIsVisitor] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  };

  const refreshUserToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return false;

    try {
      const newTokens = await refreshTokens(
        process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
        process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
        refreshToken
      );

      localStorage.setItem("access_token", newTokens.access_token);
      localStorage.setItem("id_token", newTokens.id_token);

      const userInfo = getUserInfoFromToken(newTokens.id_token);
      setUser({
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        given_name: userInfo.given_name,
        family_name: userInfo.family_name,
        picture: userInfo.picture,
      });

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  const checkAuthStatus = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token");
    const idToken = localStorage.getItem("id_token");

    if (!accessToken || !idToken) {
      clearTokens();
      return;
    }

    if (isTokenExpired(accessToken) || isTokenExpired(idToken)) {
      const refreshSuccess = await refreshUserToken();
      if (!refreshSuccess) {
        clearTokens();
      }
      return;
    }

    try {
      const userInfo = getUserInfoFromToken(idToken);
      const groups = (await decodeJWT(idToken))["cognito:groups"] || [];

      setUser({
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        given_name: userInfo.given_name,
        family_name: userInfo.family_name,
        picture: userInfo.picture,
        groups,
      });

      // Check if user is a visitor (single group = google group)
      const isVisitorUser = groups.length === 1 && groups.includes("us-east-1_XjMDRhNhv_Google");
      setIsVisitor(isVisitorUser);

      // Show visitor modal if this is a visitor
      if (isVisitorUser) {
        setShowVisitorModal(true);
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      clearTokens();
    }
  }, []);

  const signInWithSSO = () => {
    const oauthUrl = getCognitoOAuthUrl(
      process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      `${window.location.origin}/auth/callback`,
      "openid email profile"
    );

    localStorage.setItem("redirect_after_login", window.location.pathname);
    window.location.href = oauthUrl;
  };

  const signOut = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      try {
        await revokeToken(
          process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
          process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
          refreshToken
        );
      } catch (error) {
        console.error("Token revocation failed:", error);
      }
    }

    clearTokens();
  };

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isVisitor,
        signInWithSSO,
        signOut,
      }}
    >
      {children}
      <VisitorModal isOpen={showVisitorModal} onClose={() => setShowVisitorModal(false)} />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

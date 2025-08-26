"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getCognitoOAuthUrl,
  exchangeCodeForTokens,
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
  signInWithSSO: () => void;
  signOut: () => void;
  refreshUserToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();

    // Also check when window regains focus (useful after OAuth redirect)
    const handleFocus = () => {
      checkAuthStatus();
    };

    // Listen for custom auth events (when tokens are added/removed)
    const handleAuthEvent = () => {
      // Small delay to ensure the change is complete
      setTimeout(checkAuthStatus, 100);
    };

    // Poll for tokens after redirects (useful for OAuth flows)
    let pollInterval: NodeJS.Timeout;
    const startPolling = () => {
      pollInterval = setInterval(() => {
        const hasTokens = localStorage.getItem("access_token") && localStorage.getItem("id_token");
        if (hasTokens && !isAuthenticated) {
          checkAuthStatus();
          clearInterval(pollInterval);
        }
      }, 500); // Check every 500ms
    };

    // Start polling if we're not authenticated
    if (!isAuthenticated) {
      startPolling();
    }

    window.addEventListener("focus", handleFocus);
    window.addEventListener("auth-tokens-stored", handleAuthEvent);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("auth-tokens-stored", handleAuthEvent);
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const idToken = localStorage.getItem("id_token");

      if (!accessToken || !idToken) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Check if tokens are expired
      if (isTokenExpired(accessToken) || isTokenExpired(idToken)) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          await refreshUserToken();
          return;
        } else {
          // No refresh token, clear everything
          localStorage.removeItem("access_token");
          localStorage.removeItem("id_token");
          localStorage.removeItem("refresh_token");
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }
      }

      // Tokens are valid, extract user info
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

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      // Clear tokens on error
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  };

  const signInWithSSO = () => {
    const oauthUrl = getCognitoOAuthUrl(
      process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      `${window.location.origin}/auth/callback`,
      "openid email profile"
    );

    // Store current URL for redirect after login
    localStorage.setItem("redirect_after_login", window.location.pathname);
    window.location.href = oauthUrl;
  };

  const refreshUserToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const newTokens = await refreshTokens(
        process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
        process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
        refreshToken
      );

      localStorage.setItem("access_token", newTokens.access_token);
      localStorage.setItem("id_token", newTokens.id_token);

      // Update user info from new ID token
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
    } catch (error) {
      await signOut();
    }
  };

  const signOut = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          await revokeToken(
            process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
            process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
            refreshToken
          );
        } catch (revokeError) {
          // Token revocation failed, but continuing with sign out
        }
      }
    } catch (error) {
      // Unexpected error during sign out
    } finally {
      // Clear all tokens regardless of revocation success
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        signInWithSSO,
        signOut,
        refreshUserToken,
      }}
    >
      {children}
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

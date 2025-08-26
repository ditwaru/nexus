"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForTokens } from "ditwaru-aws-helpers";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          setError(`Authentication failed: ${error}`);
          return;
        }

        if (!code) {
          setError("No authorization code received");
          return;
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(
          process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
          process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
          code,
          `${window.location.origin}/auth/callback`
        );

        // Store tokens
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("id_token", tokens.id_token);
        if (tokens.refresh_token) {
          localStorage.setItem("refresh_token", tokens.refresh_token);
        }

        // Dispatch custom event to notify AuthProvider
        window.dispatchEvent(new CustomEvent("auth-tokens-stored"));

        // Get redirect URL
        const redirectUrl = localStorage.getItem("redirect_after_login") || "/";
        localStorage.removeItem("redirect_after_login");

        // Redirect to intended page
        router.push(redirectUrl);
      } catch (error) {
        console.error(error);
        setError("Failed to complete authentication");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Completing Login...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}

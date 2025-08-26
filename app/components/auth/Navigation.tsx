"use client";

import { useAuth } from "./AuthProvider";
import Image from "next/image";

export default function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Nexus</h1>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {user.picture && (
                  <Image
                    className="rounded-full"
                    src={user.picture}
                    alt={user.name || user.email || "User"}
                    width={32}
                    height={32}
                  />
                )}
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">
                    {user.name || user.given_name || user.email}
                  </p>
                  {user.email && user.name && <p className="text-gray-500">{user.email}</p>}
                </div>
              </div>

              <button
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

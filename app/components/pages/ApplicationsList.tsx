"use client";

import { hasPermission } from "@/app/lib/utils";
import Link from "next/link";
import { useAuth } from "../auth/AuthProvider";

interface Application {
  id: string;
  name: string;
  description: string;
  type: string;
  lastUpdated: string;
  status: string;
}

interface ApplicationsListProps {
  applications: Application[];
}

export default function ApplicationsList({ applications }: ApplicationsListProps) {
  const { user, isVisitor } = useAuth();

  // If user is a visitor, show all applications (read-only access)
  // If user is not a visitor, filter by permissions
  const displayApplications = isVisitor
    ? applications
    : applications.filter((app) => hasPermission(user, app.id));

  if (displayApplications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h2>
        <p className="text-gray-600">
          {isVisitor
            ? "No applications are currently available."
            : "No applications are available for your access level."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayApplications.map((app) => (
        <Link
          key={app.id}
          href={`/${app.id}`}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer block"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                app.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {app.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{app.description}</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Type:</strong> {app.type}
            </p>
            <p>
              <strong>Last Updated:</strong> {new Date(app.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

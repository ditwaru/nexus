import { listApplications } from "ditwaru-aws-helpers";
import ApplicationsList from "../components/pages/ApplicationsList";
import Navigation from "../components/auth/Navigation";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default async function Home() {
  const tableNames = await listApplications();

  // Transform table names into application objects
  const applications = tableNames.map((tableName) => ({
    id: tableName,
    name: tableName.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()), // Convert "daniel-itwaru" to "Daniel Itwaru"
    description: `Content management for ${tableName.replace(/-/g, " ")}`,
    type: "Application", // You could make this more specific based on table naming conventions
    lastUpdated: new Date().toISOString().split("T")[0], // Today's date as placeholder
    status: "active",
  }));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Applications</h1>
            <ApplicationsList applications={applications} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

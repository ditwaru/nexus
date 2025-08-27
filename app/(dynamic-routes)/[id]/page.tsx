import { get } from "ditwaru-aws-helpers";
import AppOverviewWrapper from "../../components/pages/AppOverviewWrapper";
import Navigation from "../../components/auth/Navigation";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default async function AppPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pages = await get(id);

    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <AppOverviewWrapper data={pages} tableName={id} />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  } catch (error) {
    console.error("Failed to fetch app data:", error);
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
                <p className="text-gray-600">The requested application could not be loaded.</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }
}

import { get } from "ditwaru-aws-helpers";
import PageEditor from "../../../components/pages/PageEditor";
import Navigation from "../../../components/auth/Navigation";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ id: string; section: string }>;
}) {
  try {
    const { id, section } = await params;
    const pages = await get(id);
    const page = pages.find((p) => p.page === section);

    if (!page) {
      return (
        <ProtectedRoute>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                  <p className="text-gray-600">The requested page could not be found.</p>
                </div>
              </div>
            </main>
          </div>
        </ProtectedRoute>
      );
    }

    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <PageEditor pageData={page} tableName={id} pageId={section} />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  } catch (error) {
    console.error("Failed to fetch page data:", error);
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Page</h1>
                <p className="text-gray-600">Failed to load the requested page.</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }
}

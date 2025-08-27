import { Page } from "ditwaru-aws-helpers";
import Navigation from "../auth/Navigation";
import Image from "next/image";

interface ReadOnlyPageProps {
  page: Page;
  tableName: string;
}

export default function ReadOnlyPage({ page, tableName }: ReadOnlyPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                  {page.page?.replace(/-/g, " ") || "Untitled Page"}
                </h1>
                <p className="text-gray-600 mt-2">Read-only view - No editing allowed</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  🔒 Read Only
                </span>
                <span className="text-sm text-gray-500">
                  Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Read-Only Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-blue-600 mr-3">ℹ️</div>
              <div>
                <p className="text-blue-800 font-medium">Visitor Access</p>
                <p className="text-blue-700 text-sm">
                  You have read-only access to this content. You can view all sections and content,
                  but cannot make any changes.
                </p>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="space-y-6">
            {page.sections?.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getSectionTypeColor(
                        section.type || "content"
                      )}`}
                    >
                      {getSectionTypeLabel(section.type || "content")}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  </div>
                </div>

                {/* Section Content Display */}
                <div className="space-y-3">
                  {section.text && (
                    <div className="text-gray-700">
                      {Array.isArray(section.text) ? (
                        section.text.map((paragraph, i) => (
                          <p key={i} className="mb-2">
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p>{section.text}</p>
                      )}
                    </div>
                  )}

                  {section.image && (
                    <div className="mt-4">
                      <Image
                        src={section.image}
                        alt={section.title || "Section image"}
                        width={800}
                        height={400}
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Back to Overview */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href={`/${tableName}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Overview
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper functions for section styling
function getSectionTypeColor(type: string) {
  switch (type) {
    case "hero":
      return "bg-blue-100 text-blue-800";
    case "story":
      return "bg-green-100 text-green-800";
    case "content":
      return "bg-purple-100 text-purple-800";
    case "services":
      return "bg-indigo-100 text-indigo-800";
    case "baseline":
      return "bg-orange-100 text-orange-800";
    case "addOns":
      return "bg-yellow-100 text-yellow-800";
    case "contact":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getSectionTypeLabel(type: string) {
  switch (type) {
    case "hero":
      return "Hero";
    case "story":
      return "Story";
    case "content":
      return "Content";
    case "services":
      return "Services";
    case "baseline":
      return "Baseline";
    case "addOns":
      return "Add-ons";
    case "contact":
      return "Contact";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

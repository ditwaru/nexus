"use client";

import { useState } from "react";
import Link from "next/link";
import { Page } from "ditwaru-aws-helpers";

interface AppOverviewProps {
  data: Page[];
  tableName?: string;
}

export default function AppOverview({ data, tableName = "daniel-itwaru" }: AppOverviewProps) {
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Debug: Log the data being received
  console.log("AppOverview component received data:", data);
  console.log("Data type:", typeof data);
  console.log("Data length:", Array.isArray(data) ? data.length : "Not an array");

  const handleAddPage = async () => {
    if (!newPageName.trim()) return;

    try {
      const newPage: Page = {
        page: newPageName.trim().toLowerCase().replace(/\s+/g, "-"),
        title: newPageName.trim(),
        sections: [
          {
            type: "hero",
            title: newPageName.trim(),
            text: "New page description",
          },
        ],
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newPage, tableName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create page");
      }

      // Refresh the page to show the new page
      window.location.reload();
    } catch (error) {
      console.error("Failed to create page:", error);
      alert("Failed to create page. Please try again.");
    }
  };

  const handleDeletePage = async (pageName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the "${pageName}" page? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(pageName);
    try {
      const response = await fetch("/api/content", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageName, tableName }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete page");
      }

      // Refresh the page to remove the deleted page
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete page:", error);
      alert("Failed to delete page. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  const getSectionTypeColor = (type: string) => {
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
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSectionTypeLabel = (type: string) => {
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
        return "Add-Ons";
      case "contact":
        return "Contact";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-4 border-b border-gray-200">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-gray-700">
                    Applications
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-500 capitalize">
                      {tableName.replace("-", " ")}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {tableName.replace("-", " ")} - CMS
                </h1>
                <p className="text-gray-600 mt-2">Manage your application pages</p>
              </div>
              <button
                onClick={() => setIsAddingPage(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                + Add Page
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Page Modal */}
        {isAddingPage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Add New Page</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
                  <input
                    type="text"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="e.g., About, Portfolio, Contact"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && handleAddPage()}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddPage}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Page
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingPage(false);
                      setNewPageName("");
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pages Stack */}
        <div className="space-y-4">
          {data.map((page, index) => (
            <div
              key={page.page || `page-${index}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Page Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {page.page ? page.page.replace(/-/g, " ") : `Page ${index + 1}`}
                      </h3>
                      <p className="text-sm text-gray-600">{page.title || "Untitled Page"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {page.sections?.length || 0} sections
                    </span>
                    <button
                      onClick={() => handleDeletePage(page.page || `page-${index}`)}
                      disabled={isDeleting === (page.page || `page-${index}`)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors disabled:opacity-50"
                      title="Delete page"
                    >
                      {isDeleting === (page.page || `page-${index}`) ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Page Content Preview */}
              <div className="px-6 py-4">
                <div className="space-y-3">
                  {page.sections?.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border-l-4 border-gray-200 pl-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getSectionTypeColor(
                            section.type || "content"
                          )}`}
                        >
                          {getSectionTypeLabel(section.type || "content")}
                        </span>
                        <span className="text-sm font-medium text-gray-700">{section.title}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {section.text ? (
                          Array.isArray(section.text) ? (
                            <div>
                              {section.text.slice(0, 2).map((paragraph, i) => (
                                <p key={i} className="mb-1">
                                  {paragraph.length > 100
                                    ? `${paragraph.substring(0, 100)}...`
                                    : paragraph}
                                </p>
                              ))}
                              {section.text.length > 2 && (
                                <p className="text-gray-500 italic">
                                  +{section.text.length - 2} more paragraphs
                                </p>
                              )}
                            </div>
                          ) : (
                            <p>
                              {section.text.length > 100
                                ? `${section.text.substring(0, 100)}...`
                                : section.text}
                            </p>
                          )
                        ) : (
                          <p className="text-gray-500 italic">
                            {section.type === "services" && "Service packages configured"}
                            {section.type === "baseline" && "Baseline inclusions configured"}
                            {section.type === "addOns" && "Add-on items configured"}
                            {section.type === "contact" && "Contact information configured"}
                            {!["services", "baseline", "addOns", "contact"].includes(
                              section.type
                            ) && "No content preview available"}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/${tableName}/${page.page || `page-${index}`}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Page Content
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Pages Yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first page to start building your application.
            </p>
            <button
              onClick={() => setIsAddingPage(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              + Create First Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

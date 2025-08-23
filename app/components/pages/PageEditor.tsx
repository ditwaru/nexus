"use client";

import { useState } from "react";
import Link from "next/link";
import { Page, PageSection } from "ditwaru-aws-helpers";

interface PageEditorProps {
  pageData: Page;
  tableName: string;
  pageId: string;
}

export default function PageEditor({ pageData, tableName, pageId }: PageEditorProps) {
  const [editingPage, setEditingPage] = useState<Page>(pageData);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const handleFieldChange = (field: keyof Page, value: string) => {
    setEditingPage({
      ...editingPage,
      [field]: value,
    });
  };

  const handleSectionChange = (
    sectionIndex: number,
    field: keyof PageSection,
    value: string | string[]
  ) => {
    const updatedSections = [...editingPage.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [field]: value,
    };

    setEditingPage({
      ...editingPage,
      sections: updatedSections,
    });
  };

  const handleAddSection = () => {
    if (!newSectionType.trim() || !newSectionTitle.trim()) return;

    const newSection: PageSection = {
      type: newSectionType.trim(),
      title: newSectionTitle.trim(),
      text: "New section content",
    };

    setEditingPage({
      ...editingPage,
      sections: [...editingPage.sections, newSection],
    });

    // Reset form
    setNewSectionType("");
    setNewSectionTitle("");
    setIsAddingSection(false);
  };

  const handleRemoveSection = (sectionIndex: number) => {
    const updatedSections = editingPage.sections.filter((_, index) => index !== sectionIndex);
    setEditingPage({
      ...editingPage,
      sections: updatedSections,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...editingPage, tableName }),
      });

      if (!response.ok) {
        throw new Error("Failed to save page");
      }

      // Redirect back to the application overview
      window.location.href = `/${tableName}`;
    } catch (error) {
      console.error("Failed to save page:", error);
      alert("Failed to save page. Please try again.");
    } finally {
      setIsSaving(false);
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
                    <Link
                      href={`/${tableName}`}
                      className="ml-4 text-sm font-medium text-gray-500 capitalize hover:text-gray-700"
                    >
                      {tableName.replace("-", " ")}
                    </Link>
                  </div>
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
                      {pageId.replace("-", " ")}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                Edit {pageId.replace("-", " ")} Page
              </h1>
              <p className="text-gray-600 mt-2">Modify the content and sections for this page</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href={`/${tableName}`}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Page Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
                <input
                  type="text"
                  value={editingPage.page}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Page Sections</h2>
              <button
                onClick={() => setIsAddingSection(true)}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-4">
              {editingPage.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Section {sectionIndex + 1}: {section.type}
                    </h3>
                    <button
                      onClick={() => handleRemoveSection(sectionIndex)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      title="Remove section"
                    >
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
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Type
                      </label>
                      <input
                        type="text"
                        value={section.type}
                        onChange={(e) => handleSectionChange(sectionIndex, "type", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionChange(sectionIndex, "title", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    {Array.isArray(section.text) ? (
                      <div className="space-y-2">
                        <textarea
                          value={(section.text as string[]).join("\n\n")}
                          onChange={(e) => {
                            const paragraphs = e.target.value.split("\n\n").filter((p) => p.trim());
                            handleSectionChange(sectionIndex, "text", paragraphs);
                          }}
                          rows={8}
                          placeholder="Enter your content here. Use double line breaks to separate paragraphs."
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
                        />
                        <p className="text-xs text-gray-500">
                          Use double line breaks (press Enter twice) to separate paragraphs
                        </p>
                      </div>
                    ) : (
                      <textarea
                        value={section.text as string}
                        onChange={(e) => handleSectionChange(sectionIndex, "text", e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {isAddingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
                <input
                  type="text"
                  value={newSectionType}
                  onChange={(e) => setNewSectionType(e.target.value)}
                  placeholder="e.g., hero, story, content"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="e.g., About Me, My Story"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddSection}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Section
                </button>
                <button
                  onClick={() => {
                    setIsAddingSection(false);
                    setNewSectionType("");
                    setNewSectionTitle("");
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
    </div>
  );
}

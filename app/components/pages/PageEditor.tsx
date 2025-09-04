"use client";

import { useState } from "react";
import Link from "next/link";
import { Page, PageSection } from "ditwaru-aws-helpers";
import { getSectionSchema } from "@/lib/cms/schemas";
import DynamicSectionEditor from "@/components/cms/DynamicSectionEditor";
import SectionTypeSelector from "@/components/cms/SectionTypeSelector";
import { useAuth } from "../auth/AuthProvider";
import ReadOnlyPage from "./ReadOnlyPage";

interface PageEditorProps {
  pageData: Page;
  tableName: string;
  pageId: string;
}

// Extended section type that allows dynamic properties
interface ExtendedPageSection extends PageSection {
  [key: string]: unknown;
}

export default function PageEditor({ pageData, tableName, pageId }: PageEditorProps) {
  const { isVisitor } = useAuth();

  // All hooks must be called before any conditional returns
  const [editingPage, setEditingPage] = useState<Page>(pageData);
  const [originalPage] = useState<Page>(pageData); // Keep original for comparison
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

  // Theme management - only for home pages
  const isHomePage = pageId === "home";
  const [theme, setTheme] = useState<string>(pageData.theme || "summer");

  // If user is a visitor, show read-only version
  if (isVisitor) {
    return <ReadOnlyPage page={pageData} tableName={tableName} />;
  }

  // Check if there are any changes
  const hasChanges = isHomePage
    ? JSON.stringify({ ...editingPage, theme }) !==
      JSON.stringify({ ...originalPage, theme: originalPage.theme || "summer" })
    : JSON.stringify(editingPage) !== JSON.stringify(originalPage);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Include theme in page data if this is a home page
      const pageDataToSave = isHomePage ? { ...editingPage, theme } : editingPage;

      const response = await fetch(`/api/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableName, ...pageDataToSave }),
      });

      if (!response.ok) {
        throw new Error("Failed to save page");
      }

      // Refresh the page data
      window.location.reload();
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Failed to save page. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSectionChange = (sectionIndex: number, newData: Record<string, unknown>) => {
    const updatedSections = [...editingPage.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      ...newData,
    };
    setEditingPage({
      ...editingPage,
      sections: updatedSections,
    });
  };

  const handleAddSection = (type: string, title: string) => {
    const schema = getSectionSchema(type);
    if (!schema) return;

    // Create new section with default values based on schema
    const newSection: ExtendedPageSection = {
      type,
      title,
      text: "", // Will be populated by schema fields
    };

    // Initialize with default values from schema
    Object.entries(schema.fields).forEach(([fieldName, fieldSchema]) => {
      if (fieldName === "title") return; // Skip title as it's already set

      if (fieldSchema.type === "array") {
        newSection[fieldName] = [];
      } else if (fieldSchema.type === "object") {
        newSection[fieldName] = {};
      } else {
        newSection[fieldName] = "";
      }
    });

    setEditingPage({
      ...editingPage,
      sections: [...editingPage.sections, newSection],
    });

    setIsAddingSection(false);
  };

  const handleRemoveSection = (sectionIndex: number) => {
    if (confirm("Are you sure you want to remove this section?")) {
      const updatedSections = editingPage.sections.filter((_, index) => index !== sectionIndex);
      setEditingPage({
        ...editingPage,
        sections: updatedSections,
      });
    }
  };

  const handleEditSection = (sectionIndex: number) => {
    setEditingSectionIndex(editingSectionIndex === sectionIndex ? null : sectionIndex);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${tableName}`}
            className="text-blue-600 hover:text-blue-800 transition-colors mb-2 inline-block"
          >
            ← Back to {tableName}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{editingPage.title}</h1>
          <p className="text-gray-600 mt-2">Edit page content and sections</p>
        </div>

        {/* Page Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Page Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page ID</label>
              <input
                type="text"
                value={editingPage.page}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Page ID cannot be changed as it&apos;s used as the database identifier
              </p>
            </div>
            {isHomePage && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                  <option value="spring">Spring</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select a seasonal theme for this home page
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Sections</h2>
            <button
              onClick={() => setIsAddingSection(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
            >
              + Add Section
            </button>
          </div>

          <div className="space-y-4">
            {editingPage.sections.map((section, sectionIndex) => {
              const schema = getSectionSchema(section.type);
              const isEditing = editingSectionIndex === sectionIndex;

              return (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg">
                  {/* Section Header */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {section.type}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">
                        {section.title || `Untitled ${section.type} section`}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSection(sectionIndex)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        {isEditing ? "Close Editor" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleRemoveSection(sectionIndex)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Section Content */}
                  {isEditing && schema ? (
                    <div className="p-4">
                      <DynamicSectionEditor
                        schema={schema}
                        data={section as ExtendedPageSection}
                        onChange={(newData) => handleSectionChange(sectionIndex, newData)}
                      />
                    </div>
                  ) : (
                    <div className="p-4">
                      {schema ? (
                        <div className="text-sm text-gray-600">
                          <p>Click &quot;Edit&quot; to modify this {section.type} section</p>
                        </div>
                      ) : (
                        <div className="text-sm text-red-600">
                          <p>Unknown section type: {section.type}</p>
                          <p>This section may have been created with a different schema version.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {editingPage.sections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No sections yet</p>
                <p className="text-sm mt-1">Click &quot;Add Section&quot; to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Section Modal */}
        {isAddingSection && (
          <SectionTypeSelector
            onSelect={handleAddSection}
            onCancel={() => setIsAddingSection(false)}
          />
        )}

        {/* Save Button - Fixed at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-40">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {hasChanges ? (
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span>You have unsaved changes</span>
                </span>
              ) : (
                "No changes to save"
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/${tableName}`}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium border border-gray-300"
              >
                {hasChanges ? "Cancel" : "Back"}
              </Link>
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Spacing for Fixed Save Button */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}

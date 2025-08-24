"use client";

import { useState } from "react";
import { SECTION_SCHEMAS, getAllSectionTypes } from "@/lib/cms/schemas";

interface SectionTypeSelectorProps {
  onSelect: (type: string, title: string) => void;
  onCancel: () => void;
}

export default function SectionTypeSelector({ onSelect, onCancel }: SectionTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState("");
  const [title, setTitle] = useState("");

  const sectionTypes = getAllSectionTypes();

  const handleSubmit = () => {
    if (selectedType) {
      onSelect(selectedType, title.trim());
    }
  };

  const selectedSchema = selectedType ? SECTION_SCHEMAS[selectedType] : null;

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Section</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Section Type</label>
            <div className="grid grid-cols-2 gap-2">
              {sectionTypes.map((type) => {
                const schema = SECTION_SCHEMAS[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      selectedType === type
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-300 hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    <div className="font-medium text-sm">{schema.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{schema.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedSchema && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Section Title <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g., ${selectedSchema.fields.title?.placeholder || "Section Title (optional)"}`}
                className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!selectedType}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Section
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium border border-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

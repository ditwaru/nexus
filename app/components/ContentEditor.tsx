import { useState, useEffect } from "react";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  published: boolean;
  updatedAt: string;
  variant?: string;
  buttons?: Array<{
    text: string;
    href: string;
    variant: string;
  }>;
}

interface ContentEditorProps {
  content: ContentItem | null;
  onSave: (content: ContentItem) => void;
  onCancel: () => void;
}

export default function ContentEditor({ content, onSave, onCancel }: ContentEditorProps) {
  const [formData, setFormData] = useState<ContentItem>({
    id: "",
    title: "",
    description: "",
    type: "hero",
    published: true,
    updatedAt: new Date().toISOString(),
    variant: "blue",
    buttons: [],
  });

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleInputChange = (field: keyof ContentItem, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleButtonChange = (
    index: number,
    field: keyof NonNullable<ContentItem["buttons"]>[0],
    value: string
  ) => {
    if (!formData.buttons) return;

    const newButtons = [...formData.buttons];
    newButtons[index] = {
      ...newButtons[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      buttons: newButtons,
    }));
  };

  const addButton = () => {
    const newButton = {
      text: "",
      href: "",
      variant: "primary",
    };

    setFormData((prev) => ({
      ...prev,
      buttons: [...(prev.buttons || []), newButton],
    }));
  };

  const removeButton = (index: number) => {
    if (!formData.buttons) return;

    const newButtons = formData.buttons.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      buttons: newButtons,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update the timestamp
    const updatedContent = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedContent);
  };

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No content selected for editing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
        <button
          onClick={onCancel}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {/* <XMarkIcon className="h-4 w-4 mr-2" /> */}
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                Content ID
              </label>
              <input
                type="text"
                id="id"
                value={formData.id}
                onChange={(e) => handleInputChange("id", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Content Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="hero">Hero Section</option>
                <option value="section">Content Section</option>
                <option value="card">Card Component</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="variant" className="block text-sm font-medium text-gray-700">
                Variant
              </label>
              <select
                id="variant"
                value={formData.variant}
                onChange={(e) => handleInputChange("variant", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                checked={formData.published}
                onChange={(e) => handleInputChange("published", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Published
              </label>
            </div>
          </div>
        </div>

        {/* Buttons Configuration */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Buttons</h3>
            <button
              type="button"
              onClick={addButton}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {/* <PlusIcon className="h-4 w-4 mr-2" /> */}
              Add Button
            </button>
          </div>

          {formData.buttons && formData.buttons.length > 0 ? (
            <div className="space-y-4">
              {formData.buttons.map((button, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Text</label>
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) => handleButtonChange(index, "text", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Link</label>
                      <input
                        type="text"
                        value={button.href}
                        onChange={(e) => handleButtonChange(index, "href", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="/about"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Style</label>
                      <select
                        value={button.variant}
                        onChange={(e) => handleButtonChange(index, "variant", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="primary">Primary</option>
                        <option value="outline">Outline</option>
                        <option value="secondary">Secondary</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeButton(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {/* <TrashIcon className="h-5 w-5" /> */}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {`No buttons configured. Click "Add Button" to get started.`}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

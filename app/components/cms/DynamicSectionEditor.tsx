"use client";

import { FieldSchema, SectionSchema } from "@/lib/cms/schemas";

interface DynamicSectionEditorProps {
  schema: SectionSchema;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function DynamicSectionEditor({
  schema,
  data,
  onChange,
}: DynamicSectionEditorProps) {
  const handleFieldChange = (fieldName: string, value: unknown) => {
    const newData = { ...data, [fieldName]: value };
    onChange(newData);
  };

  const renderField = (fieldName: string, fieldSchema: FieldSchema, value: unknown) => {
    const fieldId = `field-${fieldName}`;

    switch (fieldSchema.type) {
      case "text":
        return (
          <input
            id={fieldId}
            type="text"
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={fieldSchema.placeholder}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required={fieldSchema.required}
          />
        );

      case "textarea":
        return (
          <textarea
            id={fieldId}
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={fieldSchema.placeholder}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y"
            required={fieldSchema.required}
          />
        );

      case "number":
        return (
          <input
            id={fieldId}
            type="number"
            value={(value as number) || ""}
            onChange={(e) => handleFieldChange(fieldName, parseInt(e.target.value) || 0)}
            placeholder={fieldSchema.placeholder}
            min={fieldSchema.validation?.min}
            max={fieldSchema.validation?.max}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required={fieldSchema.required}
          />
        );

      case "url":
      case "email":
      case "tel":
      case "date":
      case "datetime":
      case "time":
      case "color":
        return (
          <div>
            <input
              id={fieldId}
              type={fieldSchema.type === "datetime" ? "datetime-local" : fieldSchema.type}
              value={(value as string) || ""}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              placeholder={fieldSchema.placeholder}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required={fieldSchema.required}
              minLength={fieldSchema.validation?.minLength}
              maxLength={fieldSchema.validation?.maxLength}
              pattern={fieldSchema.validation?.pattern}
            />
            {fieldSchema.helpText && (
              <p className="text-xs text-gray-500 mt-1">{fieldSchema.helpText}</p>
            )}
          </div>
        );

      case "range":
        return (
          <div>
            <div className="flex items-center space-x-4">
              <input
                id={fieldId}
                type="range"
                value={(value as number) || fieldSchema.validation?.min || 0}
                onChange={(e) => handleFieldChange(fieldName, parseInt(e.target.value))}
                min={fieldSchema.validation?.min || 0}
                max={fieldSchema.validation?.max || 100}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                required={fieldSchema.required}
              />
              <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                {(value as number) || fieldSchema.validation?.min || 0}
              </span>
            </div>
            {fieldSchema.helpText && (
              <p className="text-xs text-gray-500 mt-1">{fieldSchema.helpText}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                id={fieldId}
                type="checkbox"
                checked={(value as boolean) || false}
                onChange={(e) => handleFieldChange(fieldName, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                required={fieldSchema.required}
              />
              <span className="text-sm text-gray-900">
                {fieldSchema.placeholder || "Enable this option"}
              </span>
            </label>
            {fieldSchema.helpText && (
              <p className="text-xs text-gray-500 mt-1">{fieldSchema.helpText}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div>
            <div className="space-y-2">
              {fieldSchema.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={fieldId}
                    value={option}
                    checked={(value as string) === option}
                    onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    required={fieldSchema.required}
                  />
                  <span className="text-sm text-gray-900">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </span>
                </label>
              ))}
            </div>
            {fieldSchema.helpText && (
              <p className="text-xs text-gray-500 mt-1">{fieldSchema.helpText}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div>
            <input
              id={fieldId}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // In a real app, you'd upload this file and get a URL back
                  // For now, we'll just store the file name
                  handleFieldChange(fieldName, file.name);
                }
              }}
              accept={fieldSchema.validation?.accept}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required={fieldSchema.required}
            />
            {value && typeof value === "string" ? (
              <p className="text-sm text-gray-600 mt-1">Selected: {value}</p>
            ) : null}
            {fieldSchema.helpText && (
              <p className="text-xs text-gray-500 mt-1">{fieldSchema.helpText}</p>
            )}
          </div>
        );

      case "select":
        return (
          <select
            id={fieldId}
            value={(value as string) || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required={fieldSchema.required}
          >
            <option value="">Select {fieldSchema.label}</option>
            {fieldSchema.options?.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );

      case "array":
        return renderArrayField(fieldName, fieldSchema, (value as unknown[]) || []);

      case "object":
        return renderObjectField(fieldName, fieldSchema, value as Record<string, unknown>);

      default:
        return (
          <div className="text-red-500 text-sm">Unsupported field type: {fieldSchema.type}</div>
        );
    }
  };

  const renderArrayField = (fieldName: string, fieldSchema: FieldSchema, items: unknown[]) => {
    const addItem = () => {
      const newItem = fieldSchema.itemSchema?.type === "object" ? {} : "";
      const newItems = [...items, newItem];
      handleFieldChange(fieldName, newItems);
    };

    const removeItem = (index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      handleFieldChange(fieldName, newItems);
    };

    return (
      <div className="space-y-3">
        <div className="flex justify-end items-center">
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
          >
            + Add {fieldSchema.itemSchema?.label || "Item"}
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                {fieldSchema.itemSchema?.type === "object" ? (
                  <div className="p-3 border border-gray-200 rounded bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {fieldSchema.itemSchema.label} {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    {fieldSchema.itemSchema.fields && (
                      <div className="space-y-2">
                        {Object.entries(fieldSchema.itemSchema.fields).map(
                          ([subFieldName, subFieldSchema]) => (
                            <div key={subFieldName}>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {subFieldSchema.label}
                                {subFieldSchema.required && <span className="text-red-500">*</span>}
                              </label>
                              {renderField(
                                `${fieldName}[${index}].${subFieldName}`,
                                subFieldSchema,
                                (item as Record<string, unknown>)[subFieldName]
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  renderField(`${fieldName}[${index}]`, fieldSchema.itemSchema!, item)
                )}
              </div>
              {fieldSchema.itemSchema?.type !== "object" && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-3 text-red-600 hover:text-red-800 text-xs"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">
              No {fieldSchema.label.toLowerCase()} yet. Click &quot;Add&quot; to get started.
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderObjectField = (
    fieldName: string,
    fieldSchema: FieldSchema,
    obj: Record<string, unknown>
  ) => {
    return (
      <div className="p-4 border border-gray-200 rounded bg-gray-50 space-y-3">
        {fieldSchema.fields &&
          Object.entries(fieldSchema.fields).map(([subFieldName, subFieldSchema]) => (
            <div key={subFieldName}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {subFieldSchema.label}
                {subFieldSchema.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(`${fieldName}.${subFieldName}`, subFieldSchema, obj[subFieldName])}
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-2">
        <h3 className="text-lg font-medium text-gray-900">{schema.name}</h3>
        <p className="text-sm text-gray-600">{schema.description}</p>
      </div>

      {Object.entries(schema.fields).map(([fieldName, fieldSchema]) => (
        <div key={fieldName}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {fieldSchema.label}
            {fieldSchema.required && <span className="text-red-500">*</span>}
          </label>
          {renderField(fieldName, fieldSchema, data[fieldName])}
        </div>
      ))}
    </div>
  );
}

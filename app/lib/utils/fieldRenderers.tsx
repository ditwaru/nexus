import React from "react";
import { FieldSchema } from "@/lib/cms/schemas";

// Utility function to safely get object values
export const getObjectValue = (value: unknown): Record<string, unknown> => {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
};

// Utility function to safely get array values
export const getArrayValue = (value: unknown): unknown[] => {
  return Array.isArray(value) ? value : [];
};

// Helper function to get nested field values
export const getNestedValue = (data: Record<string, unknown>, path: string): unknown => {
  if (path.includes("[") && path.includes("]")) {
    const match = path.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
    if (match) {
      const [, arrayField, indexStr, subField] = match;
      const index = parseInt(indexStr);
      const array = data[arrayField];
      if (Array.isArray(array) && array[index] && typeof array[index] === "object") {
        return (array[index] as Record<string, unknown>)[subField];
      }
      return "";
    }
  }
  return data[path];
};

// Helper function to update nested field values
export const updateNestedValue = (
  data: Record<string, unknown>,
  fieldName: string,
  value: unknown
): Record<string, unknown> => {
  if (fieldName.includes("[") && fieldName.includes("]")) {
    const match = fieldName.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
    if (match) {
      const [, arrayField, indexStr, subField] = match;
      const index = parseInt(indexStr);

      const newData = { ...data };
      if (Array.isArray(newData[arrayField])) {
        const newArray = [...newData[arrayField]];
        if (newArray[index] && typeof newArray[index] === "object") {
          newArray[index] = {
            ...(newArray[index] as Record<string, unknown>),
            [subField]: value,
          };
          newData[arrayField] = newArray;
          return newData;
        }
      }
    }
  }

  return { ...data, [fieldName]: value };
};

// Render individual form fields
export const renderField = (
  fieldName: string,
  fieldSchema: FieldSchema,
  value: unknown,
  onChange: (fieldName: string, value: unknown) => void
): React.ReactElement => {
  const fieldId = `field-${fieldName}`;

  switch (fieldSchema.type) {
    case "text":
      return (
        <input
          id={fieldId}
          type="text"
          value={String(value || "")}
          onChange={(e) => onChange(fieldName, e.target.value)}
          placeholder={fieldSchema.placeholder}
          className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required={fieldSchema.required}
        />
      );

    case "textarea":
      return (
        <textarea
          id={fieldId}
          value={String(value || "")}
          onChange={(e) => onChange(fieldName, e.target.value)}
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
          value={Number(value) || ""}
          onChange={(e) => onChange(fieldName, parseInt(e.target.value) || 0)}
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
            value={String(value || "")}
            onChange={(e) => onChange(fieldName, e.target.value)}
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
              value={Number(value) || fieldSchema.validation?.min || 0}
              onChange={(e) => onChange(fieldName, parseInt(e.target.value))}
              min={fieldSchema.validation?.min || 0}
              max={fieldSchema.validation?.max || 100}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              required={fieldSchema.required}
            />
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Number(value) || fieldSchema.validation?.min || 0}
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
              checked={Boolean(value)}
              onChange={(e) => onChange(fieldName, e.target.checked)}
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
                  checked={String(value) === option}
                  onChange={(e) => onChange(fieldName, e.target.value)}
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
                onChange(fieldName, file.name);
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
          value={String(value || "")}
          onChange={(e) => onChange(fieldName, e.target.value)}
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

    default:
      return <div className="text-red-500 text-sm">Unsupported field type: {fieldSchema.type}</div>;
  }
};

// Create new array item with default values
export const createNewArrayItem = (fieldSchema: FieldSchema): unknown => {
  if (fieldSchema.itemSchema?.type === "object") {
    const newItem: Record<string, unknown> = {};
    if (fieldSchema.itemSchema.fields) {
      Object.entries(fieldSchema.itemSchema.fields).forEach(([subFieldName, subFieldSchema]) => {
        if (subFieldSchema.defaultValue !== undefined) {
          newItem[subFieldName] = subFieldSchema.defaultValue;
        } else if (subFieldSchema.type === "array") {
          newItem[subFieldName] = [];
        } else if (subFieldSchema.type === "object") {
          newItem[subFieldName] = {};
        } else {
          newItem[subFieldName] = "";
        }
      });
    }
    return newItem;
  }

  return fieldSchema.itemSchema?.defaultValue !== undefined
    ? fieldSchema.itemSchema.defaultValue
    : "";
};

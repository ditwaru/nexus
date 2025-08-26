"use client";

import { FieldSchema, SectionSchema } from "@/lib/cms/schemas";
import { getNestedValue, renderField, updateNestedValue } from "@/lib/utils/fieldRenderers";
import ArrayFieldRenderer from "./ArrayFieldRenderer";
import ObjectFieldRenderer from "./ObjectFieldRenderer";

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
    const newData = updateNestedValue(data, fieldName, value);
    onChange(newData);
  };

  const renderFieldByType = (
    fieldName: string,
    fieldSchema: FieldSchema,
    value: unknown
  ): React.ReactElement | null => {
    switch (fieldSchema.type) {
      case "array":
        return (
          <ArrayFieldRenderer
            fieldName={fieldName}
            fieldSchema={fieldSchema}
            items={(value as unknown[]) || []}
            onChange={handleFieldChange}
          />
        );

      case "object":
        return (
          <ObjectFieldRenderer
            fieldName={fieldName}
            fieldSchema={fieldSchema}
            obj={(value as Record<string, unknown>) || {}}
            onChange={handleFieldChange}
          />
        );

      default:
        return renderField(fieldName, fieldSchema, value, handleFieldChange) as React.ReactElement;
    }
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
          {
            renderFieldByType(
              fieldName,
              fieldSchema,
              getNestedValue(data, fieldName)
            ) as React.ReactElement
          }
        </div>
      ))}
    </div>
  );
}

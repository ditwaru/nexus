import { FieldSchema } from "@/lib/cms/schemas";
import { renderField } from "@/lib/utils/fieldRenderers";

interface ObjectFieldRendererProps {
  fieldName: string;
  fieldSchema: FieldSchema;
  obj: Record<string, unknown>;
  onChange: (fieldName: string, value: unknown) => void;
}

export default function ObjectFieldRenderer({
  fieldName,
  fieldSchema,
  obj,
  onChange,
}: ObjectFieldRendererProps) {
  return (
    <div className="p-4 border border-gray-200 rounded bg-gray-50 space-y-3">
      {fieldSchema.fields &&
        Object.entries(fieldSchema.fields).map(([subFieldName, subFieldSchema]) => (
          <div key={subFieldName}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {subFieldSchema.label}
              {subFieldSchema.required && <span className="text-red-500">*</span>}
            </label>
            {renderField(
              `${fieldName}.${subFieldName}`,
              subFieldSchema,
              obj[subFieldName],
              onChange
            )}
          </div>
        ))}
    </div>
  );
}

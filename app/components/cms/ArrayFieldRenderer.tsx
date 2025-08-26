import { FieldSchema } from "@/lib/cms/schemas";
import { renderField, getNestedValue } from "@/lib/utils/fieldRenderers";

interface ArrayFieldRendererProps {
  fieldName: string;
  fieldSchema: FieldSchema;
  items: unknown[];
  onChange: (fieldName: string, value: unknown) => void;
}

export default function ArrayFieldRenderer({
  fieldName,
  fieldSchema,
  items,
  onChange,
}: ArrayFieldRendererProps) {
  const createNewArrayItem = (schema: FieldSchema): unknown => {
    if (schema.itemSchema?.type === "object") {
      const newItem: Record<string, unknown> = {};
      if (schema.itemSchema.fields) {
        Object.entries(schema.itemSchema.fields).forEach(([subFieldName, subFieldSchema]) => {
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

    return schema.itemSchema?.defaultValue !== undefined ? schema.itemSchema.defaultValue : "";
  };

  const addItem = () => {
    const newItem = createNewArrayItem(fieldSchema);
    const newItems = [...items, newItem];
    onChange(fieldName, newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(fieldName, newItems);
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
                              getNestedValue(
                                { [fieldName]: items },
                                `${fieldName}[${index}].${subFieldName}`
                              ),
                              onChange
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                renderField(`${fieldName}[${index}]`, fieldSchema.itemSchema!, item, onChange)
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
}

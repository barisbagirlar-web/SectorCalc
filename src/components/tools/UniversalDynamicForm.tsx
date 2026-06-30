"use client";
import { useState } from "react";

export default function UniversalDynamicForm({ schema }: { schema: any }) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    if (schema?.inputs && Array.isArray(schema.inputs)) {
      schema.inputs.forEach((input: any) => {
        initial[input.id] = input.default ?? "";
      });
    }
    return initial;
  });

  if (!schema || !schema.inputs) {
    return <div className="p-4 text-red-500 border border-red-200 bg-red-50 rounded">Invalid schema format.</div>;
  }

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form submitted! See console for data.");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-technical-gray">
      <h2 className="text-xl font-semibold mb-6 text-premium-velvet">
        {schema.tool_name || "Universal Tool Form"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {schema.inputs.map((input: any) => (
            <div key={input.id} className="flex flex-col">
              <label htmlFor={input.id} className="mb-2 text-sm font-medium text-body-charcoal">
                {input.label || input.id}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {input.type === "select" ? (
                <select
                  id={input.id}
                  value={formData[input.id] ?? ""}
                  onChange={(e) => handleChange(input.id, e.target.value)}
                  className="px-3 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-premium-copper/50"
                  required={input.required}
                >
                  <option value="">Select an option...</option>
                  {input.options?.map((opt: any) => (
                    <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
                      {opt.label ?? opt.name ?? opt.value ?? opt.id}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={input.id}
                  type={input.type === "number" ? "number" : "text"}
                  value={formData[input.id] ?? ""}
                  onChange={(e) => handleChange(input.id, input.type === "number" ? Number(e.target.value) : e.target.value)}
                  placeholder={input.placeholder || ""}
                  className="px-3 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-premium-copper/50"
                  required={input.required}
                />
              )}
              {input.helperText && (
                <p className="mt-1 text-xs text-text-secondary">{input.helperText}</p>
              )}
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-border-subtle">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-premium-copper text-white font-medium rounded-md hover:bg-opacity-90 transition-opacity"
          >
            Calculate
          </button>
        </div>
      </form>
    </div>
  );
}

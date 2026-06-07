"use client";

import { ToolInputField } from "@/components/tools/ToolInputField";
import type { ToolInput } from "@/data/tool-schema";

interface ToolFormProps {
 inputs: ToolInput[];
 values: Record<string, number | string>;
 errors: Record<string, string>;
 onChange: (id: string, value: number | string) => void;
 onBlur: (id: string) => void;
}

export function ToolForm({
 inputs,
 values,
 errors,
 onChange,
 onBlur,
}: ToolFormProps) {
 return (
 <form
 className="space-y-5"
 onSubmit={(e) => e.preventDefault()}
 noValidate
 >
 {inputs.map((input) => (
 <ToolInputField
 key={input.id}
 input={input}
 value={values[input.id] ?? input.defaultValue}
 error={errors[input.id]}
 onChange={onChange}
 onBlur={onBlur}
 />
 ))}
 </form>
 );
}

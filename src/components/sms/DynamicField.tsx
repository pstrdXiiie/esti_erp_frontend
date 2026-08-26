"use client"

import type { Control, FieldValues, Path } from "react-hook-form"
import type { FieldSpec } from "@/lib/forms/types"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

/**
 * Renders one form field from a FieldSpec (blueprint §5.1's data-driven
 * screen model: changing a field's type/label is a spec edit, not a
 * template-code change).
 */
export function DynamicField<T extends FieldValues>({
  control,
  spec,
}: {
  control: Control<T>
  spec: FieldSpec
}) {
  if (spec.fieldtype === "Check") {
    return (
      <FormField
        control={control}
        name={spec.fieldname as Path<T>}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-2 space-y-0">
            <FormControl>
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={spec.readOnly}
                className="h-4 w-4 rounded border-gray-300"
              />
            </FormControl>
            <FormLabel className="font-normal text-sm text-slate-700">
              {spec.label}
              {spec.required && <span className="text-red-500 ml-0.5">*</span>}
            </FormLabel>
          </FormItem>
        )}
      />
    )
  }
  return (
    <FormField
      control={control}
      name={spec.fieldname as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {spec.label}
            {spec.required ? " *" : ""}
          </FormLabel>
          <FormControl>
          
            {spec.fieldtype === "Select" ? (
              <Select
                onValueChange={field.onChange}
                value={(field.value as string | undefined) ?? ""}
                disabled={spec.readOnly}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(spec.options ?? "")
                    .split("\n")
                    .filter(Boolean)
                    .map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : spec.fieldtype === "Check" ? (
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={spec.readOnly}
                className="h-4 w-4"
              />
            ) : (
              <Input
                type={
                  spec.fieldtype === "Date"
                    ? "date"
                    : spec.fieldtype === "Datetime"
                      ? "datetime-local"
                      : spec.fieldtype === "Int" || spec.fieldtype === "Float" || spec.fieldtype === "Currency"
                        ? "number"
                        : "text"
                }
                readOnly={spec.readOnly}
                {...field}
                value={(field.value as string | number | undefined) ?? ""}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

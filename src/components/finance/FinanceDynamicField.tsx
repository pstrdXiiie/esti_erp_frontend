"use client"

import type { Control, FieldValues, Path } from "react-hook-form"
import { Controller } from "react-hook-form"
import type { FieldSpec } from "@/lib/forms/types"
import { financeRowInput, financeRowSelect } from "@/lib/finance-ui"
import { FinancePropertyRow } from "@/components/finance/FinancePropertyPanel"

/** Row-styled field renderer for finance screens, mirroring DynamicField
 * but using the finance-ui design tokens instead of shadcn Form/Input. */
export function FinanceDynamicField<T extends FieldValues>({
  control,
  spec,
}: {
  control: Control<T>
  spec: FieldSpec
}) {
  return (
    <Controller
      control={control}
      name={spec.fieldname as Path<T>}
      render={({ field }) => (
        <FinancePropertyRow label={`${spec.label}${spec.required ? " *" : ""}`}>
          {spec.fieldtype === "Check" ? (
            <input
              type="checkbox"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={spec.readOnly}
              className="h-4 w-4 rounded border-zinc-300"
            />
          ) : spec.fieldtype === "Select" ? (
            <select
              className={`rounded border border-zinc-200 ${financeRowSelect}`}
              value={(field.value as string | undefined) ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={spec.readOnly}
            >
              <option value="" />
              {(spec.options ?? "")
                .split("\n")
                .filter(Boolean)
                .map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
            </select>
          ) : (
            <input
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
              className={`rounded border border-zinc-200 ${spec.readOnly ? "bg-zinc-50 text-zinc-500" : ""} ${financeRowInput}`}
              value={(field.value as string | number | undefined) ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        </FinancePropertyRow>
      )}
    />
  )
}

"use client"

import { useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { frappe, getErrorMessage } from "@/lib/frappe"
import type { EntrySpec } from "@/lib/forms/types"
import { FinancePropertyPanel, FinancePropertySection } from "@/components/finance/FinancePropertyPanel"
import { FinanceDynamicField } from "@/components/finance/FinanceDynamicField"
import { ChildTableGrid } from "@/components/sms/ChildTableGrid"
import { GLEntryGrid } from "@/components/sms/GLEntryGrid"

/**
 * Finance-styled counterpart to EntryScreen (which stays generic for
 * registrar's curriculum/permits). Same spec-driven behavior, but uses the
 * FinancePropertyPanel/finance-ui look shared with VoucherEntryForm and
 * ChequeVoucherForm, so all finance transaction screens read consistently
 * without hand-building a bespoke component per doctype.
 */
export function FinanceEntryScreen({
  spec,
  name,
  basePath,
  extraActions,
  onSaved,
}: {
  spec: EntrySpec
  name?: string
  basePath?: string
  extraActions?: ReactNode
  /** Called after a successful save, in addition to any basePath navigation. */
  onSaved?: (name: string) => void
}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([])
  const [syncedDoc, setSyncedDoc] = useState<Record<string, unknown> | undefined>(undefined)

  const { data: doc, isLoading } = useQuery({
    queryKey: [spec.doctype, name],
    queryFn: () => frappe.getDoc<Record<string, unknown>>(spec.doctype, name!),
    enabled: !!name,
  })

  const form = useForm<Record<string, unknown>>({
    defaultValues: doc ?? {},
    values: doc,
  })

  if (spec.childTable && doc && doc !== syncedDoc) {
    setSyncedDoc(doc)
    const existing = doc[spec.childTable.fieldname]
    setRows(Array.isArray(existing) ? (existing as Array<Record<string, unknown>>) : [])
  }

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const payload = spec.childTable ? { ...values, [spec.childTable.fieldname]: rows } : values
      return name
        ? frappe.updateDoc(spec.doctype, name, payload)
        : spec.primaryApi
          ? frappe.call(spec.primaryApi, payload)
          : frappe.createDoc(spec.doctype, payload)
    },
    onSuccess: (saved) => {
      toast.success(`${spec.title} saved`)
      queryClient.invalidateQueries({ queryKey: [spec.doctype] })
      const savedName = name ?? (saved as { name?: string })?.name
      if (!name && basePath && savedName) {
        router.push(`${basePath}/${encodeURIComponent(savedName)}`)
      }
      if (savedName) onSaved?.(savedName)
    },
    onError: (error) => toast.error(`Could not save ${spec.title}: ${getErrorMessage(error)}`),
  })

  if (name && isLoading) {
    return <div className="h-96 w-full animate-pulse rounded-md bg-zinc-100" />
  }

  const sectionOrder: string[] = []
  const sectionMap = new Map<string, typeof spec.fields>()
  for (const f of spec.fields) {
    const key = f.section ?? ""
    if (!sectionMap.has(key)) {
      sectionOrder.push(key)
      sectionMap.set(key, [])
    }
    sectionMap.get(key)!.push(f)
  }

  return (
    <form onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
      <FinancePropertyPanel
        title={name ? `${spec.title} — ${name}` : `New ${spec.title}`}
        onCancel={basePath ? () => router.push(basePath) : undefined}
        onSave={form.handleSubmit((values) => saveMutation.mutate(values))}
        saveLabel="Save"
        isSaving={saveMutation.isPending}
      >
        {sectionOrder.map((sectionKey) => (
          <FinancePropertySection key={sectionKey || "default"} title={sectionKey || "Details"}>
            <div className="grid divide-y divide-zinc-100">
              {sectionMap.get(sectionKey)!.map((f) => {
                if (f.dependsOn) {
                  const trigger = form.watch(f.dependsOn)
                  if (!trigger) return null
                }
                return <FinanceDynamicField key={f.fieldname} control={form.control} spec={f} />
              })}
            </div>
          </FinancePropertySection>
        ))}

        {spec.childTable &&
          (spec.childTable.variant === "gl-entries" ? (
            <GLEntryGrid spec={spec.childTable} rows={rows} onChange={setRows} />
          ) : (
            <FinancePropertySection title="Line Items">
              <ChildTableGrid spec={spec.childTable} rows={rows} onChange={setRows} />
            </FinancePropertySection>
          ))}

        {extraActions && <FinancePropertySection title="Actions">{extraActions}</FinancePropertySection>}
      </FinancePropertyPanel>
    </form>
  )
}

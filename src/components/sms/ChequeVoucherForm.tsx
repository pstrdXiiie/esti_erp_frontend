"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { frappe, getErrorMessage } from "@/lib/frappe"
import { GLEntryGrid } from "@/components/sms/GLEntryGrid"
import { Button } from "@/components/ui/button"

interface ChequeVoucherValues {
  payee?: string
  date?: string
  check_number?: string
  check_date?: string
  amount?: string
  notes?: string
}

const GL_ENTRIES_SPEC = {
  fieldname: "gl_entries",
  doctype: "Cheque Voucher GL Entry",
  variant: "gl-entries" as const,
  columns: [],
}

export function ChequeVoucherForm({ name, basePath }: { name?: string; basePath?: string }) {
  const doctype = "Cheque Voucher Transaction"
  const router = useRouter()
  const queryClient = useQueryClient()
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([])

  const { data: doc, isLoading } = useQuery({
    queryKey: [doctype, name],
    queryFn: () => frappe.getDoc<Record<string, unknown>>(doctype, name!),
    enabled: !!name,
  })

  const { register, handleSubmit, reset } = useForm<ChequeVoucherValues>()

  useEffect(() => {
    if (doc) {
      reset({
        payee: String(doc.payee ?? ""),
        date: String(doc.date ?? ""),
        check_number: String(doc.check_number ?? ""),
        check_date: String(doc.check_date ?? ""),
        amount: String(doc.amount ?? ""),
        notes: String(doc.notes ?? ""),
      })
      const existing = doc.gl_entries
      setRows(Array.isArray(existing) ? (existing as Array<Record<string, unknown>>) : [])
    }
  }, [doc, reset])

  const saveMutation = useMutation({
    mutationFn: async (values: ChequeVoucherValues) => {
      const payload = { ...values, gl_entries: rows }
      return name
        ? frappe.updateDoc(doctype, name, payload)
        : frappe.createDoc<Record<string, unknown>>(doctype, payload)
    },
    onSuccess: (saved) => {
      toast.success("Cheque voucher saved")
      queryClient.invalidateQueries({ queryKey: [doctype] })
      if (!name && basePath) {
        const newName = (saved as { name?: string })?.name
        if (newName) router.push(`${basePath}/${encodeURIComponent(newName)}`)
      }
    },
    onError: (error) => toast.error(`Could not save voucher: ${getErrorMessage(error)}`),
  })

  if (name && isLoading) {
    return <div className="h-96 w-full animate-pulse rounded-md bg-muted" />
  }

  return (
    <form onSubmit={handleSubmit((values) => saveMutation.mutate(values))} className="max-w-[700px]">
      <div className="rounded-md border border-[#D9DCE3] bg-[#F7F5F0] text-[#1B2A4A]">
        <div className="flex items-start justify-between px-7 pb-4 pt-6">
          <div>
            <p className="font-serif text-[15px] font-semibold tracking-wide">Esti School Finance Office</p>
            <p className="mt-0.5 text-[10px] tracking-wider text-[#5B6B85]">CHECK VOUCHER TRANSACTION</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs">CV# {name ?? "New"}</p>
            <div className="mt-1 flex items-center justify-end gap-1.5">
              <span className="text-[10px] text-[#5B6B85]">Date</span>
              <input
                type="date"
                {...register("date")}
                className="border-b border-[#D9DCE3] bg-transparent px-0 py-0.5 text-right font-mono text-xs text-[#1B2A4A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2.5 px-7 pb-1 pt-1.5">
          <span className="whitespace-nowrap text-xs text-[#5B6B85]">Payee</span>
          <input
            {...register("payee")}
            placeholder="Payee name"
            className="flex-1 border-b border-[#1B2A4A] bg-transparent px-0.5 py-1 font-serif text-[15px] italic text-[#1B2A4A] focus:outline-none"
          />
          <span className="text-xs text-[#5B6B85]">Amount ₱</span>
          <input
            {...register("amount")}
            placeholder="0.00"
            className="w-28 border-b border-[#1B2A4A] bg-transparent px-0.5 py-1 text-right font-mono text-[15px] text-[#1B2A4A] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-5 px-7 pb-5 pt-3">
          <div>
            <p className="mb-1 text-[10px] tracking-wide text-[#5B6B85]">CHECK NUMBER</p>
            <input
              {...register("check_number")}
              placeholder="Check number"
              className="w-full border-b border-[#D9DCE3] bg-transparent px-0.5 py-1 font-mono text-sm text-[#1B2A4A] focus:outline-none"
            />
          </div>
          <div>
            <p className="mb-1 text-[10px] tracking-wide text-[#5B6B85]">CHECK DATE</p>
            <input
              type="date"
              {...register("check_date")}
              className="w-full border-b border-[#D9DCE3] bg-transparent px-0.5 py-1 font-mono text-sm text-[#1B2A4A] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-5 px-7 pb-4.5">
          <div className="w-52 text-center">
            <div className="h-5.5 border-b border-[#1B2A4A]" />
            <p className="mt-0.5 text-[9px] tracking-wide text-[#5B6B85]">AUTHORIZED SIGNATURE</p>
          </div>
        </div>

        <div className="flex justify-between rounded-b-md bg-[#1B2A4A] px-7 py-2">
          <span className="font-mono text-xs tracking-[0.18em] text-[#E7EAF2]">⑈{name ?? "NEW"}⑈</span>
          <span className="font-mono text-xs tracking-[0.18em] text-[#E7EAF2]">₱ auto</span>
        </div>
      </div>

      <div className="my-4 border-t-2 border-dashed border-[#D9DCE3]" />

      <div className="rounded-md border border-[#D9DCE3] bg-white p-5">
        <GLEntryGrid spec={GL_ENTRIES_SPEC} rows={rows} onChange={setRows} />
      </div>

      <div className="mt-4">
        <p className="mb-1 text-[10px] tracking-wide text-[#5B6B85]">NOTES</p>
        <textarea
          {...register("notes")}
          placeholder="Notes"
          rows={2}
          className="w-full rounded-md border border-[#D9DCE3] bg-white px-3 py-2 text-sm text-[#1B2A4A] focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-2.5 pt-4">
        {basePath && (
          <Button type="button" variant="outline" onClick={() => router.push(basePath)}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={saveMutation.isPending} className="bg-[#1B2A4A] text-white hover:bg-[#243863]">
          {saveMutation.isPending ? "Saving…" : "Post Voucher"}
        </Button>
      </div>
    </form>
  )
}

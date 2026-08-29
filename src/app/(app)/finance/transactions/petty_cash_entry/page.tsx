"use client"

import { useMemo, useState } from "react"

import { GLEntryGrid } from "@/components/sms/GLEntryGrid"
import { financeRowInput, financeRowSelect, financePrimaryButton } from "@/lib/finance-ui"
import { FinancePropertySection } from "@/components/finance/FinancePropertyPanel"
import type { ChildTableSpec } from "@/lib/forms/types"

const accountsChildSpec: ChildTableSpec = {
  doctype: "SMS Petty Cash Account Entry",
  fields: [
    { fieldname: "account", label: "Account", fieldtype: "Link", options: "Account", required: true },
    { fieldname: "account_name", label: "Account Name", fieldtype: "Data", readOnly: true },
    { fieldname: "debit", label: "Debit", fieldtype: "Currency" },
    { fieldname: "credit", label: "Credit", fieldtype: "Currency" },
  ],
}

const NAMING_SERIES_OPTIONS = ["PCV-.YYYY.-", "PCV-MANUAL-"]

export default function PettyCashEntryPage() {
  const [namingSeries, setNamingSeries] = useState(NAMING_SERIES_OPTIONS[0])
  const [postingDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [remark, setRemark] = useState("")
  const [accounts, setAccounts] = useState<Array<Record<string, unknown>>>([])

  const totals = useMemo(() => {
    return accounts.reduce(
      (acc, r) => {
        acc.debit += Number(r.debit ?? 0)
        acc.credit += Number(r.credit ?? 0)
        return acc
      },
      { debit: 0, credit: 0 }
    )
  }, [accounts])

  const isBalanced = accounts.length > 0 && totals.debit === totals.credit

  function handleSave() {
    // TODO: wire up to frappe.insert / frappe.save
    console.log({
      naming_series: namingSeries,
      posting_date: postingDate,
      user_remark: remark,
      accounts,
      total_debit: totals.debit,
      total_credit: totals.credit,
    })
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Petty Cash Account Entry</h1>
        <p className="mt-1 text-sm text-zinc-500">Record petty cash account movements.</p>
      </div>

      <FinancePropertySection title="Details">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs font-medium text-zinc-500">
            PCV#
            <select
              className={`rounded border border-zinc-200 ${financeRowSelect}`}
              value={namingSeries}
              onChange={(e) => setNamingSeries(e.target.value)}
            >
              {NAMING_SERIES_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-xs font-medium text-zinc-500">
            Date
            <input
              className={`rounded border border-zinc-200 bg-zinc-50 text-zinc-500 ${financeRowInput}`}
              type="text"
              value={postingDate}
              readOnly
            />
          </label>

          <label className="grid gap-1 text-xs font-medium text-zinc-500 sm:col-span-2">
            Notes
            <textarea
              className={`min-h-[72px] rounded border border-zinc-200 ${financeRowInput}`}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Reason for this entry…"
            />
          </label>
        </div>
      </FinancePropertySection>

      <GLEntryGrid spec={accountsChildSpec} rows={accounts} onChange={setAccounts} />

      <FinancePropertySection title="Totals">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total Debit</p>
            <p className="mt-1 font-mono text-base text-zinc-900">₱{totals.debit.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total Credit</p>
            <p className="mt-1 font-mono text-base text-zinc-900">₱{totals.credit.toFixed(2)}</p>
          </div>
        </div>
      </FinancePropertySection>

      <div className="flex items-center justify-end gap-3">
        {accounts.length > 0 && !isBalanced && (
          <span className="text-xs text-amber-700">Debits and credits must match before saving.</span>
        )}
        <button
          type="button"
          className={financePrimaryButton}
          onClick={handleSave}
          disabled={!isBalanced}
        >
          Save Petty Cash Entry
        </button>
      </div>
    </div>
  )
}

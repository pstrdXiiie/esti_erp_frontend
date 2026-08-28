"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { frappe } from "@/lib/frappe"
import type { ChildTableSpec } from "@/lib/forms/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ChartOfAccountRow {
  name: string
  account_number: string
  account_name: string
}

export function GLEntryGrid({
  spec,
  rows,
  onChange,
}: {
  spec: ChildTableSpec
  rows: Array<Record<string, unknown>>
  onChange: (rows: Array<Record<string, unknown>>) => void
}) {
  const [account, setAccount] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [drCr, setDrCr] = useState<"DR" | "CR">("DR")

  const { data: accounts = [] } = useQuery({
    queryKey: ["Chart of Account", "list"],
    queryFn: () =>
      frappe.list<ChartOfAccountRow>("Chart of Account", {
        fields: ["name", "account_number", "account_name"],
        limit_page_length: 200,
      }),
  })

  const selectedAccount = accounts.find((a) => a.name === account)

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.debit += Number(r.debit ?? 0)
        acc.credit += Number(r.credit ?? 0)
        return acc
      },
      { debit: 0, credit: 0 }
    )
  }, [rows])

  function addRow() {
    if (!account || !amount) return
    const numAmount = Number(amount)
    const next = [
      ...rows,
      {
        account,
        account_name: selectedAccount?.account_name ?? "",
        debit: drCr === "DR" ? numAmount : 0,
        credit: drCr === "CR" ? numAmount : 0,
      },
    ]
    onChange(next)
    setAccount("")
    setAmount("")
    setDrCr("DR")
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index))
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        General Ledger Entries
      </p>

      <div className="flex flex-wrap items-end gap-2 rounded-md border p-3">
        <div className="min-w-[220px] flex-1">
          <p className="mb-1 text-xs text-muted-foreground">Chart of Account</p>
          <Select value={account} onValueChange={setAccount}>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((a) => (
                <SelectItem key={a.name} value={a.name}>
                  {a.account_number} - {a.account_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <p className="mb-1 text-xs text-muted-foreground">Amount</p>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={drCr === "DR" ? "default" : "outline"}
            className={drCr === "DR" ? "bg-slate-800" : ""}
            onClick={() => setDrCr("DR")}
          >
            DR
          </Button>
          <Button
            type="button"
            size="sm"
            variant={drCr === "CR" ? "default" : "outline"}
            className={drCr === "CR" ? "bg-slate-800" : ""}
            onClick={() => setDrCr("CR")}
          >
            CR
          </Button>
        </div>

        <Button type="button" className="bg-slate-800" onClick={addRow}>
          Add
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Acct #</TableHead>
              <TableHead>Acct Name</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{String(row.account ?? "")}</TableCell>
                <TableCell>{String(row.account_name ?? "")}</TableCell>
                <TableCell>{Number(row.debit ?? 0).toFixed(2)}</TableCell>
                <TableCell>{Number(row.credit ?? 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(i)}>
                    ✕
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-6 text-sm font-medium">
        <span>Totals</span>
        <span>DR {totals.debit.toFixed(2)}</span>
        <span>CR {totals.credit.toFixed(2)}</span>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { frappe } from "@/lib/frappe"
import { studentEnrollmentSpec } from "@/lib/forms/registrar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function FindEnrollmentDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (name: string) => void
}) {
  const [studentId, setStudentId] = useState("")
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const query = useQuery({
    queryKey: ["enrollment-find", studentId, name],
    queryFn: () =>
      frappe.list<{ name: string; student_id: string; first_name: string; last_name: string }>(
        studentEnrollmentSpec.doctype,
        {
          fields: ["name", "student_id", "first_name", "last_name"],
          filters: [
            ...(studentId ? [["student_id", "like", `%${studentId}%`] as [string, string, unknown]] : []),
            ...(name ? [["last_name", "like", `%${name}%`] as [string, string, unknown]] : []),
          ],
          limit_page_length: 20,
        }
      ),
    enabled: submitted,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Find student</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <Input
            placeholder="Last name, first name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setStudentId("")
              setName("")
              setSubmitted(false)
            }}
          >
            Clear
          </Button>
          <Button onClick={() => setSubmitted(true)} disabled={query.isFetching}>
            {query.isFetching ? "Searching…" : "Search"}
          </Button>
        </div>

        <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
          {submitted && !query.isFetching && (query.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No matches.</p>
          )}
          {(query.data ?? []).map((row) => (
            <button
              key={row.name}
              onClick={() => onSelect(row.name)}
              className="rounded-md border p-2 text-left text-sm hover:bg-slate-50"
            >
              <div className="font-medium">
                {row.last_name}, {row.first_name}
              </div>
              <div className="text-xs text-muted-foreground">{row.student_id ?? row.name}</div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
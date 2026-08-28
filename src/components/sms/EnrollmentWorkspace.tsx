"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { frappe, getErrorMessage } from "@/lib/frappe"
import type { EntrySpec, FieldSpec } from "@/lib/forms/types"
import { studentEnrollmentSpec } from "@/lib/forms/registrar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form } from "@/components/ui/form"
import { DynamicField } from "@/components/sms/DynamicField"
import { FindEnrollmentDialog } from "@/components/sms/FindEnrollmentDialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

type EnrollmentRow = Record<string, unknown> & { name: string }

const TABS: Array<{ key: string; label: string }> = [
  { key: "personal", label: "Personal information" },
  { key: "credentials", label: "Credentials" },
  { key: "scholastic", label: "Scholastic record" },
]

const spec: EntrySpec = studentEnrollmentSpec
const childFields = spec.childTable?.columns ?? []

function fieldsForTab(tab: string): FieldSpec[] {
  return childFields.filter((f) => (f.section ?? "personal") === tab)
}

/**
 * Non-modal, three-panel enrollment workspace (directory / tabbed detail /
 * photo+signature+actions), replacing the dialog-based Master/Detail pattern
 * for this one screen per the new mock.
 */
export function EnrollmentWorkspace() {
  const queryClient = useQueryClient()
  const [selectedName, setSelectedName] = useState<string | undefined>(undefined)
  const [mode, setMode] = useState<"view" | "edit" | "new">("view")
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("personal")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [findOpen, setFindOpen] = useState(false)

  const listQuery = useQuery({
    queryKey: [spec.doctype, "list", search],
    queryFn: () =>
      frappe.list<EnrollmentRow>(spec.doctype, {
        fields: ["name", "student_id", "first_name", "last_name"],
        filters: search
          ? [["last_name", "like", `%${search}%`]]
          : undefined,
        order_by: "modified desc",
        limit_page_length: 50,
      }),
  })

  const activeName = selectedName ?? listQuery.data?.[0]?.name

  const docQuery = useQuery({
    queryKey: [spec.doctype, activeName],
    queryFn: () => frappe.getDoc<Record<string, unknown>>(spec.doctype, activeName!),
    enabled: !!activeName && mode !== "new",
  })

  const rows = useMemo<Array<Record<string, unknown>>>(() => {
    if (mode === "new") return [{}]
    const existing = docQuery.data?.[spec.childTable?.fieldname ?? ""]
    return Array.isArray(existing) && existing.length ? existing : [{}]
  }, [docQuery.data, mode])

  const form = useForm<Record<string, unknown>>({
    defaultValues: {},
    values: mode === "new" ? {} : docQuery.data,
  })

  const readOnly = mode === "view"

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const childRow = { ...rows[0], ...values }
      const payload = {
        student_id: values.student_id,
        last_name: values.last_name,
        first_name: values.first_name,
        middle_name: values.middle_name,
        email_address: values.email_address,
        [spec.childTable!.fieldname]: [childRow],
      }
      return mode === "new" || !activeName
        ? frappe.createDoc(spec.doctype, payload)
        : frappe.updateDoc(spec.doctype, activeName, payload)
    },
    onSuccess: (saved) => {
      toast.success("Enrollment saved")
      queryClient.invalidateQueries({ queryKey: [spec.doctype] })
      const savedName = (saved as { name?: string })?.name
      if (savedName) setSelectedName(savedName)
      setMode("view")
    },
    onError: (error) => toast.error(`Could not save: ${getErrorMessage(error)}`),
  })

  const deleteMutation = useMutation({
    mutationFn: async (name: string) => frappe.deleteDoc(spec.doctype, name),
    onSuccess: () => {
      toast.success("Enrollment deleted")
      queryClient.invalidateQueries({ queryKey: [spec.doctype, "list"] })
      setSelectedName(undefined)
      setDeleteOpen(false)
      setMode("view")
    },
    onError: (error) => {
      toast.error(`Could not delete: ${getErrorMessage(error)}`)
      setDeleteOpen(false)
    },
  })

  function openNew() {
    setSelectedName(undefined)
    setMode("new")
    form.reset({})
  }

  function handlePrint() {
    window.print()
  }

  const displayRow = mode === "new" ? {} : docQuery.data ?? {}
  const childValues = rows[0] ?? {}

  return (
    <div className="grid grid-cols-[280px_1fr_260px] gap-4">
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #enrollment-printable, #enrollment-printable * { visibility: visible; }
          #enrollment-printable { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      {/* Left panel: directory */}
      <div className="flex flex-col gap-3 rounded-lg border p-3">
        <h2 className="text-sm font-semibold text-slate-700">Student directory</h2>
        <Input
          placeholder="Search student…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button className="bg-slate-900 text-white" onClick={openNew}>
          Add new enrollment
        </Button>
        <div className="flex flex-col gap-1 overflow-y-auto">
          {listQuery.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            (listQuery.data ?? []).map((row) => (
              <button
                key={row.name}
                onClick={() => {
                  setSelectedName(row.name)
                  setMode("view")
                }}
                className={`rounded-md border p-2 text-left text-sm hover:bg-slate-50 ${
                    activeName === row.name && mode !== "new" ? "border-slate-900 bg-slate-50" : ""
                }`}
              >
                <div className="font-medium">
                  {String(row.last_name ?? "")}, {String(row.first_name ?? "")}
                </div>
                <div className="text-xs text-muted-foreground">
                  {String(row.student_id ?? row.name)}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Center panel: tabbed detail form */}
      <div id="enrollment-printable" className="rounded-lg border p-4">
        {activeName && mode !== "new" && docQuery.isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <Form {...form}>
            <form
              id="enrollment-form"
              onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
              className="grid gap-6"
            >
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Basic information</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {spec.fields
                    .filter((f) => f.fieldtype !== "Attach Image" && f.fieldtype !== "Signature")
                    .map((f) => (
                      <fieldset key={f.fieldname} disabled={readOnly}>
                        <DynamicField control={form.control} spec={f} />
                      </fieldset>
                    ))}
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  {TABS.map((t) => (
                    <TabsTrigger key={t.key} value={t.key}>
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {TABS.map((t) => (
                  <TabsContent key={t.key} value={t.key}>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-3">
                      {fieldsForTab(t.key).map((f) => (
                        <fieldset key={f.fieldname} disabled={readOnly}>
                          <DynamicField
                            control={form.control}
                            spec={f}
                          />
                        </fieldset>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </form>
          </Form>
        )}
      </div>

      {/* Right panel: photo, signature, actions */}
      <div className="flex flex-col gap-4 rounded-lg border p-3">
        <div>
          <p className="mb-1 text-xs font-medium text-slate-600">Photo</p>
          <div className="flex h-28 w-28 items-center justify-center rounded-full border bg-slate-50 text-xs text-muted-foreground">
            No photo
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-slate-600">Signature</p>
          <div className="flex h-16 items-center justify-center rounded-md border bg-slate-50 text-xs text-muted-foreground">
            No signature
          </div>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm">Upload signature</Button>
            <Button variant="outline" size="sm">Clear</Button>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {mode === "view" ? (
            <Button onClick={() => setMode("edit")} disabled={!activeName}>
              Edit student
            </Button>
          ) : (
            <Button
              form="enrollment-form"
              type="submit"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving…" : mode === "new" ? "Create student" : "Save changes"}
            </Button>
          )}
          <Button
            variant="outline"
            className="text-red-600 hover:bg-red-100"
            disabled={!activeName || mode === "new"}
            onClick={() => setDeleteOpen(true)}
          >
            Delete student
          </Button>
          <Button variant="outline" onClick={() => setFindOpen(true)}>
            Find student
          </Button>
          <Button variant="outline" onClick={() => listQuery.refetch()}>
            Refresh
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={!activeName}>
            Print
          </Button>
          {mode !== "view" && (
            <Button
              variant="outline"
              onClick={() => {
                setMode("view")
                form.reset(displayRow)
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this enrollment?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes this record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => selectedName && deleteMutation.mutate(selectedName)}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FindEnrollmentDialog
        open={findOpen}
        onOpenChange={setFindOpen}
        onSelect={(name) => {
          setSelectedName(name)
          setMode("view")
          setFindOpen(false)
        }}
      />
    </div>
  )
}
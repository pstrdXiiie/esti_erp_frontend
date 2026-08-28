"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { frappe, getErrorMessage, type FrappeListParams } from "@/lib/frappe"
import type { FormSpec } from "@/lib/forms/types"
import { groupFieldsIntoSections, evaluateDependsOn } from "@/lib/forms/layout"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import * as form_1 from "@/components/ui/form"
import { DynamicField } from "@/components/sms/DynamicField"
import { Pencil, Trash2, Search } from "lucide-react"

export function MasterDetailScreen({
  spec,
  searchSpec,
  buildFilters,
}: {
  spec: FormSpec
  searchSpec?: FormSpec
  buildFilters?: (values: Record<string, unknown>) => FrappeListParams["filters"]
}) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FrappeListParams["filters"]>(undefined)

  const listColumns = spec.fields.filter((f) => f.inListView)
  const columns = listColumns.length ? listColumns : spec.fields.slice(0, 4)

  const { data, isLoading } = useQuery({
    queryKey: [spec.doctype, "list", activeFilters],
    queryFn: () =>
      frappe.list(spec.doctype, {
        fields: ["name", ...spec.fields.map((f) => f.fieldname)],
        limit_page_length: 100,
        filters: activeFilters,
      }),
  })

  const defaultValues = spec.fields.reduce<Record<string, unknown>>((acc, f) => {
    if (f.fieldtype === "Section Break" || f.fieldtype === "Column Break") return acc
    acc[f.fieldname] =
      f.fieldtype === "Check" ? false : f.fieldtype === "Int" || f.fieldtype === "Float" ? 0 : ""
    return acc
  }, {})

  const form = useForm<Record<string, unknown>>({ defaultValues })

  const searchDefaultValues = (searchSpec?.fields ?? [])
    .filter((f) => f.fieldtype !== "Section Break" && f.fieldtype !== "Column Break")
    .reduce<Record<string, unknown>>((acc, f) => {
      acc[f.fieldname] = f.fieldtype === "Check" ? false : ""
      return acc
    }, {})
  const searchForm = useForm<Record<string, unknown>>({ defaultValues: searchDefaultValues })
  const watchedSearch = searchForm.watch()

  function applyFilters() {
    setActiveFilters(buildFilters ? buildFilters(searchForm.getValues()) : undefined)
    setSearchDialogOpen(false)
  }

  function clearFilters() {
    searchForm.reset(searchDefaultValues)
    setActiveFilters(undefined)
  }

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      if (editing?.name) {
        return frappe.updateDoc(spec.doctype, String(editing.name), values)
      }
      return frappe.createDoc(spec.doctype, values)
    },
    onSuccess: () => {
      toast.success(`${spec.title} saved`)
      queryClient.invalidateQueries({ queryKey: [spec.doctype, "list"] })
      setDialogOpen(false)
    },
    onError: (error) => toast.error(`Could not save ${spec.title}: ${getErrorMessage(error)}`),
  })

  const deleteMutation = useMutation({
    mutationFn: async (name: string) => frappe.deleteDoc(spec.doctype, name),
    onSuccess: () => {
      toast.success(`${spec.title} deleted`)
      queryClient.invalidateQueries({ queryKey: [spec.doctype, "list"] })
      setDeleteTarget(null)
    },
    onError: (error) => {
      toast.error(`Could not delete ${spec.title}: ${getErrorMessage(error)}`)
      setDeleteTarget(null)
    },
  })

  function openNew() {
    setEditing(null)
    form.reset(defaultValues)
    setDialogOpen(true)
  }

  function openRow(row: Record<string, unknown>) {
    setEditing(row)
    form.reset({ ...defaultValues, ...row })
    setDialogOpen(true)
  }

  return (
    <div>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{spec.title}</h1>
          <div className="flex gap-2">
            {searchSpec && (
              <Button variant="outline" onClick={() => setSearchDialogOpen(true)}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            )}
            <Button className="bg-slate-800" onClick={openNew}>
              Add {spec.title}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800 hover:bg-slate-800">
                  {columns.map((c) => (
                    <TableHead className="text-white" key={c.fieldname}>{c.label}</TableHead>
                  ))}
                  <TableHead className="w-24 text-white text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data ?? []).map((row) => (
                  <TableRow key={String(row.name)}>
                    {columns.map((c) => (
                      <TableCell key={c.fieldname}>{String(row[c.fieldname] ?? "")}</TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${spec.title}`}
                          onClick={() => openRow(row)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${spec.title}`}
                          onClick={() => setDeleteTarget(row)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden p-0 gap-0 rounded-2xl">
            <DialogHeader className="border-b px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-semibold tracking-tight">
                    {editing ? `Edit ${spec.title}` : `New ${spec.title}`}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-muted-foreground">
                    {editing
                      ? `Update the ${spec.title.toLowerCase()} information below.`
                      : `Enter the information to create a new ${spec.title.toLowerCase()}.`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="max-h-[calc(90vh-145px)] overflow-y-auto">
              <form_1.Form {...form}>
                <form
                  id="detail-dialog-form"
                  onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
                  className="px-6 py-6"
                >
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                    {spec.fields
                      .filter((f) => f.fieldtype !== "Section Break" && f.fieldtype !== "Column Break")
                      .map((f) => (
                        <DynamicField key={f.fieldname} control={form.control} spec={f} />
                      ))}
                  </div>
                </form>
              </form_1.Form>
            </div>

            <div className="flex items-center justify-end gap-3 border-t bg-muted/30 px-6 py-4">
              <Button
                className="bg-slate-900 text-white hover:bg-red-100 hover:text-red-800"
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-slate-900 text-white hover:bg-emerald-500"
                type="submit"
                form="detail-dialog-form"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? "Saving…" : editing ? "Save Changes" : `Save ${spec.title}`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {searchSpec && (
          <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogContent className="w-[95vw] max-w-lg overflow-hidden p-0 gap-0 rounded-2xl">
              <DialogHeader className="border-b px-6 py-5">
                <DialogTitle className="text-lg font-semibold tracking-tight">
                  {searchSpec.title}
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                  Filter records below.
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                <form_1.Form {...searchForm}>
                  <div className="grid gap-4">
                    {groupFieldsIntoSections(searchSpec.fields).map((section, i) => (
                      <div key={i} className="grid gap-3">
                        {section.label && (
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            {section.label}
                          </h3>
                        )}
                        <div
                          className={
                            section.autoFlow ? "grid grid-cols-1 gap-4 md:grid-cols-2" : "grid gap-4"
                          }
                          style={
                            !section.autoFlow
                              ? { gridTemplateColumns: `repeat(${section.columns.length}, 1fr)` }
                              : undefined
                          }
                        >
                          {section.autoFlow
                            ? section.columns[0].map((f) => {
                                if (!evaluateDependsOn(f.dependsOn, watchedSearch)) return null
                                return (
                                  <DynamicField key={f.fieldname} control={searchForm.control} spec={f} />
                                )
                              })
                            : section.columns.map((col, ci) => (
                                <div key={ci} className="grid gap-3">
                                  {col.map((f) => {
                                    if (!evaluateDependsOn(f.dependsOn, watchedSearch)) return null
                                    return (
                                      <DynamicField
                                        key={f.fieldname}
                                        control={searchForm.control}
                                        spec={f}
                                      />
                                    )
                                  })}
                                </div>
                              ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </form_1.Form>
              </div>

              <DialogFooter className="border-t bg-muted/30 px-6 py-4">
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
                <Button type="button" className="bg-slate-800" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {spec.title}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this {spec.title.toLowerCase()} record. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleteMutation.isPending}
                onClick={() =>
                  deleteTarget?.name && deleteMutation.mutate(String(deleteTarget.name))
                }
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

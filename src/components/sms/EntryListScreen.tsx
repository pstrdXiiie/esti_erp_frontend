"use client"

import Link from "next/link"
import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
import type { EntrySpec } from "@/lib/forms/types"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

/**
 * List view for EntryScreen-backed doctypes (SMS Curriculum, SMS Permit, …):
 * rows link to a full detail page instead of opening a modal, since entry
 * documents carry a child-table grid that needs more room than a dialog.
 */
export function EntryListScreen({
  spec,
  basePath,
}: {
  spec: EntrySpec
  /** Route this list lives under, e.g. "/registrar/curriculum". */
  basePath: string
}) {
  const queryClient = useQueryClient()
  const[deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null)

  const listColumns = spec.fields.filter((f) => f.inListView)
  const columns = listColumns.length ? listColumns : spec.fields.slice(0, 4)

  const { data, isLoading } = useQuery({
    queryKey: [spec.doctype, "list"],
    queryFn: () =>
      frappe.list(spec.doctype, {
        fields: ["name", ...spec.fields.map((f) => f.fieldname)],
        limit_page_length: 100,
      }),
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

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{spec.title}</h1>
        <Button nativeButton={false} render={<Link href={`${basePath}/new`} />}>Add {spec.title}</Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="justify-between bg-slate-900 hover:bg-slate-900 hover:text-white">
                {columns.map((c) => (
                  <TableHead className="hover:text-white text-white" key={c.fieldname}>{c.label}</TableHead>
                ))}
                 <TableHead className="w-24 text-right hover:text-white text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((row) => (
                <TableRow key={String(row.name)}>
                  {columns.map((c, i) => (
                    <TableCell key={c.fieldname}>
                      {i === 0 ? (
                        <Link
                          href={`${basePath}/${encodeURIComponent(String(row.name))}`}
                          className="font-medium hover:underline"
                        >
                          {String(row[c.fieldname] ?? row.name)}
                        </Link>
                      ) : (
                        String(row[c.fieldname] ?? "")
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${spec.title}`}
                            nativeButton={false}
                            render={<Link href={`${basePath}/${encodeURIComponent(String(row.name))}`} />}
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
              {(data ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-muted-foreground text-center">
                    No records yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete {spec.title}?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This will permanently remove this {spec.title.toLowerCase()} record.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={() =>
                  deleteTarget?.name &&
                  deleteMutation.mutate(String(deleteTarget.name))
                }
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </DialogContent>
      </Dialog>
    </div>
  )
}

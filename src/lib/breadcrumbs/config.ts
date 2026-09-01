import { frappe } from "@/lib/frappe"

export type BreadcrumbResolver = (id: string) => Promise<string | null>

export const staticLabels: Record<string, string> = {
  registrar: "Registrar",
  students: "Students",
  "student-groups": "Class Groups",
  enrollment: "Enrollment & Grades",

  // Finance — segments with no separator, or that shouldn't just be
  // de-underscored, need an explicit override even after the
  // toTitleCase fix below.
  chartsofaccounts: "Charts of Accounts",
  financialreport: "Financial Report",
  sundry_acc: "Sundry Accounts",
  student_acc: "Student Accounts",
  pettycash_canteen_entry: "Petty Cash (Canteen) Entry",
}

export const hiddenSegments = new Set<string>([])

export const breadcrumbResolvers: Record<string, BreadcrumbResolver> = {
  students: async (id) => {
    const doc = await frappe.getDoc<{ student_name?: string }>("Student", id)
    return doc.student_name ?? null
  },
  "student-groups": async (id) => {
    const doc = await frappe.getDoc<{ student_group_name?: string }>(
      "Student Group",
      id
    )
    return doc.student_group_name ?? null
  },

  // "Chart of Account" doctype + account_name field confirmed earlier in
  // this build (used by GLEntryGrid's account picker).
  chartsofaccounts: async (id) => {
    const doc = await frappe.getDoc<{ account_name?: string }>(
      "Chart of Account",
      id
    )
    return doc.account_name ?? null
  },

  // Confirmed against src/lib/forms/finance.ts's studentacc FormSpec —
  // doctype is right, but there's no "account_holder_name" field; the
  // display field is "student_number" (a plain Data field, not a Link
  // to Student).
  student_acc: async (id) => {
    const doc = await frappe.getDoc<{ student_number?: string }>(
      "SMS Student Account",
      id
    )
    return doc.student_number ?? null
  },
}
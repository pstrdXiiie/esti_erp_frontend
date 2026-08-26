import { frappe } from "@/lib/frappe"

export type BreadcrumbResolver = (id: string) => Promise<string | null>

export const staticLabels: Record<string, string> = {
  registrar: "Registrar",
  students: "Students",
  "student-groups": "Class Groups",
  enrollment: "Enrollment & Grades",
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
}
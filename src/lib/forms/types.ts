/**
 * Shared types for the four screen archetypes (blueprint §5.1). Each legacy
 * form maps onto one of these; a route file resolves a FormSpec and hands it
 * to the matching template component, rather than every screen being
 * hand-built bespoke React.
 */

export type FieldType =
  | "Data"
  | "Text"
  | "Small Text"
  | "Int"
  | "Float"
  | "Currency"
  | "Date"
  | "Datetime"
  | "Time"
  | "Check"
  | "Link"
  | "Select"
  | "Attach Image"
  | "Button"
  | "Autocomplete"
  | "Signature"
  | "Column Break"
  | "Section Break"
  | "Table"


export interface FieldSpec {
  fieldname: string
  label: string
  fieldtype: FieldType
  /** For Link: target DocType. For Select: newline-joined options. */
  options?: string
  required?: boolean
  readOnly?: boolean
  inListView?: boolean
  section?: string
  dependsOn?: string
  default?: string
  description?: string
  width?: number
  /** For Link: whitelisted method to fetch options. */
  getOptions?: string
  /** For Link: whitelisted method to fetch options for autocomplete. */
  getAutocompleteOptions?: string

}

export interface FormSpec {
  /** Legacy form name, kept for traceability back to the blueprint/VB source. */
  legacyForm?: string
  doctype: string
  title: string
  fields: FieldSpec[]
  /** Whitelisted campus_erp.api.* method backing this screen's primary action, if any. */
  primaryApi?: string
}

export interface ChildTableSpec {
  fieldname: string
  doctype: string
  columns: FieldSpec[]
  variant?: "gl-entries"
}

export interface EntrySpec extends FormSpec {
  childTable?: ChildTableSpec
  /** Doctype is submittable (docstatus workflow) per blueprint §5.1. */
  submittable?: boolean
  /** Workflow actions available at the current state, e.g. ["Submit for Recommendation"]. */
  workflowActions?: string[]
}

export interface ReportSpec {
  legacyForm?: string
  /** Either a registered Frappe Report name, or a raw whitelisted method. */
  report?: string
  method?: string
  title: string
  filters: FieldSpec[]
  columns: Array<{ fieldname: string; label: string; width?: number }>
}

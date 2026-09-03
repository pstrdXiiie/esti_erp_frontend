import type { EntrySpec, FormSpec } from "@/lib/forms/types"

/**
 * Finance Billing module specs (blueprint Phase 2). Field lists mirror the
 * real installed DocTypes under campus_erp/finance_billing/doctype/ — see
 * IMPLEMENTATION-MAPPING.md's Finance Billing section. `naming_series` and
 * `amended_from` are left out of these forms the same way registrar's
 * permitSpec omits them: the series has a single fixed default and the
 * amended-from link only matters after a cancel/amend, not for data entry.
 * `payment_schedule` (erpnext's native Payment Schedule child table on SMS
 * Student Assessment) is out of scope for this pass per the migration plan.
 */
// Account and Cash
export const studentacc: FormSpec = {
  doctype: "SMS Student Account",
  title: "Student Account",
  fields: [
    { fieldname: "student_number", label: "Student Number", fieldtype: "Data", section: "Student Information", inListView: true },
    { fieldname: "school_year", label: "School Year", fieldtype: "Data", section: "Student Information" },
    { fieldname: "semester", label: "Semester", fieldtype: "Select", options: "1st Semester\n2nd Semester\n3rd Semester\nSummer\n1st Quarter\n2nd Quarter\n3rd Quarter\n4th Quarter", section: "Student Information" },
    { fieldname: "assessment", label: "Assessment", fieldtype: "Select", options: "Tuition & Fees\nMiscellaneous Fees\nLaboratory Fees", section: "Assessment & Balance" },
    { fieldname: "current_balance", label: "Current Balance", fieldtype: "Currency", readOnly: true, section: "Assessment & Balance" },
    { fieldname: "payment", label: "Payment", fieldtype: "Select", options: "Full Payment\nPartial Payment\nInstallment", section: "Payment Details" },
    { fieldname: "amount", label: "Amount", fieldtype: "Currency", section: "Payment Details" },
    { fieldname: "or_number", label: "OR Number", fieldtype: "Data", section: "Payment Details" },
    { fieldname: "payment_date", label: "Date", fieldtype: "Date", section: "Payment Details" },
    { fieldname: "enable_balance_adjustment", label: "Enable Balance Adjustment", fieldtype: "Check", section: "Balance Adjustment" },
    { fieldname: "adjustment_balance", label: "Adjustment Balance", fieldtype: "Currency", section: "Balance Adjustment", dependsOn: "enable_balance_adjustment" },
  ],
}

export const sundryacc: FormSpec = {
  doctype: "SMS Sundry Account",
  title: "Sundry Account",

  fields: [
    {
      fieldname: "payee",
      label: "Payee",
      fieldtype: "Data",
      required: true,
      section: "Transaction Details",
      inListView: true,
    },

    {
      fieldname: "payment",
      label: "Payment For",
      fieldtype: "Data",
      section: "Transaction Details",
    },

    {
      fieldname: "or_number",
      label: "OR Number",
      fieldtype: "Data",
      section: "Transaction Details",
    },

    {
      fieldname: "transaction_date",
      label: "Transaction Date",
      fieldtype: "Date",
      required: true,
      section: "Transaction Details",
    },

    {
      fieldname: "amount",
      label: "Amount",
      fieldtype: "Currency",
      required: true,
      section: "Transaction Details",
    },
  ],
};

export const sundryaccSearch: FormSpec = {
  doctype: "SMS Sundry Account Search",
  title: "Sundry Account Search Filters",

  fields: [
    {
      fieldname: "payee_searchby",
      label: "Filter by Payee",
      fieldtype: "Check",
      section: "Search & Filters",
    },

    {
      fieldname: "payee_searchby_input",
      label: "Payee Name",
      fieldtype: "Data",
      dependsOn: "eval:doc.payee_searchby==1",
      section: "Search & Filters",
    },

    {
      fieldname: "date_searchby",
      label: "Filter Date",
      fieldtype: "Date",
      section: "Search & Filters",
    },
  ],
};

export const cashReceipt: FormSpec = {
  doctype: "SMS Payment and Cash Receipt Entry",
  title: "Cash Receipt Transaction",

  fields: [
    // Payment Type
    {
      fieldname: "payment_type",
      label: "Payment Type",
      fieldtype: "Select",
      options:
        "Student Payment (From Assessment)\nStudent Payment (Other than Assessment)",
      required: true,
      section: "Payment Type",
    },

    {
      fieldname: "semester",
      label: "Semester",
      fieldtype: "Select",
      options: "1st Semester\n2nd Semester\n3rd Semester\nSummer",
      required: true,
      section: "Payment Type",
    },

    {
      fieldname: "school_year",
      label: "School Year",
      fieldtype: "Data",
      required: true,
      section: "Payment Type",
    },

    // Student Information
    {
      fieldname: "student_number",
      label: "Student No.",
      fieldtype: "Link",
      options: "Student",
      required: true,
      section: "Student Information",
      inListView: true,
    },

    {
      fieldname: "payee",
      label: "Payee",
      fieldtype: "Data",
      readOnly: true,
      section: "Student Information",
    },

    {
      fieldname: "course",
      label: "Course",
      fieldtype: "Data",
      readOnly: true,
      section: "Student Information",
    },

    // Assessment
    {
      fieldname: "assessment_fees",
      label: "Assessment of Fees",
      fieldtype: "Currency",
      readOnly: true,
      section: "Assessment & Balance",
    },

    {
      fieldname: "assessment",
      label: "Assessment",
      fieldtype: "Currency",
      readOnly: true,
      section: "Assessment & Balance",
    },

    {
      fieldname: "payment_due",
      label: "Payment Due",
      fieldtype: "Currency",
      readOnly: true,
      section: "Assessment & Balance",
    },

    {
      fieldname: "balance",
      label: "Balance",
      fieldtype: "Currency",
      readOnly: true,
      section: "Assessment & Balance",
    },

    {
      fieldname: "total_payments",
      label: "Total Payments",
      fieldtype: "Currency",
      readOnly: true,
      section: "Assessment & Balance",
    },

    {
      fieldname: "payment_period",
      label: "Payment Period",
      fieldtype: "Select",
      options: "Prelim\nMidterm\nFinal",
      section: "Assessment & Balance",
    },

    // Receipt
    {
      fieldname: "or_number",
      label: "OR Number",
      fieldtype: "Data",
      required: true,
      section: "Receipt Details",
      inListView: true,
    },

    {
      fieldname: "date",
      label: "Date",
      fieldtype: "Date",
      required: true,
      section: "Receipt Details",
    },

    {
      fieldname: "amount",
      label: "Amount",
      fieldtype: "Currency",
      required: true,
      section: "Receipt Details",
    },

    {
      fieldname: "account_charged",
      label: "Account Charged",
      fieldtype: "Link",
      options: "Account",
      required: true,
      section: "Receipt Details",
    },

    // Payment
    {
      fieldname: "mode_of_payment",
      label: "Mode of Payment",
      fieldtype: "Select",
      options: "Cash\nCheck",
      required: true,
      section: "Payment Details",
    },

    {
      fieldname: "check_number",
      label: "Check Number",
      fieldtype: "Data",
      section: "Payment Details",
      dependsOn: "mode_of_payment == 'Check'",
    },
  ],
};

// Voucher and Journal
export const pettycash: FormSpec = {
  doctype: "SMS Petty Cash Voucher",
  title: "Petty Cash Voucher",

  fields: [
    {
      fieldname: "pcv_number",
      label: "PCV Number",
      fieldtype: "Data",
      readOnly: true,
      section: "Transaction Details",
      inListView: true,
    },

    {
      fieldname: "transaction_date",
      label: "Date",
      fieldtype: "Date",
      required: true,
      section: "Transaction Details",
    },

    {
      fieldname: "petty_cash_fund",
      label: "Petty Cash Fund",
      fieldtype: "Currency",
      required: true,
      section: "Transaction Details",
    },

    {
      fieldname: "available_fund",
      label: "Available Fund",
      fieldtype: "Currency",
      readOnly: true,
      section: "Transaction Details",
    },

    {
      fieldname: "consumed_fund",
      label: "Consumed Fund",
      fieldtype: "Currency",
      readOnly: true,
      section: "Transaction Details",
    },

    {
      fieldname: "particulars",
      label: "Particulars",
      fieldtype: "Data",
      required: true,
      section: "Transaction Information",
    },

    {
      fieldname: "notes",
      label: "Notes",
      fieldtype: "Small Text",
      section: "Transaction Information",
    },

    {
      fieldname: "account",
      label: "Account",
      fieldtype: "Link",
      options: "Account",
      required: true,
      section: "Account Details",
    },

    {
      fieldname: "amount",
      label: "Amount",
      fieldtype: "Currency",
      required: true,
      section: "Account Details",
    },
  ],
};

export const pettycashEntry: FormSpec = {
  doctype: "SMS Petty Cash Account Entry",
  title: "Petty Cash Account Entry",

  fields: [
    {
      fieldname: "account",
      label: "Account",
      fieldtype: "Link",
      options: "Account",
      required: true,
      inListView: true,
    },

    {
      fieldname: "account_name",
      label: "Account Name",
      fieldtype: "Data",
      readOnly: true,
      inListView: true,
    },

    {
      fieldname: "debit",
      label: "Debit",
      fieldtype: "Currency",
      inListView: true,
    },

    {
      fieldname: "credit",
      label: "Credit",
      fieldtype: "Currency",
      inListView: true,
    },
  ],
};

export const journalvoucherentrySpec: FormSpec = {
  doctype: "SMS Journal Voucher",
  title: "Journal Vourcher",
  fields: [
    {fieldname: "account", label: "Account", fieldtype: "Link"},
    {fieldname: "account_number", label: "Account Number", fieldtype: "Data", readOnly: true },
    {fieldname: "debit", label: "Debit", fieldtype: "Currency"},
    {fieldname: "credit", label: "Credit", fieldtype: "Currency"},
  ],
}

export const journalvoucherSpec: FormSpec = {
  doctype: "SMS Journal Voucher",
  title: "Journal Voucher",
  fields: [
    {fieldname: "naming_series", label: "JV#", fieldtype: "Select"},
    {fieldname: "posting_date", label: "Date", fieldtype: "Data", readOnly: true},
    {fieldname: "user_remark", label: "Notes", fieldtype: "Small Text"},
    {fieldname: "accounts", label: "Entris", fieldtype: "Table"},
    {fieldname: "total_debit", label: "Total Debit", fieldtype: "Currency"},
    {fieldname: "total_credit", label: "Total Credit", fieldtype: "Currency" },
  ],
}

export const pettycashvoucheritem: FormSpec ={
  doctype: "SMS Petty Cash Voucher Item",
  title: "Petty Cash Voucher Item",
  fields: [
    {fieldname: "account", label: "Account", fieldtype: "Link"},
    {fieldname: "account_name", label: "Account name", fieldtype: "Data", readOnly: true},
    {fieldname: "amount", label: "Amount", fieldtype: "Currency"},
    {fieldname: "employee_no", label: "Employee No", fieldtype: "Link"},
  ],
}

export const chequeVoucherEntry: EntrySpec = {
  doctype: "Cheque Voucher Transaction",
  title: "Cheque Voucher Transaction",
  submittable: true,
  fields: [
    { fieldname: "payee", label: "Payee", fieldtype: "Data", required: true },
    { fieldname: "date", label: "Date", fieldtype: "Date", required: true },
    { fieldname: "check_number", label: "Check Number", fieldtype: "Data" },
    { fieldname: "amount", label: "Amount", fieldtype: "Currency", required: true },
    { fieldname: "check_date", label: "Check Date", fieldtype: "Date" },
    { fieldname: "notes", label: "Notes", fieldtype: "Small Text" },
  ],
  childTable: {
    fieldname: "gl_entries",
    doctype: "Cheque Voucher GL Entry",
    variant: "gl-entries",
    columns: [
      { fieldname: "account", label: "Acct #", fieldtype: "Link", options: "Account" },
      { fieldname: "account_name", label: "Acct Name", fieldtype: "Data", readOnly: true },
      { fieldname: "debit", label: "Debit", fieldtype: "Currency" },
      { fieldname: "credit", label: "Credit", fieldtype: "Currency" },
    ],
  },
}

export const pettyCashVoucherSpec: EntrySpec = {
  doctype: "SMS Petty Cash Voucher",
  title: "Petty Cash Account Entry",
  submittable: true,
  fields: [
    { fieldname: "naming_series", label: "PCV#", fieldtype: "Select" },
    { fieldname: "posting_date", label: "Date", fieldtype: "Date", required: true },
    { fieldname: "notes", label: "Notes", fieldtype: "Small Text" },
    { fieldname: "total_debit", label: "Total Debit", fieldtype: "Currency", readOnly: true },
    { fieldname: "total_credit", label: "Total Credit", fieldtype: "Currency", readOnly: true },
  ],
  childTable: {
    fieldname: "gl_entries",
    doctype: "SMS Petty Cash Account Entry",
    variant: "gl-entries",
    columns: [
      { fieldname: "account", label: "Account", fieldtype: "Link", options: "Account" },
      { fieldname: "account_name", label: "Account Name", fieldtype: "Data", readOnly: true },
      { fieldname: "debit", label: "Debit", fieldtype: "Currency" },
      { fieldname: "credit", label: "Credit", fieldtype: "Currency" },
    ],
  },
}


// Purchase Requisition Approval
export const purchaseRequisitionSpec: EntrySpec = {
  doctype: "SMS Purchase Requisition",
  title: "Purchase Requisition",
  submittable: true,
  fields: [
    { fieldname: "pr_date", label: "PR Date", fieldtype: "Date", required: true, inListView: true },
    // staging fields for the "add item" row — not stored per se, mirror the picker UI
    { fieldname: "item_code", label: "Item Code", fieldtype: "Link", options: "Item" },
    { fieldname: "item_description", label: "Item Description", fieldtype: "Data" },
    { fieldname: "supplier_terms", label: "Supplier Terms", fieldtype: "Data" },
    { fieldname: "supplier_code", label: "Supplier Code", fieldtype: "Data" },
    { fieldname: "supplier_name", label: "Supplier Name", fieldtype: "Link", options: "Supplier" },
    { fieldname: "item_cost", label: "Item Cost", fieldtype: "Currency" },
    { fieldname: "purpose", label: "Purpose", fieldtype: "Small Text", required: true },
    { fieldname: "prepared_by", label: "Prepared By", fieldtype: "Data" },
    { fieldname: "date_needed", label: "Date Needed", fieldtype: "Data", required: true },
    { fieldname: "total_amount", label: "Total Amount", fieldtype: "Currency", readOnly: true, inListView: true },
  ],
  childTable: {
    fieldname: "items",
    doctype: "SMS Purchase Requisition Item",
    columns: [
      { fieldname: "item_code", label: "Item Code", fieldtype: "Link", options: "Item", required: true },
      { fieldname: "item_description", label: "Description", fieldtype: "Data" },
      { fieldname: "qty", label: "Qty", fieldtype: "Float", required: true },
      { fieldname: "unit_cost", label: "Unit Cost", fieldtype: "Currency" },
      { fieldname: "amount", label: "Amount", fieldtype: "Currency", readOnly: true },
      { fieldname: "subcode", label: "Subcode", fieldtype: "Data" },
    ],
  },
}

export const purchaseRequisitionApproval: FormSpec = {
  doctype: "SMS Purchase Requisition Approval",
  title: "Purchase Request Approval",

  fields: [
    // Search / Filter
    {
      fieldname: "search_all",
      label: "Search All",
      fieldtype: "Check",
      section: "Search & Filter",
    },

    {
      fieldname: "date_from",
      label: "From",
      fieldtype: "Date",
      section: "Search & Filter",
    },

    {
      fieldname: "date_to",
      label: "To",
      fieldtype: "Date",
      section: "Search & Filter",
    },

    // Selected Purchase Requisition
    {
      fieldname: "purchase_requisition",
      label: "Purchase Requisition",
      fieldtype: "Link",
      options: "SMS Purchase Requisition",
      required: true,
      section: "Request Details",
      inListView: true,
    },

    {
      fieldname: "date_needed",
      label: "Date Needed",
      fieldtype: "Date",
      readOnly: true,
      section: "Request Details",
    },

    {
      fieldname: "total_amount",
      label: "Total",
      fieldtype: "Currency",
      readOnly: true,
      section: "Request Details",
    },

    {
      fieldname: "requested_by",
      label: "Requested By",
      fieldtype: "Link",
      options: "Employee",
      readOnly: true,
      section: "Request Details",
    },

    {
      fieldname: "purpose",
      label: "Purpose",
      fieldtype: "Small Text",
      readOnly: true,
      section: "Request Details",
    },

    // Approval
    {
      fieldname: "recommending_approval",
      label: "Recommending Approval",
      fieldtype: "Link",
      options: "Employee",
      section: "Approval",
    },

    {
      fieldname: "approved_by",
      label: "Approved By",
      fieldtype: "Link",
      options: "Employee",
      readOnly: true,
      section: "Approval",
    },

    {
      fieldname: "approval_status",
      label: "Approval Status",
      fieldtype: "Select",
      options: "Pending\nApproved\nDenied",
      default: "Pending",
      section: "Approval",
    },

    {
      fieldname: "approval_remarks",
      label: "Approval Remarks",
      fieldtype: "Small Text",
      section: "Approval",
    },

    {
      fieldname: "approval_date",
      label: "Approval Date",
      fieldtype: "Date",
      readOnly: true,
      section: "Approval",
    },
  ],
};

export const purchaseRequisitionApprovalSearch: FormSpec = {
  doctype: "SMS Purchase Requisition Approval Search",
  title: "Purchase Request Approval Search",

  fields: [
    {
      fieldname: "search_all",
      label: "Search All",
      fieldtype: "Check",
      section: "Search & Filter",
    },

    {
      fieldname: "date_from",
      label: "From",
      fieldtype: "Date",
      section: "Search & Filter",
    },

    {
      fieldname: "date_to",
      label: "To",
      fieldtype: "Date",
      section: "Search & Filter",
    },
  ],
};

export const purchaseOrderSpec: EntrySpec = {
  doctype: "SMS Purchase Order",
  title: "Purchase Order",
  submittable: true,
  fields: [
    { fieldname: "po_date", label: "PO Date", fieldtype: "Date", required: true, inListView: true },
    { fieldname: "purchase_requisition", label: "Purchase Requisition", fieldtype: "Link", options: "SMS Purchase Requisition", required: true },
    { fieldname: "supplier", label: "Supplier", fieldtype: "Link", options: "Supplier", required: true, inListView: true },
    { fieldname: "total_amount", label: "Total Amount", fieldtype: "Currency", readOnly: true, inListView: true },
    { fieldname: "remarks", label: "Remarks / Terms", fieldtype: "Small Text" },
  ],
  childTable: {
    fieldname: "items",
    doctype: "SMS Purchase Order Items",   // confirmed plural name — columns still TBD, see below
    columns: [],
  },
}

export const poReceivingSpec: EntrySpec = {
  doctype: "SMS Purchase Order Receiving",
  title: "Purchase Order Receiving",
  submittable: true,
  fields: [
    { fieldname: "po_number", label: "PO #", fieldtype: "Link", options: "Purchase Order", required: true, inListView: true },
    { fieldname: "po_date", label: "PO Date", fieldtype: "Date", readOnly: true },
    { fieldname: "supplier_code", label: "Supplier Code", fieldtype: "Data", readOnly: true },
    { fieldname: "supplier", label: "Supplier", fieldtype: "Data", readOnly: true },
    { fieldname: "po_totals", label: "PO Totals", fieldtype: "Currency", readOnly: true },
    { fieldname: "terms", label: "Terms", fieldtype: "Data", readOnly: true },
    { fieldname: "tax", label: "Tax", fieldtype: "Currency", readOnly: true },
    { fieldname: "delivery_date", label: "Delivery Date", fieldtype: "Date" },
    { fieldname: "si_number", label: "S.I. Number", fieldtype: "Data" },
    { fieldname: "delivery_receipt", label: "Scanned Delivery Receipt", fieldtype: "Attach" },
    { fieldname: "official_receipt", label: "Scanned Official Receipt", fieldtype: "Attach" },
  ],
  // childTable for received items intentionally omitted — see note below
}

export const duePoPayableSpec: EntrySpec = {
  doctype: "SMS Purchase Order Payable",
  title: "Due Purchase Order Payables",
  submittable: true,
  fields: [
    { fieldname: "ponum", label: "PO #", fieldtype: "Data", required: true, inListView: true },
    { fieldname: "sapcode", label: "Supplier Code", fieldtype: "Data", inListView: true },
    { fieldname: "surname", label: "Supplier", fieldtype: "Data", inListView: true },
    { fieldname: "podate", label: "PO Date", fieldtype: "Date", inListView: true },
    { fieldname: "date_posted", label: "Date PO Posted", fieldtype: "Date", inListView: true },
    { fieldname: "siunum", label: "S.I. Number", fieldtype: "Data", inListView: true },
    { fieldname: "poterms", label: "Terms", fieldtype: "Data", inListView: true },
    { fieldname: "potax", label: "Tax %", fieldtype: "Float", inListView: true },
    { fieldname: "poamount", label: "Amount", fieldtype: "Currency", inListView: true },
    { fieldname: "aging", label: "Aging", fieldtype: "Int", readOnly: true, inListView: true },
    { fieldname: "pay_to", label: "Pay to", fieldtype: "Data" },       // guess — not in list columns
    { fieldname: "check_number", label: "Check Number", fieldtype: "Data" },
    { fieldname: "check_date", label: "Check Date", fieldtype: "Date" },
    { fieldname: "notes", label: "Notes", fieldtype: "Small Text" },
  ],
  childTable: {
    fieldname: "gl_entries",
    doctype: "SMS Purchase Order Payable GL Entry",  // guessed doctype name
    variant: "gl-entries",
    columns: [
      { fieldname: "account", label: "Acct #", fieldtype: "Link", options: "Account" },
      { fieldname: "account_name", label: "Acct Name", fieldtype: "Data", readOnly: true },
      { fieldname: "debit", label: "Debit", fieldtype: "Currency" },
      { fieldname: "credit", label: "Credit", fieldtype: "Currency" },
    ],
  },
}


export const discountSpec: FormSpec = {
  doctype: "SMS Discount",
  title: "Discounts",
  fields: [
    { fieldname: "discount_code", label: "Discount Code", fieldtype: "Data", required: true, inListView: true },
    { fieldname: "description", label: "Description", fieldtype: "Data", required: true, inListView: true },
    {
      fieldname: "tf_discount_mode",
      label: "Tuition Fee Discount Mode",
      fieldtype: "Select",
      options: "Fixed Amount\nPercentage",
      required: true,
    },
    { fieldname: "tf_discount_value", label: "Tuition Fee Discount Value", fieldtype: "Float" },
    {
      fieldname: "misc_discount_mode",
      label: "Misc Fee Discount Mode",
      fieldtype: "Select",
      options: "Fixed Amount\nPercentage",
      required: true,
    },
    { fieldname: "misc_discount_value", label: "Misc Fee Discount Value", fieldtype: "Float" },
    { fieldname: "on_tf", label: "Base Includes Tuition Fee", fieldtype: "Check" },
    {
      fieldname: "tf_base",
      label: "Tuition Fee Base",
      fieldtype: "Select",
      options: "Tuition Only\nTuition + Misc",
    },
    { fieldname: "is_disabled", label: "Disabled", fieldtype: "Check", inListView: true },
  ],
}

export const assessmentSpec: EntrySpec = {
  doctype: "SMS Student Assessment",
  title: "Student Assessment",
  submittable: true,
  fields: [
    { fieldname: "student", label: "Student Number", fieldtype: "Link", options: "Student", required: true, inListView: true },
    { fieldname: "student_name", label: "Student Name", fieldtype: "Data", readOnly: true, inListView: true },
    {
      fieldname: "program_enrollment",
      label: "Program Enrollment",
      fieldtype: "Link",
      options: "Program Enrollment",
      required: true,
    },
    { fieldname: "program", label: "Program", fieldtype: "Link", options: "Program" },
    { fieldname: "company", label: "Company", fieldtype: "Link", options: "Company", required: true },
    { fieldname: "currency", label: "Currency", fieldtype: "Link", options: "Currency" },
    { fieldname: "school_year", label: "School Year", fieldtype: "Data", required: true },
    { fieldname: "school_term", label: "School Term", fieldtype: "Data", required: true },
    { fieldname: "semester", label: "Semester", fieldtype: "Int", required: true },
    { fieldname: "year_level", label: "Year Level", fieldtype: "Data" },
    {
      fieldname: "student_type",
      label: "Student Type",
      fieldtype: "Select",
      options: "New\nOld\nTransferee\nReturnee",
    },
    { fieldname: "posting_date", label: "Posting Date", fieldtype: "Date", required: true },
    { fieldname: "due_date", label: "Due Date", fieldtype: "Date" },
    { fieldname: "tuition", label: "Tuition", fieldtype: "Currency" },
    { fieldname: "new_tuition", label: "New Tuition", fieldtype: "Currency", readOnly: true },
    { fieldname: "misc_fee", label: "Misc Fee", fieldtype: "Currency" },
    { fieldname: "other_fee", label: "Other Fee", fieldtype: "Currency" },
    { fieldname: "assessment", label: "Assessment", fieldtype: "Currency", readOnly: true },
    { fieldname: "discount_type", label: "Discount Type", fieldtype: "Link", options: "SMS Discount" },
    { fieldname: "discount_percent", label: "Discount Percent", fieldtype: "Float" },
    { fieldname: "other_discount", label: "Other Discount", fieldtype: "Currency" },
    { fieldname: "misc_discount", label: "Misc Discount", fieldtype: "Currency" },
    { fieldname: "scholarship", label: "Scholarship", fieldtype: "Link", options: "Fee Category" },
    { fieldname: "subsidy", label: "Subsidy", fieldtype: "Currency" },
    { fieldname: "old_account", label: "Old Account", fieldtype: "Currency" },
    { fieldname: "old_assessment", label: "Old Assessment", fieldtype: "Currency" },
    { fieldname: "old_account_payment", label: "Old Account Payment", fieldtype: "Currency" },
    { fieldname: "total_fee", label: "Total Fee", fieldtype: "Currency", readOnly: true, inListView: true },
    { fieldname: "payment", label: "Payment", fieldtype: "Currency", readOnly: true },
    { fieldname: "receivable", label: "Receivable", fieldtype: "Currency", readOnly: true, inListView: true },
    { fieldname: "refnum", label: "Ref No", fieldtype: "Data" },
    { fieldname: "cor_reference", label: "COR Reference", fieldtype: "Data" },
    { fieldname: "receivable_account", label: "Receivable Account", fieldtype: "Link", options: "Account", readOnly: true },
    { fieldname: "cost_center", label: "Cost Center", fieldtype: "Link", options: "Cost Center", readOnly: true },
    {
      fieldname: "status",
      label: "Status",
      fieldtype: "Select",
      options: "Draft\nAssessed\nReassessed\nWithdrawn\nCancelled",
      inListView: true,
    },
    { fieldname: "is_reassessment", label: "Is Reassessment", fieldtype: "Check" },
    { fieldname: "branch", label: "Branch", fieldtype: "Link", options: "Branch" },
  ],
  childTable: {
    fieldname: "assessment_detail",
    doctype: "SMS Student Assessment Detail",
    columns: [
      { fieldname: "particular", label: "Particular", fieldtype: "Data", required: true },
      {
        fieldname: "item_type",
        label: "Item Type",
        fieldtype: "Select",
        options: "Tuition\nMisc Fee\nDiscount\nSurcharge\nPrevious Balance\nScholarship\nTotal",
        required: true,
      },
      { fieldname: "fee_code", label: "Fee Code", fieldtype: "Link", options: "Fee Category" },
      { fieldname: "header_code", label: "Header Code", fieldtype: "Link", options: "Fee Category" },
      { fieldname: "amount", label: "Amount", fieldtype: "Currency", required: true },
      { fieldname: "true_amount", label: "True Amount", fieldtype: "Currency" },
      { fieldname: "amount_paid", label: "Amount Paid", fieldtype: "Currency" },
    ],
  },
}


export const chartOfAccountSpec: EntrySpec = {
  doctype: "Account",
  title: "Chart of Account",
  fields: [
    { fieldname: "account_name", label: "Account Name", fieldtype: "Data", required: true, inListView: true, section: "Account Details" },
    { fieldname: "account_number", label: "Account Number", fieldtype: "Data", inListView: true, section: "Account Details" },
    {
      fieldname: "root_type",
      label: "Type",
      fieldtype: "Select",
      options: "Asset\nLiability\nIncome\nExpense\nEquity",
      required: true,
      inListView: true,
      section: "Account Details",
    },
    { fieldname: "legacy_header", label: "Header", fieldtype: "Data", inListView: true, section: "Account Details" },
    {
      fieldname: "account_type",
      label: "Account Type (ERPNext)",
      fieldtype: "Select",
      options:
        "\nAccumulated Depreciation\nAsset Received But Not Billed\nBank\nCash\nChargeable\nCapital Work in Progress\nCost of Goods Sold\nCurrent Asset\nCurrent Liability\nDepreciation\nDirect Expense\nDirect Income\nEquity\nExpense Account\nExpenses Included In Asset Valuation\nExpenses Included In Valuation\nFixed Asset\nIncome Account\nIndirect Expense\nIndirect Income\nLiability\nPayable\nReceivable\nRound Off\nRound Off for Opening\nStock\nStock Adjustment\nStock Received But Not Billed\nService Received But Not Billed\nTax\nTemporary",
      description: "ERPNext's native classification, separate from the legacy Header label above",
      section: "Account Details",
    },
    { fieldname: "company", label: "Company", fieldtype: "Link", options: "Company", required: true, section: "Structure" },
    { fieldname: "parent_account", label: "Parent Account", fieldtype: "Link", options: "Account", required: true, section: "Structure" },
    { fieldname: "is_group", label: "Is Group (header/parent account)", fieldtype: "Check", section: "Structure" },
  ],
}

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
      label: "Chart of Account",
      fieldtype: "Link",
      options: "Chart of Account",
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
      options: "Chart of Account",
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
      fieldname: "receipt_date",
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
      options: "Chart of Account",
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
    { fieldname: "student", label: "Student", fieldtype: "Link", options: "Student", required: true, inListView: true },
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
    { fieldname: "receivable_account", label: "Receivable Account", fieldtype: "Link", options: "Chart of Account", readOnly: true },
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
      { fieldname: "account", label: "Acct #", fieldtype: "Link", options: "Chart of Account" },
      { fieldname: "account_name", label: "Acct Name", fieldtype: "Data", readOnly: true },
      { fieldname: "debit", label: "Debit", fieldtype: "Currency" },
      { fieldname: "credit", label: "Credit", fieldtype: "Currency" },
    ],
  },
}

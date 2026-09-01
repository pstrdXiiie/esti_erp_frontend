"use client"

import { VoucherEntryForm } from "@/components/finance/VoucherEntryForm"
import type { ChildTableSpec } from "@/lib/forms/types"

const accountsChildSpec: ChildTableSpec = {
  doctype: "SMS Petty Cash Account Entry",
  fields: [
    { fieldname: "account", label: "Account", fieldtype: "Link", options: "Account", required: true },
    { fieldname: "account_name", label: "Account Name", fieldtype: "Data", readOnly: true },
    { fieldname: "debit", label: "Debit", fieldtype: "Currency" },
    { fieldname: "credit", label: "Credit", fieldtype: "Currency" },
  ],
}

export default function PettyCashEntryPage() {
  return (
    <VoucherEntryForm
      title="Petty Cash Account Entry"
      description="Record petty cash account movements."
      docLabel="PCV#"
      namingSeriesOptions={["PCV-.YYYY.-", "PCV-MANUAL-"]}
      childSpec={accountsChildSpec}
      saveLabel="Save Petty Cash Entry"
    />
  )
}

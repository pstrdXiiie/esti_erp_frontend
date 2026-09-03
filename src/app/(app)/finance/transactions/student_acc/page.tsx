"use client"
import { FinanceEntryListScreen } from "@/components/finance/FinanceEntryListScreen"
import { AssessmentActions } from "@/components/finance/AssessmentActions"
import { assessmentSpec } from "@/lib/forms/finance"

export default function StudentAccountsListPage() {
  return (
    <FinanceEntryListScreen
      spec={assessmentSpec}
      renderExtra={(name) => <AssessmentActions name={name} />}
    />
  )
}

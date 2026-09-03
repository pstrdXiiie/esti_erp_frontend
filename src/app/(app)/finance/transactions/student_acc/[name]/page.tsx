"use client"

import { use, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { BookOpen } from "lucide-react"

import { frappe, getErrorMessage } from "@/lib/frappe"
import { FinanceEntryScreen } from "@/components/finance/FinanceEntryScreen"
import { assessmentSpec } from "@/lib/forms/finance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { AssessmentActions } from "@/components/finance/AssessmentActions"

interface AssessmentDoc {
  name: string
  docstatus: number
  receivable?: number
  payment?: number
  total_fee?: number
  student_name?: string
}

const BASE_PATH = "/finance/transactions/student_acc"

export default function StudentAccountEntryPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = use(params)
  const isNew = name === "new"
  const docName = isNew ? undefined : decodeURIComponent(name)

  return (
    <div className="grid gap-6">
      <FinanceEntryScreen spec={assessmentSpec} name={docName} basePath={BASE_PATH} />
      {docName && <AssessmentActions name={docName} />}
    </div>
  )
}

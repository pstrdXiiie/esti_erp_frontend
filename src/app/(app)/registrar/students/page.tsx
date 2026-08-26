"use client"

import { MasterDetailScreen } from "@/components/sms/MasterDetailScreen"
import { studentEnrollmentSpec } from "@/lib/forms/registrar"

export default function StudentsPage() {
  return <MasterDetailScreen spec={studentEnrollmentSpec} />
}

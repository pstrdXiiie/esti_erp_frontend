"use client";

import { DetailScreen } from "@/components/sms/DetailScreen";
import { pettycash } from "@/lib/forms/finance";

export default function Page() {
  return <DetailScreen spec={pettycash} name={""} />;
}
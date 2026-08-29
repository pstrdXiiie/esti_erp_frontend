"use client";

import { DetailScreen } from "@/components/sms/DetailScreen";
import { sundryacc, sundryaccSearch } from "@/lib/forms/finance";

export default function Page() {
  return (
    <DetailScreen
      spec={sundryacc} name={""}    />
  );
}
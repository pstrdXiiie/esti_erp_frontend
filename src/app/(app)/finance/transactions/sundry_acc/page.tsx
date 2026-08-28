"use client"

import { MasterDetailScreen } from "@/components/sms/MasterDetailScreen"
import { sundryacc, sundryaccSearch } from "@/lib/forms/finance"

export default function Page() {
  return (
    <MasterDetailScreen
      spec={sundryacc}
      searchSpec={sundryaccSearch}
      buildFilters={(values) => {
        const filters: Array<[string, string, unknown]> = []
        if (values.payee_searchby && values.payee_searchby_input) {
          filters.push(["payee", "like", `%${values.payee_searchby_input}%`])
        }
        if (values.date_searchby) {
          filters.push(["date", "=", values.date_searchby])
        }
        return filters.length ? filters : undefined
      }}
    />
  )
}
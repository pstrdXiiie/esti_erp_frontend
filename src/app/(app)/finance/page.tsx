import Link from "next/link"
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  BanknoteArrowUp,
  ChartPieIcon,
  ToolCase,

} from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SCREENS = [
  {
    href: "/finance/chartsofaccounts",
    title: "Charts of Accounts",
    description:
      "Manage accounnts",
    icon: ChartNoAxesCombined,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    href: "/finance/transactions",
    title: "Transactions",
    description:
      "Record and manage financial activities such as payments, collections, invoices, and expenses.",
    icon: BanknoteArrowUp,
    className: "md:col-span-2 md:row-span-1",
  },
  {
    href: "/finance/financialreport",
    title: "Financial Repports",
    description:
      "View summaries and reports of the institution’s financial activities and performance.",
    icon: ChartPieIcon,
    className: "md:col-span-2",
  },
   {
    href: "/finance/maintenance",
    title: "Maintenance",
    description:
      "Manage finance settings.",
    icon: ToolCase,
    className: "md:col-span-1",
  },
]

export default function FinancePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Finance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Billing, student assessments, discounts, and e-cash wallets.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[180px]">
        {SCREENS.map((screen) => {
          const Icon = screen.icon

          return (
            <Link
              key={screen.href}
              href={screen.href}
              className={screen.className}
            >
              <Card className="group relative h-full overflow-hidden border-border/60 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg">
                <CardHeader className="relative z-10 flex h-full flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  <div>
                    <CardTitle className="text-xl">
                      {screen.title}
                    </CardTitle>

                    <CardDescription className="mt-2 max-w-md leading-relaxed">
                      {screen.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                {/* Decorative background */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-muted/50 blur-2xl transition-all duration-500 group-hover:scale-150" />
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
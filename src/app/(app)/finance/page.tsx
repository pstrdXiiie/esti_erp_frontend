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
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white",
    glowBg: "bg-blue-500/20 group-hover:bg-blue-500/40",
    hoverBorder: "hover:border-blue-500/50"
  },
  {
    href: "/finance/transactions",
    title: "Transactions",
    description:
      "Record and manage financial activities such as payments, collections, invoices, and expenses.",
    icon: BanknoteArrowUp,
    className: "md:col-span-2 md:row-span-1",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
    glowBg: "bg-emerald-500/20 group-hover:bg-emerald-500/40",
    hoverBorder: "hover:border-emerald-500/50",
  },
  {
    href: "/finance/financialreport",
    title: "Financial Repports",
    description:
      "View summaries and reports of the institution’s financial activities and performance.",
    icon: ChartPieIcon,
    className: "md:col-span-2",
    badgeBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white",
    glowBg: "bg-purple-500/20 group-hover:bg-purple-500/40",
    hoverBorder: "hover:border-purple-500/50",
  },
   {
    href: "/finance/maintenance",
    title: "Maintenance",
    description:
      "Manage finance settings.",
    icon: ToolCase,
    className: "md:col-span-1",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white",
    glowBg: "bg-amber-500/20 group-hover:bg-amber-500/40",
    hoverBorder: "hover:border-amber-500/50",
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
              <Card
                className={`group relative h-full overflow-hidden border-border/60 bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${screen.hoverBorder}`}
              >
                <CardHeader className="relative z-10 flex h-full flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    {/* Icon container with default & hover styles */}
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 ${screen.badgeBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Arrow icon with hover transition */}
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground" />
                  </div>

                  <div>
                    <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary">
                      {screen.title}
                    </CardTitle>

                    <CardDescription className="mt-2 max-w-md leading-relaxed">
                      {screen.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                {/* Decorative background glow with individual color customization */}
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150 ${screen.glowBg}`}
                />
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
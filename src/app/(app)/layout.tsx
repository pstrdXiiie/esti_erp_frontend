"use client"

import { useEffect, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { AppBreadcrumb } from "@/components/breadcrumbs/app-breadcrumb"


const NAV_ITEMS: Array<{ module: string; label: string; href: string }> = [
  { module: "Registrar", label: "Registrar", href: "/registrar" },
  { module: "Finance", label: "Finance", href: "/finance" },
  { module: "Personnel", label: "Personnel", href: "/personnel" },
  { module: "Asset", label: "Asset & Property", href: "/asset" },
  { module: "Library", label: "Library", href: "/library" },
  { module: "Administration", label: "Administration", href: "/administration" },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, hasModule, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-1 bg-slate-50">
      <aside className="sticky top-0 h-screen w-64 shrink-0 self-start overflow-y-auto border-r bg-muted/20 p-4 flex flex-col gap-4">
        <div className="px-2">
          <p className="font-semibold">Campus ERP</p>
          <p className="text-sm text-muted-foreground">{user.full_name}</p>
        </div>
        <nav className="flex flex-col gap-1">
          <Link
            href="/dashboard"
            className={cn(
              "rounded px-3 py-2 text-sm hover:bg-muted",
              pathname === "/dashboard" && "bg-muted font-medium"
            )}
          >
            Dashboard
          </Link>
          {NAV_ITEMS.filter((item) => hasModule(item.module)).map((item) => (
            <Link
              key={item.module}
              href={item.href}
              className={cn(
                "rounded px-3 py-2 text-sm hover:bg-muted",
                pathname.startsWith(item.href) && "bg-muted font-medium"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <AppBreadcrumb />
        <div className="mt-4">{children}</div>
      </main>
    </div>
  )
}

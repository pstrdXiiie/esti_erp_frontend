"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { frappe, setCSRFToken } from "@/lib/frappe"
import frappeClient from "@/lib/frappe"

interface AuthUser {
  user: string
  full_name: string
  roles: string[]
  modules: string[]
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (usr: string, pwd: string) => Promise<void>
  logout: () => Promise<void>
  hasModule: (module: string) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const ME_QUERY_KEY = ["auth", "me"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user, isLoading } = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      try {
        const me = await frappe.me()
        console.log("[DEBUG] csrf_token received from /me:", me.csrf_token)
        setCSRFToken(me.csrf_token)
        console.log("[DEBUG] header now set to:", frappeClient.defaults.headers.common["X-Frappe-CSRF-Token"])
        // setCSRFToken(me.csrf_token)
        return me
      } catch {
        return null
      }
    },
    retry: false,
  })

  async function login(usr: string, pwd: string) {
    await frappe.login(usr, pwd)
    await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
  }

 async function logout() {
  try {
    await frappe.logout()
  } catch (err) {
    console.error("Logout request failed, clearing session locally anyway:", err)
  } finally {
    queryClient.setQueryData(ME_QUERY_KEY, null)
    router.push("/login")
  }
}

  function hasModule(module: string) {
    return user?.modules.includes(module) ?? false
  }

  return (
    <AuthContext.Provider
      value={{ user: user ?? null, loading: isLoading, login, logout, hasModule }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

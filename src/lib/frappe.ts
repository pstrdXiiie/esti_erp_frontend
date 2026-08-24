/**
 * Thin client over the Frappe REST/RPC API.
 *
 * Three concerns, per the migration blueprint's Frontend Architecture (§5.4):
 *  1. CRUD against `/api/resource/<DocType>` for Master/Detail screens.
 *  2. Whitelisted RPC against `/api/method/campus_erp.api.<module>.<fn>` for
 *     every business rule (enrollment, assessment, GL posting, payroll, fines) —
 *     the frontend never re-implements these, it only calls them.
 *  3. (Phase 2+) Realtime via Frappe's socketio channel.
 *
 * In development, Next.js proxies /api/* to the bench (see next.config.ts) so
 * the Frappe session cookie stays same-origin.
 */
import axios, { type AxiosInstance } from "axios"

const frappeClient: AxiosInstance = axios.create({
  baseURL: "/",
  withCredentials: true,
})

// Frappe issues a CSRF token on the logged-in session (frappe.csrf_token via
// boot info). Once the auth provider fetches boot info, it calls this to make
// every subsequent write request valid.
export function setCSRFToken(token: string | undefined) {
  if (token) {
    frappeClient.defaults.headers.common["X-Frappe-CSRF-Token"] = token
  }
}

/**
 * Frappe surfaces thrown business-rule errors (frappe.throw) as a 417/403/500
 * response carrying `_server_messages` (a JSON-encoded array of JSON-encoded
 * {message,...} objects) rather than a flat `message` string — this unwraps
 * that so callers can show the real reason instead of "Request failed with
 * status code 417".
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; exception?: string; _server_messages?: string }
      | undefined
    if (data?._server_messages) {
      try {
        const messages = JSON.parse(data._server_messages) as string[]
        if (messages[0]) {
          const parsed = JSON.parse(messages[0]) as { message?: string }
          if (parsed.message) return parsed.message
        }
      } catch {
        // fall through to the other fields
      }
    }
    if (data?.exception) return data.exception.replace(/^[\w.]+:\s*/, "")
    if (data?.message) return data.message
  }
  return "Something went wrong"
}

export interface FrappeListParams {
  fields?: string[]
  filters?: Array<[string, string, unknown]> | Record<string, unknown>
  order_by?: string
  limit_start?: number
  limit_page_length?: number
}

export const frappe = {
  /** GET /api/resource/<doctype> — list view for Master/Detail screens. */
  async list<T = Record<string, unknown>>(
    doctype: string,
    params: FrappeListParams = {}
  ): Promise<T[]> {
    const { data } = await frappeClient.get(
      `/api/resource/${encodeURIComponent(doctype)}`,
      {
        params: {
          fields: JSON.stringify(params.fields ?? ["name"]),
          filters: params.filters ? JSON.stringify(params.filters) : undefined,
          order_by: params.order_by,
          limit_start: params.limit_start,
          limit_page_length: params.limit_page_length ?? 20,
        },
      }
    )
    return data.data as T[]
  },

  /** GET /api/resource/<doctype>/<name> — single document for detail panels. */
  async getDoc<T = Record<string, unknown>>(
    doctype: string,
    name: string
  ): Promise<T> {
    const { data } = await frappeClient.get(
      `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`
    )
    return data.data as T
  },

  /** POST /api/resource/<doctype> — create. */
  async createDoc<T = Record<string, unknown>>(
    doctype: string,
    values: Record<string, unknown>
  ): Promise<T> {
    const { data } = await frappeClient.post(
      `/api/resource/${encodeURIComponent(doctype)}`,
      values
    )
    return data.data as T
  },

  /** PUT /api/resource/<doctype>/<name> — update. */
  async updateDoc<T = Record<string, unknown>>(
    doctype: string,
    name: string,
    values: Record<string, unknown>
  ): Promise<T> {
    const { data } = await frappeClient.put(
      `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
      values
    )
    return data.data as T
  },

  /** DELETE /api/resource/<doctype>/<name>. */
  async deleteDoc(doctype: string, name: string): Promise<void> {
    await frappeClient.delete(
      `/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`
    )
  },

  /**
   * Whitelisted RPC — every business rule identified in the blueprint's
   * Backend Architecture (§4.3) lives behind campus_erp.api.<module>.<fn>,
   * never re-implemented client-side.
   */
 async call<T = unknown>(
  method: string,
  args: Record<string, unknown> = {},
  httpMethod: "get" | "post" = "post"
): Promise<T> {
  const { data } =
    httpMethod === "get"
      ? await frappeClient.get(`/api/method/${method}`, { params: args })
      : await frappeClient.post(`/api/method/${method}`, args)
  return data.message as T
},

  async login(usr: string, pwd: string) {
    const { data } = await frappeClient.post("/api/method/login", { usr, pwd })
    return data
  },

  async logout() {
    await frappeClient.post("/api/method/logout")
  },

  /** campus_erp.api.auth.me() — roles + visible module list for the sidebar. */
  async me() {
  return frappe.call<{
    user: string
    full_name: string
    roles: string[]
    modules: string[]
    csrf_token: string
  }>("campus_erp.api.auth.me", {}, "get")
},
}

export default frappeClient

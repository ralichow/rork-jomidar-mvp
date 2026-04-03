declare const __DEV__: boolean | undefined

type MaybeRecord = Record<string, unknown> | string | undefined | null

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false

function shorten(value: unknown, maxLen = 160): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  if (typeof value === 'string') {
    const trimmed = value.length > maxLen ? `${value.slice(0, maxLen)}…` : value
    // avoid newlines that can spam Metro
    return trimmed.replace(/\s+/g, ' ')
  }

  if (typeof value === 'object') {
    try {
      // Don't stringify huge objects
      const asJson = JSON.stringify(value)
      if (asJson.length > maxLen) return `${String(asJson.slice(0, maxLen))}…`
      return asJson
    } catch {
      return '[object]'
    }
  }

  return String(value)
}

function formatParams(params: MaybeRecord): string {
  if (params === undefined || params === null) return '-'
  if (typeof params === 'string') return shorten(params)

  const entries = Object.entries(params).slice(0, 10)
  const parts = entries.map(([k, v]) => `${k}=${shorten(v)}`)
  return `{${parts.join(', ')}}`
}

export function supabaseReqTrace(table: string, action: string, params: MaybeRecord): void {
  if (!isDev) return
  console.log(`[⚡ Supabase: REQ] -> ${table} | ${action} | ${formatParams(params)}`)
}

export function supabaseResTrace(table: string, action: string, details?: MaybeRecord): void {
  if (!isDev) return
  console.log(`[✅ Supabase: RES] -> ${table} | ${action} | ${formatParams(details)}`)
}

export function supabaseErrTrace(table: string, action: string, error: unknown): void {
  if (!isDev) return

  const err: any = error
  const message = err?.message ?? String(error)
  const hint = err?.hint

  const hintPart =
    hint === undefined || hint === null || hint === ''
      ? 'hint=-'
      : `hint=${shorten(hint, 220)}`

  console.log(
    `[❌ Supabase: ERR] -> ${table} | ${action} | message=${shorten(message)} | ${hintPart}`
  )
}

export function getRowCount(data: unknown): number | null {
  if (Array.isArray(data)) return data.length
  if (data === null || data === undefined) return 0

  return typeof data === 'object' ? 1 : null
}


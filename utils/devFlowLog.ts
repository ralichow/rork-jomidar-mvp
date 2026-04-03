import { useEffect } from 'react'

declare const __DEV__: boolean | undefined

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error' | 'debug'

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

export function formatTimestamp(date = new Date()): string {
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  const milliseconds = pad(date.getMilliseconds(), 3)
  const offsetMinutes = -date.getTimezoneOffset()
  const offsetSign = offsetMinutes >= 0 ? '+' : '-'
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60))
  const offsetRemainder = pad(Math.abs(offsetMinutes) % 60)

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} GMT${offsetSign}${offsetHours}:${offsetRemainder}`
}

export function installTimestampedConsole(): void {
  if (!isDev) return

  const logger = console as typeof console & {
    __timestampedLogsInstalled?: boolean
    __timestampedOriginalMethods?: Partial<Record<ConsoleMethod, typeof console.log>>
  }

  if (logger.__timestampedLogsInstalled) return

  const originalMethods: Partial<Record<ConsoleMethod, typeof console.log>> = {}

  ;(['log', 'info', 'warn', 'error', 'debug'] as ConsoleMethod[]).forEach(method => {
    const originalMethod = logger[method].bind(logger)
    originalMethods[method] = originalMethod

    logger[method] = ((...args: unknown[]) => {
      originalMethod(`[${formatTimestamp()}]`, ...args)
    }) as typeof console.log
  })

  logger.__timestampedOriginalMethods = originalMethods
  logger.__timestampedLogsInstalled = true
}

export function devFlowLog(component: string, action: string): void {
  if (!isDev) return
  console.log(`[📱 UI: FLOW] -> ${component} | ${action}`)
}

export function useDevFlowMount(component: string): void {
  useEffect(() => {
    devFlowLog(component, 'Mount')
  }, [component])
}


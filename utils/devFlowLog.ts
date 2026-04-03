import { useEffect } from 'react'

declare const __DEV__: boolean | undefined

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false

export function devFlowLog(component: string, action: string): void {
  if (!isDev) return
  console.log(`[📱 UI: FLOW] -> ${component} | ${action}`)
}

export function useDevFlowMount(component: string): void {
  useEffect(() => {
    devFlowLog(component, 'Mount')
  }, [component])
}


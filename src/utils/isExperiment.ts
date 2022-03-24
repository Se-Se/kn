import { useState, useCallback } from 'react'

const key = 'sysauditor-experiment'
const value = 'whosyourdaddy'

export function setIsExperiment(v: boolean) {
  if (v) {
    window.localStorage.setItem(key, value)
  } else {
    window.localStorage.removeItem(key)
  }
}

export function isExperiment() {
  return window.localStorage.getItem(key) === value
}

function switchExperiment() {
  setIsExperiment(!isExperiment())
}

export function useSwitchExperiment() {
  const [, setV] = useState(false)
  return useCallback(() => {
    switchExperiment()
    setV(v => !v)
  }, [])
}

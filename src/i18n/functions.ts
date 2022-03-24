import { FluentValue } from '@fluent/bundle'

export const functions = {
  UPPERFIRST([s]: FluentValue[]) {
    if (typeof s === 'string') {
      return s.replace(/^\S/, s => s.toUpperCase())
    }
    return s
  },
}

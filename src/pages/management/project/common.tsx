import { useState } from 'react'
import { GetArrayElementType } from 'utils/types'

export const Options = ['all', 'deleted', 'normal'] as const
type Opts = GetArrayElementType<typeof Options>
const OptionsMap: Record<Opts, boolean | null> = {
  all: null,
  deleted: true,
  normal: false,
}

export const useDeletedFilter = () => {
  const [filter, setFilter] = useState<Opts>('all')
  return {
    deleted: OptionsMap[filter],
    value: filter,
    onChange: (v: string) => setFilter(v as Opts),
  }
}

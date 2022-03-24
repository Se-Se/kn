import { SortBy } from '@tencent/tea-component/lib/table/addons'
import { OrderByInput, Order } from 'generated/graphql'
import Maybe from 'graphql/tsutils/Maybe'
export const AllValue = '! ==All=='

export function filter2FilterFields(filter: Record<string, string[]>) {
  // remove unselected field
  filter = Object.fromEntries(Object.entries(filter).filter(([_, val]) => val.length > 0))

  const keys = Object.keys(filter)

  if (keys.length === 0) {
    return undefined
  }
  return filter
}

export function sort2OrderBy(sortBy: SortBy[]): Maybe<OrderByInput> {
  const f = sortBy.filter(i => i.order)
  if (f.length > 0) {
    const [s] = f
    return {
      field: s.by,
      order: s.order! === 'asc' ? Order.Asc : Order.Desc,
    }
  } else {
    return null
  }
}

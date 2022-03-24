import { OperationVariables, QueryHookOptions, QueryResult } from '@apollo/client'

export const omitVariables = <TData = any, TVariables = OperationVariables, OmitData extends Partial<TVariables> = {}>(
  useQuery: (options: QueryHookOptions<TData, TVariables>) => QueryResult<TData, TVariables>,
  data: OmitData
) => {
  return (options?: QueryHookOptions<TData, Omit<TVariables, keyof OmitData>>) => {
    let opt = options
    if (opt) {
      if (opt.variables) {
        opt.variables = {
          ...opt.variables,
          ...data
        }
      } else {
        opt.variables = data as any
      }
    } else {
      opt = {
        variables: data as any
      }
    }
    return useQuery(opt as any)
  }
}

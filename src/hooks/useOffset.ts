import { useState, useMemo } from 'react'
import { OffsetConnectionInput } from 'generated/graphql'
import { PaginationProps } from '@tencent/tea-component'

type Props = Required<Pick<PaginationProps, 'pageSize' | 'pageIndex' | 'onPagingChange' | 'pageSizeOptions'>>
export const useOffset = (defaultSize?: number) => {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(defaultSize || 10)
  const input: OffsetConnectionInput = useMemo(() => ({
    offset: (pageIndex - 1) * pageSize,
    limit: pageSize,
  }), [pageIndex, pageSize])
  const props: Props = useMemo(() => ({
    pageSize,
    pageIndex,
    onPagingChange: ({ pageIndex, pageSize }) => {
      pageIndex && setPageIndex(pageIndex)
      pageSize && setPageSize(pageSize)
    },
    pageSizeOptions: [50, 100, 200]
  }), [pageIndex, pageSize])

  return [input, props, setPageIndex, setPageSize] as const
}

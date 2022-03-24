import React from 'react'
import { TableProps, Table } from '@tencent/tea-component'
import styled from '@emotion/styled'

export function hoverTable<T>() {
  const TypedTable: React.FC<TableProps<T> & { className?: string }> = ({ className, ...props }) => <div className={className}><Table {...props} /></div>
  const HoverTable = styled(TypedTable)`
    tr {
      .edit-btn {
        display: none;
      }
      &:hover {
        .edit-btn {
          display: inline-block;
        }
      }
    }
  `
  return HoverTable
}

import React from 'react'
import { Table as RadixTable } from '@radix-ui/themes'

// ============================================================================
// TABLE COLUMN COMPONENT (Declarative Placeholder)
// ============================================================================
export interface TableColumnProps<T> {
  name: string
  accessor?: keyof T | string
  customRender?: (row: T, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string | number
}

export interface TableColumnConfig<T> {
  name: string
  accessor?: keyof T | string
  customRender?: (row: T, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string | number
}

// This component is only used to define column properties declaratively
export function TableColumn<T>(props: TableColumnProps<T>) {
  void props
  return null
}
TableColumn.displayName = 'TableColumn'

// ============================================================================
// MAIN TABLE COMPONENT
// ============================================================================
interface TableProps<T> extends React.ComponentPropsWithoutRef<typeof RadixTable.Root> {
  data: T[]
  columns?: TableColumnConfig<T>[]
  children?: React.ReactNode
}

export function Table<T>({ data, columns: columnsProp, children, variant = 'surface', ...props }: TableProps<T>) {
  // If columns are passed as a prop, use them. Otherwise, extract them from children
  const columns: TableColumnConfig<T>[] = columnsProp || (React.Children.toArray(children).filter(
    (child) => 
      React.isValidElement(child) && 
      (child.type === TableColumn || (child.type as { displayName?: string }).displayName === 'TableColumn')
  ) as React.ReactElement<TableColumnProps<T>>[]).map(col => ({
    name: col.props.name,
    accessor: col.props.accessor,
    customRender: col.props.customRender,
    align: col.props.align,
    width: col.props.width
  }))

  return (
    <RadixTable.Root variant={variant} {...props}>
      <RadixTable.Header>
        <RadixTable.Row>
          {columns.map((col, idx) => (
            <RadixTable.ColumnHeaderCell 
              key={idx} 
              align={col.align}
              style={{ width: col.width }}
            >
              {col.name}
            </RadixTable.ColumnHeaderCell>
          ))}
        </RadixTable.Row>
      </RadixTable.Header>

      <RadixTable.Body>
        {data.length === 0 ? (
          <RadixTable.Row>
            <RadixTable.Cell 
              colSpan={columns.length} 
              align="center" 
              style={{ color: 'var(--gray-10)', padding: '32px' }}
            >
              No data available
            </RadixTable.Cell>
          </RadixTable.Row>
        ) : (
          data.map((row, rowIndex) => (
            <RadixTable.Row key={rowIndex}>
              {columns.map((col, colIndex) => {
                const { accessor, customRender, align } = col
                
                let cellContent: React.ReactNode = null
                if (customRender) {
                  cellContent = customRender(row, rowIndex)
                } else if (accessor) {
                  cellContent = (row as Record<string, unknown>)[accessor as string] as React.ReactNode
                }

                return (
                  <RadixTable.Cell key={colIndex} align={align}>
                    {cellContent}
                  </RadixTable.Cell>
                )
              })}
            </RadixTable.Row>
          ))
        )}
      </RadixTable.Body>
    </RadixTable.Root>
  )
}
Table.displayName = 'Table'

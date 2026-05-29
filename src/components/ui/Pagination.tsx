import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Flex, Select } from '@radix-ui/themes'

interface PaginationProps {
  current: number
  total: number
  pageSize?: number
  onChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  showTotal?: (total: number, range: [number, number]) => React.ReactNode
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
  showQuickJumper?: boolean
  disabled?: boolean
  style?: React.CSSProperties
  className?: string
}

export function Pagination({
  current,
  total,
  pageSize = 10,
  onChange,
  onPageSizeChange,
  showTotal,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  disabled = false,
  style,
  className = '',
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const [jumperValue, setJumperValue] = React.useState('')

  // Safe page change trigger
  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === current) return
    onChange(page)
  }

  // Handle jumper text submission
  const handleJumperKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(jumperValue, 10)
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        onChange(page)
        setJumperValue('')
      }
    }
  }

  // Generate page list with ellipses like Ant Design
  const generatePages = () => {
    const pages: (number | 'ellipsis-prev' | 'ellipsis-next')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      const leftBoundary = 3
      const rightBoundary = totalPages - 2

      if (current > leftBoundary + 1) {
        pages.push('ellipsis-prev')
      }

      const start = Math.max(2, current - 2)
      const end = Math.min(totalPages - 1, current + 2)

      // Adjust boundaries to make sure we show 5 middle elements
      let adjustedStart = start
      let adjustedEnd = end

      if (current <= leftBoundary + 1) {
        adjustedEnd = 5
      } else if (current >= rightBoundary - 1) {
        adjustedStart = totalPages - 4
      }

      for (let i = adjustedStart; i <= adjustedEnd; i++) {
        pages.push(i)
      }

      if (current < rightBoundary - 1) {
        pages.push('ellipsis-next')
      }

      pages.push(totalPages)
    }

    return pages
  }

  const pages = generatePages()
  
  // Calculate item range for showTotal
  const rangeStart = (current - 1) * pageSize + 1
  const rangeEnd = Math.min(current * pageSize, total)

  return (
    <Flex align="center" gap="3" style={style} className={className}>
      {showTotal && (
        <span className="rt-pagination-total-text">
          {showTotal(total, [rangeStart, rangeEnd])}
        </span>
      )}

      <ul className="rt-pagination">
        {/* Prev Button */}
        <li
          onClick={() => handlePageChange(current - 1)}
          className={`rt-pagination-item ${
            current === 1 || disabled ? 'rt-pagination-item-disabled' : ''
          }`}
          role="button"
          tabIndex={current === 1 || disabled ? -1 : 0}
        >
          <ChevronLeft size={16} />
        </li>

        {/* Page Buttons */}
        {pages.map((page, idx) => {
          if (page === 'ellipsis-prev' || page === 'ellipsis-next') {
            return (
              <li
                key={`ellipsis-${idx}`}
                className="rt-pagination-item rt-pagination-item-jump"
              >
                •••
              </li>
            )
          }

          return (
            <li
              key={page}
              onClick={() => handlePageChange(page)}
              className={`rt-pagination-item ${
                page === current ? 'rt-pagination-item-active' : ''
              } ${disabled ? 'rt-pagination-item-disabled' : ''}`}
              role="button"
              tabIndex={disabled ? -1 : 0}
            >
              {page}
            </li>
          )
        })}

        {/* Next Button */}
        <li
          onClick={() => handlePageChange(current + 1)}
          className={`rt-pagination-item ${
            current === totalPages || disabled ? 'rt-pagination-item-disabled' : ''
          }`}
          role="button"
          tabIndex={current === totalPages || disabled ? -1 : 0}
        >
          <ChevronRight size={16} />
        </li>
      </ul>

      {/* Page Size Changer Dropdown */}
      {showSizeChanger && onPageSizeChange && (
        <Select.Root
          value={pageSize.toString()}
          onValueChange={(val) => onPageSizeChange(parseInt(val, 10))}
          disabled={disabled}
        >
          <Select.Trigger style={{ height: '32px', minWidth: '105px' }} />
          <Select.Content>
            {pageSizeOptions.map((size) => (
              <Select.Item key={size} value={size.toString()}>
                {size} / page
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      )}

      {/* Quick Jumper Input */}
      {showQuickJumper && (
        <span className="rt-pagination-jumper-text">
          Go to
          <input
            type="text"
            className="rt-pagination-jumper-input"
            value={jumperValue}
            onChange={(e) => setJumperValue(e.target.value)}
            onKeyDown={handleJumperKeyDown}
            disabled={disabled}
          />
          Page
        </span>
      )}
    </Flex>
  )
}
Pagination.displayName = 'Pagination'

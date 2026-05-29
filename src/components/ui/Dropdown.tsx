import React from 'react'
import { DropdownMenu } from '@radix-ui/themes'

interface DropdownItem {
  label: string
  value: string
  icon?: React.ReactNode
  color?: React.ComponentProps<typeof DropdownMenu.Item>['color']
  shortcut?: string
}

interface CustomDropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  onItemSelect: (value: string) => void
  title?: string
}

export function CustomDropdown({ trigger, items, onItemSelect, title }: CustomDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" variant="soft">
        {title && (
          <>
            <DropdownMenu.Label>{title}</DropdownMenu.Label>
            <DropdownMenu.Separator />
          </>
        )}
        {items.map((item) => (
          <DropdownMenu.Item
            key={item.value}
            onClick={() => onItemSelect(item.value)}
            color={item.color}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            {item.icon && <span style={{ display: 'inline-flex' }}>{item.icon}</span>}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.shortcut && (
              <span style={{ marginLeft: 'auto', fontSize: '10.5px', opacity: 0.6, letterSpacing: '0.5px' }}>
                {item.shortcut}
              </span>
            )}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

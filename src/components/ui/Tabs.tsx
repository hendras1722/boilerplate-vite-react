import React from 'react'
import { Tabs as RadixTabs } from '@radix-ui/themes'

interface TabItem {
  label: string
  value: string
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  items: TabItem[]
  size?: React.ComponentProps<typeof RadixTabs.List>['size']
  justify?: 'start' | 'center' | 'end'
}

export function Tabs({ defaultValue, value, onValueChange, items, size = '2', justify = 'start' }: TabsProps) {
  const activeDefaultValue = defaultValue || items[0]?.value

  return (
    <RadixTabs.Root defaultValue={activeDefaultValue} value={value} onValueChange={onValueChange}>
      <RadixTabs.List style={{ justifyContent: justify }} size={size}>
        {items.map((item) => (
          <RadixTabs.Trigger key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      <div style={{ marginTop: '12px' }}>
        {items.map((item) => (
          <RadixTabs.Content key={item.value} value={item.value}>
            {item.content}
          </RadixTabs.Content>
        ))}
      </div>
    </RadixTabs.Root>
  )
}
Tabs.displayName = 'Tabs'

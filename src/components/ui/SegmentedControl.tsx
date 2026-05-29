import React from 'react'
import { SegmentedControl as RadixSegmentedControl } from '@radix-ui/themes'

interface ControlOption {
  label: React.ReactNode
  value: string
}

interface SegmentedControlProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: ControlOption[]
  size?: React.ComponentProps<typeof RadixSegmentedControl.Root>['size']
  radius?: React.ComponentProps<typeof RadixSegmentedControl.Root>['radius']
}

export function SegmentedControl({ value, defaultValue, onValueChange, options, size = '2', radius }: SegmentedControlProps) {
  return (
    <RadixSegmentedControl.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      size={size}
      radius={radius}
    >
      {options.map((option) => (
        <RadixSegmentedControl.Item key={option.value} value={option.value}>
          {option.label}
        </RadixSegmentedControl.Item>
      ))}
    </RadixSegmentedControl.Root>
  )
}
SegmentedControl.displayName = 'SegmentedControl'

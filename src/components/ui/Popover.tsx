import React from 'react'
import { Popover as RadixPopover } from '@radix-ui/themes'

interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  maxWidth?: string | number
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function Popover({ trigger, children, maxWidth = 360, align = 'center', side = 'bottom' }: PopoverProps) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger>
        {trigger}
      </RadixPopover.Trigger>
      <RadixPopover.Content style={{ maxWidth }} align={align} side={side}>
        {children}
      </RadixPopover.Content>
    </RadixPopover.Root>
  )
}
Popover.displayName = 'Popover'

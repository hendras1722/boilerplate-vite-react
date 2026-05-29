import React from 'react'
import { HoverCard as RadixHoverCard } from '@radix-ui/themes'

interface HoverCardProps {
  trigger: React.ReactNode
  children: React.ReactNode
  maxWidth?: string | number
  openDelay?: number
  closeDelay?: number
}

export function HoverCard({ trigger, children, maxWidth = 300, openDelay = 300, closeDelay = 150 }: HoverCardProps) {
  return (
    <RadixHoverCard.Root openDelay={openDelay} closeDelay={closeDelay}>
      <RadixHoverCard.Trigger>
        {trigger}
      </RadixHoverCard.Trigger>
      <RadixHoverCard.Content style={{ maxWidth }}>
        {children}
      </RadixHoverCard.Content>
    </RadixHoverCard.Root>
  )
}
HoverCard.displayName = 'HoverCard'

import React from 'react'
import { Tooltip as RadixTooltip } from '@radix-ui/themes'

interface TooltipProps extends React.ComponentPropsWithoutRef<typeof RadixTooltip> {
  children: React.ReactElement
}

export function Tooltip({ children, content, side = 'top', align = 'center', ...props }: TooltipProps) {
  if (!content) return children

  return (
    <RadixTooltip
      content={content}
      side={side}
      align={align}
      {...props}
    >
      {children}
    </RadixTooltip>
  )
}
Tooltip.displayName = 'Tooltip'

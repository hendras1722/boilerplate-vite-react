import React from 'react'
import { Badge as RadixBadge } from '@radix-ui/themes'

type BadgeProps = React.ComponentPropsWithoutRef<typeof RadixBadge>

export function Badge({ children, size = '1', radius = 'medium', variant = 'soft', ...props }: BadgeProps) {
  return (
    <RadixBadge
      size={size}
      radius={radius}
      variant={variant}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </RadixBadge>
  )
}
Badge.displayName = 'Badge'

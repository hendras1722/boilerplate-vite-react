import React from 'react'
import { Card } from '@radix-ui/themes'

interface GlassCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  hoverLift?: boolean
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, hoverLift = true, style, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
          transform: hoverLift ? 'translateY(0)' : undefined,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          cursor: hoverLift ? 'pointer' : undefined,
          ...style,
        }}
        className={`glass-card-hover ${props.className || ''}`}
        {...props}
      >
        {children}
      </Card>
    )
  }
)
GlassCard.displayName = 'GlassCard'

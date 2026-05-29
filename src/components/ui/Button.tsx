import React from 'react'
import { Button as RadixButton, Spinner } from '@radix-ui/themes'

interface ButtonProps extends React.ComponentPropsWithoutRef<typeof RadixButton> {
  loading?: boolean
  icon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, icon, disabled, ...props }, ref) => {
    return (
      <RadixButton
        ref={ref}
        disabled={disabled || loading}
        style={{
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          ...props.style
        }}
        {...props}
      >
        {loading && <Spinner size="1" />}
        {!loading && icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
        {children}
      </RadixButton>
    )
  }
)
Button.displayName = 'Button'

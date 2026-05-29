import React from 'react'
import { Switch as RadixSwitch, Flex, Text } from '@radix-ui/themes'

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof RadixSwitch> {
  label?: string
  error?: string
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, error, style, id, ...props }, ref) => {
    const defaultId = React.useId()
    const switchId = id || defaultId

    return (
      <Flex direction="column" gap="1">
        <Flex align="center" gap="2">
          <RadixSwitch
            ref={ref}
            id={switchId}
            style={{
              cursor: props.disabled ? 'not-allowed' : 'pointer',
              ...style,
            }}
            {...props}
          />
          {label && (
            <Text 
              as="label" 
              htmlFor={switchId} 
              size="2" 
              style={{
                cursor: props.disabled ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                opacity: props.disabled ? 0.6 : 0.9,
              }}
            >
              {label}
            </Text>
          )}
        </Flex>
        {error && (
          <Text size="1" color="red" style={{ marginTop: '2px' }}>
            {error}
          </Text>
        )}
      </Flex>
    )
  }
)
Switch.displayName = 'Switch'

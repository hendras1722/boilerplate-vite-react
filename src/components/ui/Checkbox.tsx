import React from 'react'
import { Checkbox as RadixCheckbox, Flex, Text } from '@radix-ui/themes'

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof RadixCheckbox> {
  label?: string
  error?: string
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, error, style, id, ...props }, ref) => {
    const defaultId = React.useId()
    const checkboxId = id || defaultId

    return (
      <Flex direction="column" gap="1">
        <Flex align="center" gap="2">
          <RadixCheckbox
            ref={ref}
            id={checkboxId}
            style={{
              cursor: props.disabled ? 'not-allowed' : 'pointer',
              ...style,
            }}
            {...props}
          />
          {label && (
            <Text 
              as="label" 
              htmlFor={checkboxId} 
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
Checkbox.displayName = 'Checkbox'

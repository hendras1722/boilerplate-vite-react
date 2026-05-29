import React from 'react'
import { TextField, Text, Flex } from '@radix-ui/themes'

interface InputFieldProps extends React.ComponentPropsWithoutRef<typeof TextField.Root> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, icon, ...props }, ref) => {
    return (
      <Flex direction="column" gap="1" style={{ width: '100%' }}>
        {label && (
          <Text as="div" size="2" weight="bold" color={error ? 'red' : undefined} style={{ opacity: 0.9 }}>
            {label}
          </Text>
        )}
        <TextField.Root 
          ref={ref} 
          color={error ? 'red' : undefined} 
          {...props}
        >
          {icon && <TextField.Slot>{icon}</TextField.Slot>}
        </TextField.Root>
        {error && (
          <Text size="1" color="red" style={{ marginTop: '2px' }}>
            {error}
          </Text>
        )}
        {!error && helperText && (
          <Text size="1" color="gray" style={{ marginTop: '2px', opacity: 0.8 }}>
            {helperText}
          </Text>
        )}
      </Flex>
    )
  }
)
InputField.displayName = 'InputField'

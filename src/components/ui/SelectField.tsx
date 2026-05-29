import React from 'react'
import { Select, Text, Flex } from '@radix-ui/themes'

interface SelectOption {
  label: string
  value: string
}

interface SelectFieldProps {
  label?: string
  error?: string
  helperText?: string
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  width?: string | number
}

export const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  ({ label, error, helperText, value, onValueChange, options, placeholder = 'Select an option...', width = '100%' }, ref) => {
    return (
      <Flex direction="column" gap="1" style={{ width }}>
        {label && (
          <Text as="div" size="2" weight="bold" color={error ? 'red' : undefined} style={{ opacity: 0.9 }}>
            {label}
          </Text>
        )}
        <Select.Root value={value} onValueChange={onValueChange}>
          <Select.Trigger ref={ref} placeholder={placeholder} style={{ width: '100%' }} color={error ? 'red' : undefined} />
          <Select.Content>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
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
SelectField.displayName = 'SelectField'

import React from 'react'
import { RadioGroup as RadixRadioGroup, Flex, Text } from '@radix-ui/themes'

interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

interface RadioGroupProps {
  label?: string
  error?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  options: RadioOption[]
  name?: string
  direction?: 'row' | 'column'
  gap?: React.ComponentProps<typeof Flex>['gap']
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ label, error, value, defaultValue, onValueChange, options, name, direction = 'column', gap = '2' }, ref) => {
    return (
      <Flex direction="column" gap="1" ref={ref}>
        {label && (
          <Text as="div" size="2" weight="bold" color={error ? 'red' : undefined} style={{ opacity: 0.9, marginBottom: '2px' }}>
            {label}
          </Text>
        )}
        <RadixRadioGroup.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          name={name}
        >
          <Flex direction={direction} gap={gap}>
            {options.map((option) => {
              const itemId = `${name || 'radio'}-${option.value}`
              return (
                <Flex key={option.value} align="center" gap="2">
                  <RadixRadioGroup.Item
                    value={option.value}
                    id={itemId}
                    disabled={option.disabled}
                    style={{ cursor: option.disabled ? 'not-allowed' : 'pointer' }}
                  />
                  <Text
                    as="label"
                    htmlFor={itemId}
                    size="2"
                    style={{
                      cursor: option.disabled ? 'not-allowed' : 'pointer',
                      userSelect: 'none',
                      opacity: option.disabled ? 0.6 : 0.9,
                    }}
                  >
                    {option.label}
                  </Text>
                </Flex>
              )
            })}
          </Flex>
        </RadixRadioGroup.Root>
        {error && (
          <Text size="1" color="red" style={{ marginTop: '2px' }}>
            {error}
          </Text>
        )}
      </Flex>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

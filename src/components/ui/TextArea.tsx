import React from 'react'
import { TextArea as RadixTextArea, Text, Flex } from '@radix-ui/themes'

interface TextAreaProps extends React.ComponentPropsWithoutRef<typeof RadixTextArea> {
  label?: string
  error?: string
  helperText?: string
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, ...props }, ref) => {
    return (
      <Flex direction="column" gap="1" style={{ width: '100%' }}>
        {label && (
          <Text as="div" size="2" weight="bold" color={error ? 'red' : undefined} style={{ opacity: 0.9 }}>
            {label}
          </Text>
        )}
        <RadixTextArea 
          ref={ref} 
          color={error ? 'red' : undefined}
          style={{ minHeight: '80px', ...props.style }}
          {...props}
        />
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
TextArea.displayName = 'TextArea'

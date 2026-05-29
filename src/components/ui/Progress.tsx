import React from 'react'
import { Progress as RadixProgress, Flex, Text } from '@radix-ui/themes'

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof RadixProgress> {
  label?: string
  showValue?: boolean
}

export function Progress({ label, showValue = false, value = 0, size = '2', variant = 'surface', ...props }: ProgressProps) {
  return (
    <Flex direction="column" gap="1" style={{ width: '100%' }}>
      {(label || showValue) && (
        <Flex justify="between" align="center" style={{ marginBottom: '2px' }}>
          {label && (
            <Text size="2" weight="medium" style={{ opacity: 0.9 }}>
              {label}
            </Text>
          )}
          {showValue && value !== undefined && value !== null && (
            <Text size="2" color="gray" weight="bold">
              {Math.round(value)}%
            </Text>
          )}
        </Flex>
      )}
      <RadixProgress
        value={value}
        size={size}
        variant={variant}
        {...props}
      />
    </Flex>
  )
}
Progress.displayName = 'Progress'

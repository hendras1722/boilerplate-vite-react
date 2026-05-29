import React from 'react'
import { Slider as RadixSlider, Flex, Text } from '@radix-ui/themes'

interface SliderProps extends React.ComponentPropsWithoutRef<typeof RadixSlider> {
  label?: string
  showValue?: boolean
  unit?: string
}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  ({ label, showValue = false, unit = '', value, defaultValue, ...props }, ref) => {
    const displayValue = value !== undefined ? value[0] : (defaultValue !== undefined ? defaultValue[0] : 0)

    return (
      <Flex direction="column" gap="1" style={{ width: '100%' }}>
        {(label || showValue) && (
          <Flex justify="between" align="center" style={{ marginBottom: '2px' }}>
            {label && (
              <Text size="2" weight="medium" style={{ opacity: 0.9 }}>
                {label}
              </Text>
            )}
            {showValue && (
              <Text size="2" color="gray" weight="bold">
                {displayValue}
                {unit}
              </Text>
            )}
          </Flex>
        )}
        <RadixSlider
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          style={{ cursor: props.disabled ? 'not-allowed' : 'pointer' }}
          {...props}
        />
      </Flex>
    )
  }
)
Slider.displayName = 'Slider'

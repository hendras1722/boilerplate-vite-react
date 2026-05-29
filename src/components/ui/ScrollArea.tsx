import React from 'react'
import { ScrollArea as RadixScrollArea } from '@radix-ui/themes'

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof RadixScrollArea> {
  maxHeight?: string | number
  minHeight?: string | number
}

export function ScrollArea({ children, maxHeight, minHeight, style, ...props }: ScrollAreaProps) {
  return (
    <RadixScrollArea
      style={{
        maxHeight,
        minHeight,
        ...style,
      }}
      {...props}
    >
      {children}
    </RadixScrollArea>
  )
}
ScrollArea.displayName = 'ScrollArea'

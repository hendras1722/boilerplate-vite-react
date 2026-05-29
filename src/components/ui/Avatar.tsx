import React from 'react'
import { Avatar as RadixAvatar } from '@radix-ui/themes'

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar> {
  name?: string
}

export function Avatar({ name, fallback, size = '3', radius = 'full', src, ...props }: AvatarProps) {
  const getInitials = (fullName?: string) => {
    if (!fullName) return '?'
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <RadixAvatar
      src={src}
      size={size}
      radius={radius}
      fallback={fallback || getInitials(name)}
      {...props}
    />
  )
}
Avatar.displayName = 'Avatar'

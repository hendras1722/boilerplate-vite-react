import React from 'react'
import { Dialog, Flex, IconButton } from '@radix-ui/themes'
import { X } from 'lucide-react'

interface DialogModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string | number
}

export function DialogModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  maxWidth = 450,
}: DialogModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}
      <Dialog.Content style={{ maxWidth, position: 'relative' }}>
        <Dialog.Title style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          {title}
        </Dialog.Title>
        {description && (
          <Dialog.Description size="2" style={{ marginBottom: '16px', marginTop: '4px', opacity: 0.8 }}>
            {description}
          </Dialog.Description>
        )}
        
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          {children}
        </div>
        
        {footer ? (
          <Flex gap="3" mt="4" justify="end">
            {footer}
          </Flex>
        ) : (
          <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
            <Dialog.Close>
              <IconButton variant="ghost" color="gray" size="1" style={{ borderRadius: '50%', cursor: 'pointer' }}>
                <X size={14} />
              </IconButton>
            </Dialog.Close>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}

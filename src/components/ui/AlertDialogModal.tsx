import React from 'react'
import { AlertDialog, Flex } from '@radix-ui/themes'
import { Button } from './Button'

interface AlertDialogModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  actionLabel?: string
  cancelLabel?: string
  onAction: () => void
  actionColor?: React.ComponentProps<typeof Button>['color']
  actionVariant?: React.ComponentProps<typeof Button>['variant']
  loading?: boolean
}

export function AlertDialogModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  actionLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onAction,
  actionColor = 'red',
  actionVariant = 'solid',
  loading = false,
}: AlertDialogModalProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialog.Trigger>{trigger}</AlertDialog.Trigger>}
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2" style={{ opacity: 0.8, marginBottom: '16px' }}>
          {description}
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" type="button" disabled={loading}>
              {cancelLabel}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button 
              variant={actionVariant} 
              color={actionColor} 
              onClick={(e) => {
                e.preventDefault()
                onAction()
              }}
              loading={loading}
            >
              {actionLabel}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

import { Button, Dialog, Text } from '@chakra-ui/react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center" size="sm">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="gray.900" borderColor="gray.700" borderWidth={1}>
          <Dialog.Header>
            <Dialog.Title color="white">{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text color="gray.300">{message}</Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="ghost" onClick={onClose} color="gray.400" disabled={isLoading}>
              Cancel
            </Button>
            <Button
              colorPalette="red"
              onClick={onConfirm}
              loading={isLoading}
            >
              {confirmLabel}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

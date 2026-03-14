import { HStack } from '@chakra-ui/react'
import { ActionBtn } from '@/components/shared/ActionBtn'

interface PresetCardActionsProps {
  onEdit: () => void
  onLoad: () => void
}

export function PresetCardActions({ onEdit, onLoad }: PresetCardActionsProps) {
  return (
    <HStack gap={3}>
      <ActionBtn label="Edit" onClick={onEdit} />
      <ActionBtn label="Load" onClick={onLoad} />
    </HStack>
  )
}

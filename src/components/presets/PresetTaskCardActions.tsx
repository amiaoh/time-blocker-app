import { ActionBtn } from '@/components/shared/ActionBtn'
import { HStack } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'

interface PresetTaskCardActionsProps {
  isSelected: boolean
  onDelete: () => void
  onDuplicate: () => void
  onToggleSelect: () => void
}

export function PresetTaskCardActions({ isSelected, onDelete, onDuplicate, onToggleSelect }: PresetTaskCardActionsProps) {
  return (
    <HStack gap={3}>
      <ActionBtn label="Delete" ariaLabel="Delete" onClick={onDelete} color="whiteAlpha.700" hoverColor="white"><Trash2 size={14} /></ActionBtn>
      <ActionBtn label="Duplicate" onClick={onDuplicate} color="whiteAlpha.700" hoverColor="white" />
      <ActionBtn
        label={isSelected ? 'Selected ✓' : 'Select'}
        onClick={onToggleSelect}
        color={isSelected ? 'white' : 'whiteAlpha.500'}
        hoverColor="white"
      />
    </HStack>
  )
}

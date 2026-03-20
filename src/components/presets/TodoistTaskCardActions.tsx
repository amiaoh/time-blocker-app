import { ActionBtn } from '@/components/shared/ActionBtn'
import { HStack } from '@chakra-ui/react'
import { Copy, Trash2 } from 'lucide-react'

interface TodoistTaskCardActionsProps {
  isSelected: boolean
  onDelete?: () => void
  onToggleSelect: () => void
  onCopyToPreset?: () => void
  isCopiedToAnyPreset?: boolean
}

export function TodoistTaskCardActions({
  isSelected, onDelete, onToggleSelect, onCopyToPreset, isCopiedToAnyPreset,
}: TodoistTaskCardActionsProps) {
  return (
    <HStack gap={1}>
      {onDelete && (
        <ActionBtn label="Delete" ariaLabel="Delete" onClick={onDelete} color="whiteAlpha.700" hoverColor="white">
          <Trash2 size={14} />
        </ActionBtn>
      )}
      {onCopyToPreset && (
        <ActionBtn label="Copy to preset" ariaLabel="Copy to preset" onClick={onCopyToPreset}
          color={isCopiedToAnyPreset ? '#A78BFA' : 'whiteAlpha.700'} hoverColor="white">
          <Copy size={12} />
        </ActionBtn>
      )}
      <ActionBtn
        label={isSelected ? '✓' : 'Select'}
        onClick={onToggleSelect}
        color={isSelected ? 'white' : 'whiteAlpha.500'}
        hoverColor="white"
      />
    </HStack>
  )
}

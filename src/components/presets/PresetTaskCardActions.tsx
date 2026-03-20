import { ActionBtn } from '@/components/shared/ActionBtn'
import { HStack } from '@chakra-ui/react'
import { Copy, Files, Trash2 } from 'lucide-react'

interface PresetTaskCardActionsProps {
  isSelected: boolean
  onDelete: () => void
  onDuplicate: () => void
  onToggleSelect: () => void
  onCopyToPreset: () => void
  isCopiedToAnyPreset: boolean
}

export function PresetTaskCardActions({
  isSelected, onDelete, onDuplicate, onToggleSelect, onCopyToPreset, isCopiedToAnyPreset,
}: PresetTaskCardActionsProps) {
  return (
    <HStack gap={1}>
      <ActionBtn label="Delete" ariaLabel="Delete" onClick={onDelete} color="whiteAlpha.700" hoverColor="white"><Trash2 size={14} /></ActionBtn>
      <ActionBtn label="Copy to preset" ariaLabel="Copy to preset" onClick={onCopyToPreset}
        color={isCopiedToAnyPreset ? '#A78BFA' : 'whiteAlpha.700'} hoverColor="white">
        <Copy size={12} />
      </ActionBtn>
      <ActionBtn label="Duplicate" ariaLabel="Duplicate" onClick={onDuplicate} color="whiteAlpha.700" hoverColor="white"><Files size={14} /></ActionBtn>
      <ActionBtn
        label={isSelected ? '✓' : 'Select'}
        onClick={onToggleSelect}
        color={isSelected ? 'white' : 'whiteAlpha.500'}
        hoverColor="white"
      />
    </HStack>
  )
}

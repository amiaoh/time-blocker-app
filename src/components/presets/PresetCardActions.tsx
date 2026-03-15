import { HStack } from '@chakra-ui/react'
import { Pencil, Plus } from 'lucide-react'
import { ActionBtn } from '@/components/shared/ActionBtn'

interface PresetCardActionsProps {
  onEdit: () => void
  onLoad: () => void
}

export function PresetCardActions({ onEdit, onLoad }: PresetCardActionsProps) {
  return (
    <HStack gap={3}>
      <ActionBtn label="Edit" onClick={onEdit}><Pencil size={14} /></ActionBtn>
      <ActionBtn label="Load" onClick={onLoad}><Plus size={14} /></ActionBtn>
    </HStack>
  )
}

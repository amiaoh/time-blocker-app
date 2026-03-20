import type { PresetTask } from '@/types'
import { EmojiPickerPopover } from '@/components/tasks/EmojiPickerPopover'
import { InlineEdit } from '@/components/shared/InlineEdit'
import { BaseTaskCard } from '@/components/shared/BaseTaskCard'
import { PresetTaskCardActions } from './PresetTaskCardActions'
import { formatSeconds } from '@/utils/formatTime'

interface PresetTaskCardProps {
  task: PresetTask
  isSelected: boolean
  onDelete: () => void
  onDuplicate: () => void
  onToggleSelect: () => void
  onChangeIcon: (icon: string) => void
  onCopyToPreset: () => void
  isCopiedToAnyPreset: boolean
  onEditTitle: (title: string) => void
  onEditDuration: (durationMin: number) => void
}

export function PresetTaskCard({
  task, isSelected, onDelete, onDuplicate, onToggleSelect,
  onChangeIcon, onCopyToPreset, isCopiedToAnyPreset, onEditTitle, onEditDuration,
}: PresetTaskCardProps) {
  return (
    <BaseTaskCard
      id={task.id}
      bg={task.color}
      opacity={isSelected ? 1 : 0.45}
      icon={<EmojiPickerPopover currentIcon={task.icon} onSelect={onChangeIcon} />}
      title={
        <InlineEdit displayValue={task.title} editValue={task.title} onSave={onEditTitle}
          fontWeight="semibold" fontSize="md" color="white" lineClamp={2} />
      }
      duration={
        <InlineEdit displayValue={formatSeconds(task.durationMin * 60)}
          editValue={String(task.durationMin)} onSave={(v) => onEditDuration(Number(v))}
          type="number" min={1} max={480} fontSize="xs" fontWeight="semibold"
          color="white" fontVariantNumeric="tabular-nums" inputWidth="3.5rem" />
      }
      actions={
        <PresetTaskCardActions isSelected={isSelected} onDelete={onDelete}
          onDuplicate={onDuplicate} onToggleSelect={onToggleSelect}
          onCopyToPreset={onCopyToPreset} isCopiedToAnyPreset={isCopiedToAnyPreset} />
      }
    />
  )
}

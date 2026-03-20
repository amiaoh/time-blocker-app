import type { MappedTodoistTask } from '@/utils/todoistApi'
import { EmojiPickerPopover } from '@/components/tasks/EmojiPickerPopover'
import { InlineEdit } from '@/components/shared/InlineEdit'
import { BaseTaskCard } from '@/components/shared/BaseTaskCard'
import { TodoistTaskCardActions } from './TodoistTaskCardActions'
import { formatSeconds } from '@/utils/formatTime'

interface TodoistTaskCardProps {
  task: MappedTodoistTask
  isSelected: boolean
  onToggleSelect: () => void
  onDelete?: () => void
  onChangeIcon?: (icon: string) => void
  onEditTitle?: (title: string) => void
  onEditDuration?: (durationMin: number) => void
  onCopyToPreset?: () => void
  isCopiedToAnyPreset?: boolean
}

const noop = () => {}

export function TodoistTaskCard({
  task, isSelected, onToggleSelect, onDelete, onChangeIcon,
  onEditTitle, onEditDuration, onCopyToPreset, isCopiedToAnyPreset,
}: TodoistTaskCardProps) {
  return (
    <BaseTaskCard
      id={task.id}
      bg={task.color}
      opacity={isSelected ? 1 : 0.45}
      icon={<EmojiPickerPopover currentIcon={task.icon} onSelect={onChangeIcon ?? noop} disabled={!onChangeIcon} />}
      title={
        <InlineEdit displayValue={task.title} editValue={task.title} onSave={onEditTitle ?? noop}
          fontWeight="semibold" fontSize="md" color="white" lineClamp={2} />
      }
      duration={
        <InlineEdit displayValue={formatSeconds(task.durationMin * 60)}
          editValue={String(task.durationMin)} onSave={(v) => (onEditDuration ?? noop)(Number(v))}
          type="number" min={1} max={480} fontSize="xs" fontWeight="semibold"
          color="white" fontVariantNumeric="tabular-nums" inputWidth="3.5rem" />
      }
      actions={
        <TodoistTaskCardActions isSelected={isSelected} onDelete={onDelete}
          onToggleSelect={onToggleSelect} onCopyToPreset={onCopyToPreset}
          isCopiedToAnyPreset={isCopiedToAnyPreset} />
      }
    />
  )
}

import {
  Box,
  Button,
  Dialog,
  Field,
  Fieldset,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useTaskForm } from './useTaskForm'
import { ColorPicker } from './ColorPicker'
import type { Task, TaskColor, TaskFormValues } from '@/types'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: TaskFormValues) => void
  editingTask?: Task
  isLoading?: boolean
  maxDurationMin?: number
}

export function TaskForm({ isOpen, onClose, onSubmit, editingTask, isLoading, maxDurationMin = 120 }: TaskFormProps) {
  const { values, setField, validate, reset, errorFor } = useTaskForm(editingTask, maxDurationMin)

  function handleSubmit() {
    if (!validate()) return
    onSubmit(values)
    reset()
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()} placement="top">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="gray.900" borderColor="gray.700" borderWidth={1} maxW="400px" mt={4}>
          <Dialog.Header>
            <Dialog.Title color="white">{editingTask ? 'Edit task' : 'Add task'}</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Stack gap={5}>
              <Field.Root invalid={!!errorFor('title')}>
                <Field.Label color="gray.300">Task name</Field.Label>
                <Input
                  value={values.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="What do you need to do?"
                  bg="gray.800"
                  borderColor="gray.600"
                  color="white"
                  _placeholder={{ color: 'gray.500' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  autoFocus
                />
                {errorFor('title') && (
                  <Field.ErrorText>{errorFor('title')}</Field.ErrorText>
                )}
              </Field.Root>

              <Field.Root invalid={!!errorFor('durationMin')}>
                <Field.Label color="gray.300">Duration (minutes)</Field.Label>
                <Input
                  type="number"
                  value={values.durationMin || ''}
                  onChange={(e) => setField('durationMin', parseInt(e.target.value, 10) || 0)}
                  min={1}
                  max={maxDurationMin}
                  bg="gray.800"
                  borderColor="gray.600"
                  color="white"
                />
                {errorFor('durationMin') && (
                  <Field.ErrorText>{errorFor('durationMin')}</Field.ErrorText>
                )}
              </Field.Root>

              <Fieldset.Root invalid={!!errorFor('color')}>
                <Fieldset.Legend color="gray.300">Colour</Fieldset.Legend>
                <Box mt={2}>
                  <ColorPicker
                    value={values.color}
                    onChange={(c: TaskColor) => setField('color', c)}
                  />
                </Box>
                {errorFor('color') && (
                  <Text color="red.400" fontSize="sm">{errorFor('color')}</Text>
                )}
              </Fieldset.Root>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer>
            <Button variant="ghost" onClick={handleClose} color="gray.400" disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              bg="brand.600"
              color="white"
              _hover={{ bg: 'brand.500' }}
            >
              {editingTask ? 'Save changes' : 'Add task'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

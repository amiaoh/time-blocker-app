import { Box, Button, Drawer, Field, Fieldset, Input, Stack, Text } from '@chakra-ui/react'
import { useTaskForm } from './useTaskForm'
import { ColorPicker } from './ColorPicker'
import type { Task, TaskColor, TaskFormValues } from '@/types'

interface TaskEditSheetProps {
  task: Task | undefined
  isLoading?: boolean
  maxDurationMin?: number
  onClose: () => void
  onSubmit: (values: TaskFormValues) => void
}

export function TaskEditSheet({ task, isLoading, maxDurationMin = 120, onClose, onSubmit }: TaskEditSheetProps) {
  const { values, setField, validate, reset, errorFor } = useTaskForm(task, maxDurationMin)

  function handleSubmit() {
    const parsed = validate()
    if (!parsed) return
    onSubmit(parsed)
    reset()
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Drawer.Root open={!!task} onOpenChange={(e) => !e.open && handleClose()} placement="bottom">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content bg="gray.900" borderTopRadius="2xl" borderColor="gray.700" borderTopWidth={1}>
          <Drawer.Header borderBottomWidth={1} borderColor="gray.700">
            <Drawer.Title color="white">Edit task</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body py={5}>
            <Stack gap={5}>
              <Field.Root invalid={!!errorFor('title')}>
                <Field.Label color="gray.300">Task name</Field.Label>
                <Input
                  value={values.title}
                  onChange={(e) => setField('title', e.target.value)}
                  bg="gray.800"
                  borderColor="gray.600"
                  color="white"
                  _placeholder={{ color: 'gray.500' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  autoFocus
                />
                {errorFor('title') && <Field.ErrorText>{errorFor('title')}</Field.ErrorText>}
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
                {errorFor('durationMin') && <Field.ErrorText>{errorFor('durationMin')}</Field.ErrorText>}
              </Field.Root>

              <Fieldset.Root invalid={!!errorFor('color')}>
                <Fieldset.Legend color="gray.300">Colour</Fieldset.Legend>
                <Box mt={2}>
                  <ColorPicker value={values.color} onChange={(c: TaskColor) => setField('color', c)} />
                </Box>
                {errorFor('color') && <Text color="red.400" fontSize="sm">{errorFor('color')}</Text>}
              </Fieldset.Root>
            </Stack>
          </Drawer.Body>

          <Drawer.Footer borderTopWidth={1} borderColor="gray.700">
            <Button variant="ghost" onClick={handleClose} color="gray.400" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={isLoading} bg="brand.600" color="white" _hover={{ bg: 'brand.500' }}>
              Save changes
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}

import { Button, Dialog, Field, HStack, Input, Stack, Switch, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { AppSettings } from '@/hooks/useSettings'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  settings: AppSettings
  onSave: (updates: Partial<AppSettings>) => void
}

export function SettingsDialog({ isOpen, onClose, settings, onSave }: SettingsDialogProps) {
  const [maxDuration, setMaxDuration] = useState(settings.maxTaskDurationMin)
  const [showPieTimer, setShowPieTimer] = useState(settings.showPieTimer)
  const [use24HourTime, setUse24HourTime] = useState(settings.use24HourTime)

  function handleSave() {
    const clamped = Math.min(480, Math.max(5, maxDuration || 120))
    onSave({ maxTaskDurationMin: clamped, showPieTimer, use24HourTime })
    onClose()
  }

  function handleOpenChange(open: boolean) {
    if (open) {
      setMaxDuration(settings.maxTaskDurationMin)
      setShowPieTimer(settings.showPieTimer)
      setUse24HourTime(settings.use24HourTime)
    } else {
      onClose()
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => handleOpenChange(e.open)} placement="center" size="sm">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="gray.900" borderColor="gray.700" borderWidth={1}>
          <Dialog.Header>
            <Dialog.Title color="white">Settings</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={5}>
              <Field.Root>
                <Field.Label color="gray.300">Max task duration (minutes)</Field.Label>
                <Input
                  type="number"
                  value={maxDuration || ''}
                  onChange={(e) => setMaxDuration(parseInt(e.target.value, 10) || 0)}
                  min={5}
                  max={480}
                  bg="gray.800"
                  borderColor="gray.600"
                  color="white"
                  aria-label="Maximum task duration in minutes"
                />
                <Field.HelperText color="gray.500">
                  Limits how long a single task can be (5–480 min)
                </Field.HelperText>
              </Field.Root>

              <HStack justify="space-between" align="center">
                <Text color="gray.300" fontSize="sm">Show pie timer</Text>
                <Switch.Root
                  checked={showPieTimer}
                  onCheckedChange={(e) => setShowPieTimer(e.checked)}
                  aria-label="Toggle pie timer visibility"
                  colorPalette="teal"
                >
                  <Switch.HiddenInput />
                  <Switch.Control />
                </Switch.Root>
              </HStack>

              <HStack justify="space-between" align="center">
                <Text color="gray.300" fontSize="sm">24-hour time</Text>
                <Switch.Root
                  checked={use24HourTime}
                  onCheckedChange={(e) => setUse24HourTime(e.checked)}
                  aria-label="Toggle 24-hour time format"
                  colorPalette="teal"
                >
                  <Switch.HiddenInput />
                  <Switch.Control />
                </Switch.Root>
              </HStack>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="ghost" onClick={onClose} color="gray.400">Cancel</Button>
            <Button onClick={handleSave} bg="brand.600" color="white" _hover={{ bg: 'brand.500' }}>
              Save
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

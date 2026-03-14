import { Button, Dialog, Field, HStack, Input, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { EmojiPickerPopover } from '@/components/tasks/EmojiPickerPopover'
import type { PresetList } from '@/types'

interface PresetFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: { name: string; icon: string }) => void
  editingPreset?: PresetList
  isLoading?: boolean
}

function PresetFormInner({ isOpen, onClose, onSubmit, editingPreset, isLoading }: PresetFormProps) {
  const [name, setName] = useState(editingPreset?.name ?? '')
  const [icon, setIcon] = useState(editingPreset?.icon ?? '📋')
  const [nameError, setNameError] = useState('')

  function handleSubmit() {
    if (!name.trim()) {
      setNameError('Name is required')
      return
    }
    onSubmit({ name: name.trim(), icon })
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="top">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="gray.900" borderColor="gray.700" borderWidth={1} maxW="400px" mt={4}>
          <Dialog.Header>
            <Dialog.Title color="white">{editingPreset ? 'Edit preset' : 'New preset'}</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Stack gap={4}>
              <HStack gap={3} align="center">
                <EmojiPickerPopover currentIcon={icon} onSelect={setIcon} />
                <Text color="gray.400" fontSize="sm">Tap to change icon</Text>
              </HStack>

              <Field.Root invalid={!!nameError}>
                <Field.Label color="gray.300">Preset name</Field.Label>
                <Input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError('') }}
                  placeholder="e.g. Morning Routine"
                  bg="gray.800"
                  borderColor="gray.600"
                  color="white"
                  _placeholder={{ color: 'gray.500' }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  autoFocus
                />
                {nameError && <Field.ErrorText>{nameError}</Field.ErrorText>}
              </Field.Root>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer>
            <Button variant="ghost" onClick={onClose} color="gray.400" disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              bg="brand.600"
              color="white"
              _hover={{ bg: 'brand.500' }}
            >
              {editingPreset ? 'Save' : 'Create'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

export function PresetForm(props: PresetFormProps) {
  return <PresetFormInner key={props.isOpen ? 'open' : 'closed'} {...props} />
}

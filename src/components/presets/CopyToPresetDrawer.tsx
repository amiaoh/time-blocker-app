import { Button, Drawer, HStack, Stack, Text } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import type { PresetList } from '@/types'

interface CopyToPresetDrawerProps {
  isOpen: boolean
  onClose: () => void
  presets: PresetList[]
  onSelect: (presetId: string) => void
  isLoading: boolean
  existingPresetIds?: string[]
}

export function CopyToPresetDrawer({ isOpen, onClose, presets, onSelect, isLoading, existingPresetIds }: CopyToPresetDrawerProps) {
  return (
    <Drawer.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="bottom">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content bg="gray.900" borderTopRadius="2xl" pb={8}>
          <Drawer.Header borderBottomWidth={0} pb={0}>
            <Drawer.Title color="white" fontSize="md">Copy to preset</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body pt={3}>
            {presets.length === 0 ? (
              <Text color="gray.500" fontSize="sm">No preset lists yet.</Text>
            ) : (
              <Stack gap={2}>
                {presets.map((preset) => {
                  const alreadyIn = existingPresetIds?.includes(preset.id) ?? false
                  return (
                    <Button
                      key={preset.id}
                      variant="ghost"
                      justifyContent="space-between"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.100' }}
                      _active={{ bg: 'whiteAlpha.200' }}
                      h="auto"
                      py={3}
                      px={3}
                      fontSize="sm"
                      loading={isLoading}
                      disabled={alreadyIn}
                      opacity={alreadyIn ? 0.5 : 1}
                      onClick={() => !alreadyIn && onSelect(preset.id)}
                    >
                      <HStack gap={1}>
                        <span>{preset.icon} {preset.name}</span>
                      </HStack>
                      {alreadyIn && <Check size={14} />}
                    </Button>
                  )
                })}
              </Stack>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
}

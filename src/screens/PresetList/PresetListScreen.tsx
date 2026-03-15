import { Box, Button, HStack, SimpleGrid, Spinner, Text } from '@chakra-ui/react'
import { ChevronLeft } from 'lucide-react'
import { MAX_CONTAINER_WIDTH } from '@/constants'
import { PresetCard } from '@/components/presets/PresetCard'
import { PresetForm } from '@/components/presets/PresetForm'
import { TodoistPresetCard } from '@/components/presets/TodoistPresetCard'
import { usePresetListScreen } from './usePresetListScreen'
import type { PresetList } from '@/types'

interface PresetListScreenProps {
  onBack: () => void
  onOpenPreset: (preset: PresetList) => void
  onOpenTodoist: () => void
}

export function PresetListScreen({ onBack, onOpenPreset, onOpenTodoist }: PresetListScreenProps) {
  const { presets, isLoading, isFormOpen, setIsFormOpen, handleAddSubmit, isAddingPreset } = usePresetListScreen()

  return (
    <Box minH="100vh" bg="gray.950" pb={28}>
      <Box maxW={MAX_CONTAINER_WIDTH} mx="auto" px={4} pt={8}>
        <HStack mb={2} align="center">
          <Button
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
            _active={{ bg: 'whiteAlpha.200', opacity: 0.8 }}
            px={2}
            py={1}
            h="auto"
            onClick={onBack}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </Button>
          <Text flex={1} textAlign="center" fontWeight="bold" fontSize="xl" color="white">
            Preset Lists
          </Text>
          <Box w={8} />
        </HStack>

        <Text color="gray.500" textAlign="center" fontSize="sm" mb={8}>
          Create templates to quickly load into your main list
        </Text>

        {isLoading ? (
          <Box textAlign="center" py={12}>
            <Spinner color="brand.400" />
          </Box>
        ) : (
          <SimpleGrid columns={2} gap={4}>
            <TodoistPresetCard onClick={onOpenTodoist} />
            {presets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onEdit={() => onOpenPreset(preset)}
                onLoad={() => onOpenPreset(preset)}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>

      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="gray.950"
        pt={3}
        pb={6}
        px={4}
        borderTop="1px solid"
        borderColor="gray.800"
      >
        <Box maxW={MAX_CONTAINER_WIDTH} mx="auto">
          <Button
            w="full"
            bg="black"
            color="white"
            borderRadius="full"
            h={12}
            _hover={{ bg: 'gray.900' }}
            _active={{ bg: 'gray.800' }}
            onClick={() => setIsFormOpen(true)}
          >
            Add preset
          </Button>
        </Box>
      </Box>

      <PresetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={isAddingPreset}
      />
    </Box>
  )
}

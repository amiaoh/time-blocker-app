import { Box, Button, HStack, Spinner, Stack, Text } from '@chakra-ui/react'
import { ChevronLeft } from 'lucide-react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { MAX_CONTAINER_WIDTH } from '@/constants'
import type { PresetList } from '@/types'
import { PresetTaskCard } from '@/components/presets/PresetTaskCard'
import { TaskForm } from '@/components/tasks/TaskForm'
import { usePresetDetailScreen } from './usePresetDetailScreen'

interface PresetDetailScreenProps {
  preset: PresetList
  onBack: () => void
  onLoadSuccess: () => void
}

export function PresetDetailScreen({ preset, onBack, onLoadSuccess }: PresetDetailScreenProps) {
  const {
    tasks,
    isTasksLoading,
    isSelected,
    toggleSelect,
    handleDelete,
    handleDuplicate,
    handleAddTask,
    handleLoad,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isAddingTask,
    isLoading,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = usePresetDetailScreen(preset.id, onLoadSuccess)

  return (
    <Box minH="100vh" bg="gray.950" pb={28}>
      <Box maxW={MAX_CONTAINER_WIDTH} mx="auto" px={4} pt={8}>
        <HStack mb={6} align="center">
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
          <Box flex={1} />
        </HStack>

        <Stack align="center" mb={8} gap={2}>
          <Text fontSize="4xl" lineHeight={1}>{preset.icon}</Text>
          <Text fontSize="2xl" fontWeight="bold" color="white">{preset.name}</Text>
          <Text color="gray.500" fontSize="sm">
            {tasks.length === 0
              ? 'No tasks in this preset yet'
              : `There are ${tasks.length} task${tasks.length === 1 ? '' : 's'} in this preset.`}
          </Text>
        </Stack>

        {isTasksLoading ? (
          <Box textAlign="center" py={12}>
            <Spinner color="brand.400" />
          </Box>
        ) : (
          <Stack gap={3}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                  <PresetTaskCard
                    key={task.id}
                    task={task}
                    isSelected={isSelected(task.id)}
                    onDelete={() => handleDelete(task.id)}
                    onDuplicate={() => handleDuplicate(task)}
                    onToggleSelect={() => toggleSelect(task.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>

            <Button
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'gray.200', bg: 'whiteAlpha.100' }}
              _active={{ bg: 'whiteAlpha.200', opacity: 0.8 }}
              fontSize="sm"
              h="auto"
              py={3}
              onClick={() => setIsAddTaskOpen(true)}
            >
              + Add task
            </Button>
          </Stack>
        )}
      </Box>

      {!isTasksLoading && tasks.length > 0 && (
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
            <HStack gap={3}>
              <Button
                flex={1}
                bg="black"
                color="white"
                borderRadius="full"
                h={12}
                _hover={{ bg: 'gray.900' }}
                _active={{ bg: 'gray.800' }}
                onClick={() => handleLoad('top')}
                loading={isLoading}
              >
                Load to Top
              </Button>
              <Button
                flex={1}
                bg="black"
                color="white"
                borderRadius="full"
                h={12}
                _hover={{ bg: 'gray.900' }}
                _active={{ bg: 'gray.800' }}
                onClick={() => handleLoad('bottom')}
                loading={isLoading}
              >
                Load to Bottom
              </Button>
            </HStack>
          </Box>
        </Box>
      )}

      <TaskForm
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onSubmit={handleAddTask}
        isLoading={isAddingTask}
      />
    </Box>
  )
}

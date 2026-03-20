import { Box, Button, HStack, Input, Spinner, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { ChevronLeft, RefreshCw } from 'lucide-react'
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { MAX_CONTAINER_WIDTH } from '@/constants'
import { TodoistIcon } from '@/components/shared/TodoistIcon'
import { TodoistTaskCard } from '@/components/presets/TodoistTaskCard'
import { CopyToPresetDrawer } from '@/components/presets/CopyToPresetDrawer'
import { useTodoistPresetScreen } from './useTodoistPresetScreen'

interface TodoistPresetScreenProps {
  onBack: () => void
  onLoadSuccess: () => void
}

export function TodoistPresetScreen({ onBack, onLoadSuccess }: TodoistPresetScreenProps) {
  const {
    token, setApiKey, orderedTasks, isTasksLoading, isFetching, error, refetch,
    isSelected, toggleSelect, handleLoad, isLoading,
    presets, copyingTask, setCopyingTask, handleCopyToPreset, isCopyingToPreset,
    activeId, handleDragStart, handleDragEnd, handleDragCancel,
    membershipMap, handleDeleteTask, handleChangeIcon, handleEditTitle, handleEditDuration,
  } = useTodoistPresetScreen(onLoadSuccess)

  const [tokenInput, setTokenInput] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeTask = activeId ? orderedTasks.find((t) => t.id === activeId) ?? null : null

  return (
    <Box minH="100vh" bg="gray.950" pb={28}>
      <Box maxW={MAX_CONTAINER_WIDTH} mx="auto" px={4} pt={8}>
        <HStack mb={6} align="center">
          <Button variant="ghost" color="gray.400" _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
            _active={{ bg: 'whiteAlpha.200', opacity: 0.8 }}
            px={2} py={1} h="auto" onClick={onBack} aria-label="Back">
            <ChevronLeft size={20} />
          </Button>
          <Box flex={1} />
          {token && (
            <Button variant="ghost" color="gray.500" _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
              _active={{ bg: 'whiteAlpha.200', opacity: 0.8 }}
              px={2} py={1} h="auto" fontSize="sm" onClick={() => refetch()} loading={isFetching} aria-label="Refresh">
              <HStack gap={1}><RefreshCw size={14} /><Text>Refresh</Text></HStack>
            </Button>
          )}
        </HStack>

        <Stack align="center" mb={8} gap={2}>
          <TodoistIcon size={48} />
          <Text fontSize="2xl" fontWeight="bold" color="white">Todoist Today</Text>
          <Text color="gray.500" fontSize="sm">
            {orderedTasks.length === 0 && !isTasksLoading ? '' : `${orderedTasks.length} task${orderedTasks.length === 1 ? '' : 's'} due today`}
          </Text>
          <Text color="gray.600" fontSize="xs">
            Durations matching your preset tasks are applied automatically
          </Text>
        </Stack>

        {!token ? (
          <Stack gap={3}>
            <Text color="gray.400" fontSize="sm" textAlign="center">
              Enter your Todoist API token to sync today's tasks.
            </Text>
            <Input
              placeholder="Todoist API token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              bg="gray.800"
              border="none"
              color="white"
              _placeholder={{ color: 'gray.600' }}
              borderRadius="xl"
              h={12}
              px={4}
            />
            <Button
              bg="black"
              color="white"
              borderRadius="full"
              h={12}
              _hover={{ bg: 'gray.900' }}
              _active={{ bg: 'gray.800' }}
              disabled={!tokenInput.trim()}
              onClick={() => setApiKey(tokenInput.trim())}
            >
              Save token
            </Button>
          </Stack>
        ) : isTasksLoading ? (
          <Box textAlign="center" py={12}><Spinner color="brand.400" /></Box>
        ) : error ? (
          <Box bg="red.900" borderRadius="xl" p={6} textAlign="center">
            <Text color="red.200" fontWeight="semibold">Failed to load Todoist tasks</Text>
            <Text color="red.300" fontSize="sm" mt={1}>{(error as Error).message}</Text>
          </Box>
        ) : orderedTasks.length === 0 ? (
          <Box bg="gray.800" borderRadius="xl" p={6} textAlign="center">
            <Text color="gray.400">No tasks due today in Todoist 🎉</Text>
          </Box>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={orderedTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <Stack gap={3}>
                {orderedTasks.map((task) => (
                  <TodoistTaskCard
                    key={task.id}
                    task={task}
                    isSelected={isSelected(task.id)}
                    onToggleSelect={() => toggleSelect(task.id)}
                    onDelete={() => handleDeleteTask(task.id)}
                    onChangeIcon={(icon) => handleChangeIcon(task.id, icon)}
                    onEditTitle={(title) => handleEditTitle(task.id, title)}
                    onEditDuration={(durationMin) => handleEditDuration(task.id, durationMin)}
                    onCopyToPreset={presets.length > 0 ? () => setCopyingTask(task) : undefined}
                    isCopiedToAnyPreset={(membershipMap.get(task.title.toLowerCase())?.length ?? 0) > 0}
                  />
                ))}
              </Stack>
            </SortableContext>
            <DragOverlay>
              {activeTask && (
                <TodoistTaskCard
                  task={activeTask}
                  isSelected={isSelected(activeTask.id)}
                  onToggleSelect={() => {}}
                />
              )}
            </DragOverlay>
          </DndContext>
        )}
      </Box>

      {token && orderedTasks.length > 0 && (
        <Box position="fixed" bottom={0} left={0} right={0} bg="gray.950" pt={3} pb={6} px={4}
          borderTop="1px solid" borderColor="gray.800">
          <Box maxW={MAX_CONTAINER_WIDTH} mx="auto">
            <HStack gap={3}>
              <Button flex={1} bg="black" color="white" borderRadius="full" h={12}
                _hover={{ bg: 'gray.900' }} _active={{ bg: 'gray.800' }} onClick={() => handleLoad('top')} loading={isLoading}>
                Load to Top
              </Button>
              <Button flex={1} bg="black" color="white" borderRadius="full" h={12}
                _hover={{ bg: 'gray.900' }} _active={{ bg: 'gray.800' }} onClick={() => handleLoad('bottom')} loading={isLoading}>
                Load to Bottom
              </Button>
            </HStack>
          </Box>
        </Box>
      )}

      <CopyToPresetDrawer
        isOpen={!!copyingTask}
        onClose={() => setCopyingTask(null)}
        presets={presets}
        onSelect={handleCopyToPreset}
        isLoading={isCopyingToPreset}
        existingPresetIds={copyingTask ? (membershipMap.get(copyingTask.title.toLowerCase()) ?? []) : []}
      />
    </Box>
  )
}

import { Box, HStack, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { TimerControls } from '@/components/timer/TimerControls'
import { DaySummary } from '@/components/projection/DaySummary'
import { useTimerScreen } from './useTimerScreen'

export function TimerScreen() {
  const {
    tasks, isLoading, loadError, activeTask, projection,
    isFormOpen, editingTask, deletingTask, hideCompleted,
    setIsFormOpen, setEditingTask, setDeletingTask, setHideCompleted,
    timerState, start, pause, resume, complete, skip, handleTimerToggle,
    handleAddSubmit, handleEditSubmit, handleDeleteConfirm,
    handleReset, handleAdjustDuration, handleClearCompleted, handleClearAll,
    sensors, handleDragStart, handleDragEnd, handleDragCancel,
    isAddingTask, isUpdatingTask, isDeletingTask,
  } = useTimerScreen()

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <Box minH="100vh" bg="gray.950" pb={8}>
      <Box maxW="560px" mx="auto" px={4} pt={8}>
        {/* Header */}
        <HStack justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg" color="white">Today</Heading>
            <Text color="gray.500" fontSize="sm">{today}</Text>
          </Box>
        </HStack>

        {/* Timer — always visible */}
        <Box mb={6} textAlign="center">
          {activeTask && (
            <Text color="gray.400" fontSize="sm" mb={1}>Now focusing on</Text>
          )}
          <Text
            color={activeTask ? 'white' : 'gray.600'}
            fontWeight={activeTask ? 'semibold' : 'normal'}
            fontSize="lg"
            mb={4}
            minH={7}
          >
            {activeTask ? activeTask.title : 'No task running'}
          </Text>

          <TimerDisplay
            remainingSeconds={timerState.remainingSeconds}
            durationMin={activeTask?.durationMin ?? 0}
            color={activeTask?.color ?? '#4A5568'}
            isRunning={timerState.isRunning}
            isIdle={!activeTask}
            onToggle={activeTask ? handleTimerToggle : undefined}
          />

          {activeTask && (
            <Stack align="center" gap={4} mt={4}>
              <HStack gap={3}>
                <Text
                  as="button"
                  fontSize="sm"
                  color="gray.500"
                  _hover={{ color: 'gray.300' }}
                  cursor="pointer"
                  bg="transparent"
                  border="none"
                  p={0}
                  onClick={() => handleAdjustDuration(activeTask, -5)}
                >
                  −5m
                </Text>
                <Text fontSize="sm" color="gray.600">{activeTask.durationMin}m</Text>
                <Text
                  as="button"
                  fontSize="sm"
                  color="gray.500"
                  _hover={{ color: 'gray.300' }}
                  cursor="pointer"
                  bg="transparent"
                  border="none"
                  p={0}
                  onClick={() => handleAdjustDuration(activeTask, 5)}
                >
                  +5m
                </Text>
              </HStack>
              <TimerControls
                isRunning={timerState.isRunning}
                isPaused={timerState.isPaused}
                onPause={pause}
                onResume={resume}
                onComplete={complete}
                onSkip={skip}
                accentColor={activeTask.color}
              />
            </Stack>
          )}
        </Box>

        {/* Load error */}
        {loadError && (
          <Box bg="red.900" borderRadius="lg" p={4} mb={4}>
            <Text color="red.200" fontSize="sm" fontWeight="semibold">Failed to load tasks</Text>
            <Text color="red.300" fontSize="xs" mt={1}>{String(loadError)}</Text>
          </Box>
        )}

        {/* Day summary + task list */}
        {isLoading ? (
          <Box textAlign="center" py={12}>
            <Spinner color="brand.400" />
          </Box>
        ) : (
          <>
            {tasks.length > 0 && <DaySummary projection={projection} />}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <TaskList
                tasks={tasks}
                timerState={timerState}
                hideCompleted={hideCompleted}
                onToggleHideCompleted={() => setHideCompleted((v) => !v)}
                onAddTask={() => setIsFormOpen(true)}
                onClearCompleted={handleClearCompleted}
                onClearAll={handleClearAll}
                onStart={start}
                onPause={pause}
                onComplete={complete}
                onEdit={(task) => setEditingTask(task)}
                onDelete={(task) => setDeletingTask(task)}
                onReset={handleReset}
                onAdjustDuration={handleAdjustDuration}
              />
            </DndContext>
          </>
        )}
      </Box>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={isAddingTask}
      />

      <TaskForm
        isOpen={!!editingTask}
        onClose={() => setEditingTask(undefined)}
        onSubmit={handleEditSubmit}
        editingTask={editingTask}
        isLoading={isUpdatingTask}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(undefined)}
        onConfirm={handleDeleteConfirm}
        title="Delete task"
        message={`Delete "${deletingTask?.title}"? This cannot be undone.`}
        isLoading={isDeletingTask}
      />
    </Box>
  )
}

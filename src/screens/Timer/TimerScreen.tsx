import { Box, Spinner, Stack, Text } from "@chakra-ui/react";
import { DndContext, closestCenter, pointerWithin, type CollisionDetection } from "@dnd-kit/core";

const collisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args)
  return pointerHits.length > 0 ? pointerHits : closestCenter(args)
}

import { AppHeader } from "@/components/layout/AppHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SettingsDialog } from "@/components/shared/SettingsDialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskEditSheet } from "@/components/tasks/TaskEditSheet";
import { TaskList } from "@/components/tasks/TaskList";
import { TimerAdjustControls } from "@/components/timer/TimerAdjustControls";
import { TimerDisplay } from "@/components/timer/TimerDisplay";
import { useState } from "react";
import { useTimerScreen } from "./useTimerScreen";
import { MAX_CONTAINER_WIDTH } from "@/constants";

interface TimerScreenProps {
  onOpenPresets: () => void
  onOpenOverview: () => void
}

export function TimerScreen({ onOpenPresets, onOpenOverview }: TimerScreenProps) {
  const {
    tasks,
    isLoading,
    loadError,
    activeTask,
    projection,
    isFormOpen,
    editingTask,
    deletingTask,
    hideCompleted,
    setIsFormOpen,
    setEditingTask,
    setDeletingTask,
    setHideCompleted,
    timerState,
    taskElapsed,
    taskRemaining,
    complete,
    handleTimerToggle,
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    handleReset,
    handleAdjustDuration,
    handleMoveToTop,
    handleChangeIcon,
    handleClearCompleted,
    handleClearAll,
    taskTimeRanges,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    isAddingTask,
    isUpdatingTask,
    isDeletingTask,
    settings,
    updateSettings,
  } = useTimerScreen();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isOvertime = timerState.remainingSeconds === 0 && timerState.elapsedSeconds > 0 && !!activeTask
  const plannedSeconds = activeTask ? (activeTask.originalDurationMin ?? activeTask.durationMin) * 60 : 0
  const overtimeSeconds = isOvertime ? Math.max(0, timerState.elapsedSeconds - plannedSeconds) : 0

  return (
    <Box minH="100vh" bg="gray.950" pb={8}>
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg="gray.950"
        pb={4}
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Box maxW={MAX_CONTAINER_WIDTH} mx="auto" px={4} pt={8}>
          <AppHeader
            projection={projection}
            use24HourTime={settings.use24HourTime}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenOverview={onOpenOverview}
            onAddPreset={onOpenPresets}
          />

          <Box textAlign="center" role="region" aria-label="Timer">
            <TimerDisplay
              remainingSeconds={timerState.remainingSeconds}
              isRunning={timerState.isRunning}
              isIdle={!activeTask}
              isOvertime={isOvertime}
              overtimeSeconds={overtimeSeconds}
              showPie={settings.showPieTimer}
              onToggle={activeTask ? handleTimerToggle : undefined}
              onMinus={activeTask ? () => handleAdjustDuration(activeTask, -5) : undefined}
              onPlus={activeTask ? () => handleAdjustDuration(activeTask, 5) : undefined}
            />

            <Text
              color={!activeTask ? "gray.700" : isOvertime ? "red.400" : "white"}
              fontWeight={activeTask ? "semibold" : "normal"}
              fontSize={activeTask ? "lg" : "sm"}
              mb={4}
              minH={7}
            >
              {activeTask ? (isOvertime ? `Overtime: ${activeTask.title}` : activeTask.title) : "Pick a task to start"}
            </Text>

            {activeTask && !settings.showPieTimer && (
              <Stack align="center" gap={4} mt={4}>
                <TimerAdjustControls
                  isRunning={timerState.isRunning}
                  showToggle={true}
                  onMinus={() => handleAdjustDuration(activeTask, -5)}
                  onPlus={() => handleAdjustDuration(activeTask, 5)}
                  onToggle={handleTimerToggle}
                />
              </Stack>
            )}
          </Box>
        </Box>
      </Box>

      <Box maxW={MAX_CONTAINER_WIDTH} mx="auto" px={4} pt={2}>

        {/* Load error */}
        {loadError && (
          <Box bg="red.900" borderRadius="lg" p={4} mb={4}>
            <Text color="red.200" fontSize="sm" fontWeight="semibold">
              Failed to load tasks
            </Text>
            <Text color="red.300" fontSize="xs" mt={1}>
              {String(loadError)}
            </Text>
          </Box>
        )}

        {/* Task list */}
        {isLoading ? (
          <Box textAlign="center" py={12}>
            <Spinner color="brand.400" />
          </Box>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <TaskList
              tasks={tasks}
              timerState={timerState}
              taskElapsed={taskElapsed}
              taskRemaining={taskRemaining}
              taskTimeRanges={taskTimeRanges}
              use24HourTime={settings.use24HourTime}
              hideCompleted={hideCompleted}
              onToggleHideCompleted={() => setHideCompleted((v) => !v)}
              onAddTask={() => setIsFormOpen(true)}
              onClearCompleted={handleClearCompleted}
              onClearAll={handleClearAll}
              onComplete={complete}
              onDelete={(task) => setDeletingTask(task)}
              onReset={handleReset}
              onMoveToTop={handleMoveToTop}
              onChangeIcon={handleChangeIcon}
              onEdit={(task) => setEditingTask(task)}
            />
          </DndContext>
        )}
      </Box>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddSubmit}
        isLoading={isAddingTask}
        maxDurationMin={settings.maxTaskDurationMin}
      />

      <TaskEditSheet
        key={editingTask?.id}
        task={editingTask}
        onClose={() => setEditingTask(undefined)}
        onSubmit={handleEditSubmit}
        isLoading={isUpdatingTask}
        maxDurationMin={settings.maxTaskDurationMin}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(undefined)}
        onConfirm={handleDeleteConfirm}
        title="Delete task"
        message={`Delete "${deletingTask?.title}"? This cannot be undone.`}
        isLoading={isDeletingTask}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={updateSettings}
      />
    </Box>
  );
}

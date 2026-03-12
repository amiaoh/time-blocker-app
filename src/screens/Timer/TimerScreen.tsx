import { Box, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { DndContext, closestCenter } from "@dnd-kit/core";

import { AppHeader } from "@/components/layout/AppHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SettingsDialog } from "@/components/shared/SettingsDialog";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { TimerDisplay } from "@/components/timer/TimerDisplay";
import { useState } from "react";
import { useTimerScreen } from "./useTimerScreen";

export function TimerScreen() {
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

  return (
    <Box minH="100vh" bg="gray.950" pb={8}>
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg="gray.950"
        pb={4}
      >
        <Box maxW="560px" mx="auto" px={4} pt={8}>
          <AppHeader
            projection={projection}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Timer */}
          <Box textAlign="center" role="region" aria-label="Timer">
            <TimerDisplay
              remainingSeconds={timerState.remainingSeconds}
              isRunning={timerState.isRunning}
              isIdle={!activeTask}
              showPie={settings.showPieTimer}
              onToggle={activeTask ? handleTimerToggle : undefined}
            />
            <Text
              color={activeTask ? "white" : "gray.600"}
              fontWeight={activeTask ? "semibold" : "normal"}
              fontSize="lg"
              mb={4}
              minH={7}
            >
              {activeTask ? activeTask.title : "No task running"}
            </Text>

            {activeTask && (
              <Stack align="center" gap={4} mt={4}>
                <HStack gap={3}>
                  <Text
                    as="button"
                    fontSize="sm"
                    color="gray.500"
                    _hover={{ color: "gray.300" }}
                    cursor="pointer"
                    bg="transparent"
                    border="none"
                    p={0}
                    onClick={() => handleAdjustDuration(activeTask, -5)}
                    aria-label="Subtract 5 minutes"
                  >
                    −5m
                  </Text>
                  <Text
                    as="button"
                    fontSize="sm"
                    color="gray.500"
                    _hover={{ color: "gray.300" }}
                    cursor="pointer"
                    bg="transparent"
                    border="none"
                    p={0}
                    onClick={() => handleAdjustDuration(activeTask, 5)}
                    aria-label="Add 5 minutes"
                  >
                    +5m
                  </Text>
                </HStack>
              </Stack>
            )}
          </Box>
        </Box>
      </Box>

      <Box maxW="560px" mx="auto" px={4}>

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
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <TaskList
              tasks={tasks}
              timerState={timerState}
              taskElapsed={taskElapsed}
              taskTimeRanges={taskTimeRanges}
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

      <TaskForm
        isOpen={!!editingTask}
        onClose={() => setEditingTask(undefined)}
        onSubmit={handleEditSubmit}
        editingTask={editingTask}
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

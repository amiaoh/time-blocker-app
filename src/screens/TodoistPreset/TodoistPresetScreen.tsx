import { Box, Button, Grid, GridItem, HStack, Spinner, Stack, Text } from '@chakra-ui/react'
import { MAX_CONTAINER_WIDTH } from '@/constants'
import { useTodoistPresetScreen } from './useTodoistPresetScreen'
import { ActionBtn } from '@/components/shared/ActionBtn'

interface TodoistPresetScreenProps {
  onBack: () => void
  onLoadSuccess: () => void
}

export function TodoistPresetScreen({ onBack, onLoadSuccess }: TodoistPresetScreenProps) {
  const { token, tasks, isTasksLoading, isFetching, error, refetch, isSelected, toggleSelect, handleLoad, isLoading } =
    useTodoistPresetScreen(onLoadSuccess)

  return (
    <Box minH="100vh" bg="gray.950" pb={28}>
      <Box maxW={MAX_CONTAINER_WIDTH} mx="auto" px={4} pt={8}>
        <HStack mb={6} align="center">
          <Button variant="ghost" color="gray.400" _hover={{ color: 'white', bg: 'transparent' }}
            p={0} h="auto" fontSize="2xl" onClick={onBack} aria-label="Back">
            ‹
          </Button>
          <Box flex={1} />
          {token && (
            <Button variant="ghost" color="gray.500" _hover={{ color: 'white', bg: 'transparent' }}
              p={0} h="auto" fontSize="sm" onClick={() => refetch()} loading={isFetching} aria-label="Refresh">
              ↻ Refresh
            </Button>
          )}
        </HStack>

        <Stack align="center" mb={8} gap={2}>
          <Text fontSize="4xl" lineHeight={1}>☑️</Text>
          <Text fontSize="2xl" fontWeight="bold" color="white">Todoist Today</Text>
          <Text color="gray.500" fontSize="sm">
            {tasks.length === 0 && !isTasksLoading ? '' : `${tasks.length} task${tasks.length === 1 ? '' : 's'} due today`}
          </Text>
        </Stack>

        {!token ? (
          <Box bg="gray.800" borderRadius="xl" p={6} textAlign="center">
            <Text color="gray.300" mb={1}>No Todoist token set</Text>
            <Text color="gray.500" fontSize="sm">Add your API token in Settings to sync tasks.</Text>
          </Box>
        ) : isTasksLoading ? (
          <Box textAlign="center" py={12}><Spinner color="brand.400" /></Box>
        ) : error ? (
          <Box bg="red.900" borderRadius="xl" p={6} textAlign="center">
            <Text color="red.200" fontWeight="semibold">Failed to load Todoist tasks</Text>
            <Text color="red.300" fontSize="sm" mt={1}>{(error as Error).message}</Text>
          </Box>
        ) : tasks.length === 0 ? (
          <Box bg="gray.800" borderRadius="xl" p={6} textAlign="center">
            <Text color="gray.400">No tasks due today in Todoist 🎉</Text>
          </Box>
        ) : (
          <Stack gap={3}>
            {tasks.map((task) => (
              <Box
                key={task.id}
                bg={task.color}
                borderRadius="xl"
                opacity={isSelected(task.id) ? 1 : 0.45}
                transition="opacity 0.15s"
              >
                <HStack align="stretch" gap={0}>
                  <Box w={8} flexShrink={0} />
                  <Grid templateColumns="auto 1fr" templateRows="auto auto"
                    columnGap={3} flex={1} pb={3} pr={4} pl={2} pt={3} minW={0} alignItems="center">
                    <GridItem display="flex" justifyContent="center">
                      <Text fontSize="xl" lineHeight={1.2}>{task.icon}</Text>
                    </GridItem>
                    <GridItem minW={0}>
                      <Text fontWeight="semibold" fontSize="md" color="white" truncate>{task.title}</Text>
                    </GridItem>
                    <GridItem display="flex" justifyContent="center">
                      <Text fontSize="xs" fontWeight="semibold" color="white" fontVariantNumeric="tabular-nums">
                        {task.durationMin}m
                      </Text>
                    </GridItem>
                    <GridItem minW={0}>
                      <ActionBtn
                        label={isSelected(task.id) ? 'Selected ✓' : 'Select'}
                        onClick={() => toggleSelect(task.id)}
                        color={isSelected(task.id) ? 'white' : 'whiteAlpha.500'}
                        hoverColor="white"
                      />
                    </GridItem>
                  </Grid>
                </HStack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {token && tasks.length > 0 && (
        <Box position="fixed" bottom={0} left={0} right={0} bg="gray.950" pt={3} pb={6} px={4}
          borderTop="1px solid" borderColor="gray.800">
          <Box maxW={MAX_CONTAINER_WIDTH} mx="auto">
            <HStack gap={3}>
              <Button flex={1} bg="black" color="white" borderRadius="full" h={12}
                _hover={{ bg: 'gray.900' }} onClick={() => handleLoad('top')} loading={isLoading}>
                Load to Top
              </Button>
              <Button flex={1} bg="black" color="white" borderRadius="full" h={12}
                _hover={{ bg: 'gray.900' }} onClick={() => handleLoad('bottom')} loading={isLoading}>
                Load to Bottom
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </Box>
  )
}

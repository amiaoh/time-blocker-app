import { Box, Text } from '@chakra-ui/react'

export function EmptyState() {
  return (
    <Box
      textAlign="center"
      py={16}
      px={6}
      color="gray.500"
    >
      <Text fontSize="4xl" mb={4}>🦙</Text>
      <Text fontSize="lg" fontWeight="semibold" color="gray.400" mb={2}>
        No tasks yet
      </Text>
      <Text fontSize="sm">
        Add your first task and start timeboxing your day
      </Text>
    </Box>
  )
}

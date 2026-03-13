import { Box, Text } from '@chakra-ui/react'

export function EmptyState() {
  return (
    <Box
      textAlign="center"
      py={2}
      px={6}
      color="gray.500"
    >
      <Text fontSize="lg" fontWeight="semibold" color="gray.400" mb={2}>
        No tasks yet
      </Text>
    
    </Box>
  )
}

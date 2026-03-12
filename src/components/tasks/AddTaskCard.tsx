import { Box, Text } from '@chakra-ui/react'

interface AddTaskCardProps {
  onClick: () => void
}

export function AddTaskCard({ onClick }: AddTaskCardProps) {
  return (
    <Box
      as="button"
      onClick={onClick}
      w="100%"
      borderRadius="xl"
      borderWidth={2}
      borderStyle="dashed"
      borderColor="gray.700"
      py={5}
      textAlign="center"
      cursor="pointer"
      bg="transparent"
      color="gray.600"
      _hover={{ borderColor: 'gray.500', color: 'gray.400' }}
      transition="border-color 0.15s, color 0.15s"
      aria-label="Add new task"
    >
      <Text fontSize="xl" lineHeight={1}>+</Text>
      <Text fontSize="sm" mt={1}>Add task</Text>
    </Box>
  )
}

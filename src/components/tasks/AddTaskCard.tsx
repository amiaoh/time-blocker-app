import { Button, Text } from '@chakra-ui/react'

interface AddTaskCardProps {
  onClick: () => void
}

export function AddTaskCard({ onClick }: AddTaskCardProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      w="100%"
      borderRadius="xl"
      borderWidth={2}
      borderStyle="dashed"
      borderColor="whiteAlpha.800"
      py={5}
      h="auto"
      flexDirection="column"
      color="whiteAlpha.800"
      bg="transparent"
      _hover={{ borderColor: 'gray.500', color: 'gray.400', bg: 'transparent' }}
      transition="border-color 0.15s, color 0.15s"
      aria-label="Add new task"
    >
      <Text fontSize="xl" lineHeight={1}>+</Text>
      <Text fontSize="sm" mt={1}>Add task</Text>
    </Button>
  )
}

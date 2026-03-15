import { Box, Stack, Text } from '@chakra-ui/react'
import { TodoistIcon } from '@/components/shared/TodoistIcon'

interface TodoistPresetCardProps {
  onClick: () => void
}

export function TodoistPresetCard({ onClick }: TodoistPresetCardProps) {
  return (
    <Box
      bg="gray.800"
      borderRadius="xl"
      p={4}
      cursor="pointer"
      _hover={{ bg: 'gray.750' }}
      onClick={onClick}
    >
      <Stack gap={2} align="center" textAlign="center">
        <TodoistIcon size={36} />
        <Text fontWeight="bold" color="white" fontSize="sm" lineHeight={1.3}>
          Todoist Today
        </Text>
        <Text fontSize="xs" color="gray.500">Sync from Todoist</Text>
      </Stack>
    </Box>
  )
}

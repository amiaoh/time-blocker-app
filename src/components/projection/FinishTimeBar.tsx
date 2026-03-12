import { Box, HStack, Text } from '@chakra-ui/react'
import { formatFinishTime } from '@/utils/calcFinishTime'
import { formatMinutes } from '@/utils/formatTime'
import type { ProjectionResult } from '@/types'

interface FinishTimeBarProps {
  projection: ProjectionResult
}

export function FinishTimeBar({ projection }: FinishTimeBarProps) {
  const { finishTime, totalRemainingMinutes } = projection

  if (totalRemainingMinutes === 0) return null

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="gray.900"
      borderTopWidth={1}
      borderColor="gray.800"
      px={6}
      py={3}
    >
      <HStack justify="center" gap={4}>
        <Text color="gray.400" fontSize="sm">
          Finish by
        </Text>
        <Text color="white" fontWeight="semibold">
          {formatFinishTime(finishTime)}
        </Text>
        <Text color="gray.600" fontSize="sm">·</Text>
        <Text color="gray.400" fontSize="sm">
          {formatMinutes(totalRemainingMinutes)} remaining
        </Text>
      </HStack>
    </Box>
  )
}

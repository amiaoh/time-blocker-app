import { HStack, Text } from '@chakra-ui/react'
import { formatFinishTime } from '@/utils/calcFinishTime'
import { formatMinutes } from '@/utils/formatTime'
import type { ProjectionResult } from '@/types'

interface DaySummaryProps {
  projection: ProjectionResult
}

export function DaySummary({ projection }: DaySummaryProps) {
  const { finishTime, totalRemainingMinutes } = projection

  if (totalRemainingMinutes === 0) return null

  return (
    <HStack
      justify="center"
      gap={3}
      py={2}
      px={4}
      bg="gray.900"
      borderRadius="lg"
      mb={4}
    >
      <Text color="gray.400" fontSize="sm">
        {formatMinutes(totalRemainingMinutes)} remaining
      </Text>
      <Text color="gray.600" fontSize="sm">·</Text>
      <Text color="gray.300" fontSize="sm">
        Done by <Text as="span" color="white" fontWeight="semibold">{formatFinishTime(finishTime)}</Text>
      </Text>
    </HStack>
  )
}

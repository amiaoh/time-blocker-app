import { Box, HStack, Separator, Text } from '@chakra-ui/react'

import type { ProjectionResult } from '@/types'
import { formatFinishTime } from '@/utils/calcFinishTime'
import { formatMinutes } from '@/utils/formatTime'

interface DaySummaryProps {
  projection: ProjectionResult
  use24HourTime?: boolean
}

export function DaySummary({ projection, use24HourTime = false }: DaySummaryProps) {
  const { finishTime, totalRemainingMinutes } = projection

  if (totalRemainingMinutes === 0) return null

  return (
    <HStack
      justify="center"
      gap={0}
      bg="gray.900"
      borderRadius="xl"
      overflow="hidden"
      flex={1}
      role="region"
      aria-label="Day summary"
    >
      <Box flex={1} textAlign="center" py={3} px={4}>
        <Text color="white" fontWeight="semibold" fontSize="sm">
          {formatMinutes(totalRemainingMinutes)}
        </Text>
        <Text color="gray.500" fontSize="xs">List time</Text>
      </Box>

      <Separator orientation="vertical" borderColor="gray.600" borderWidth="1px" alignSelf="center" h="12" />

      <Box flex={1} textAlign="center" py={3} px={4}>
        <Text color="white" fontWeight="semibold" fontSize="sm">
          {formatFinishTime(finishTime, use24HourTime)}
        </Text>
        <Text color="gray.500" fontSize="xs">End time</Text>
      </Box>
    </HStack>
  )
}

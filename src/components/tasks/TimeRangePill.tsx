import { HStack, Text } from '@chakra-ui/react'
import { formatTimeShort } from '@/utils/formatTime'

interface TimeRangePillProps {
  start: Date
  end: Date
  use24HourTime?: boolean
}

export function TimeRangePill({ start, end, use24HourTime = false }: TimeRangePillProps) {
  return (
    <HStack pt={2}>
      <Text
        fontSize="xs"
        color="gray.300"
        fontVariantNumeric="tabular-nums"
        backgroundColor="teal.700"
        borderRadius={4}
        paddingX={2}
      >
        {formatTimeShort(start, use24HourTime)} → {formatTimeShort(end, use24HourTime)}
      </Text>
    </HStack>
  )
}

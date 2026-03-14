import { HStack, Text } from '@chakra-ui/react'
import { formatTimeShort } from '@/utils/formatTime'

interface TimeRangePillProps {
  start: Date
  end: Date
  cardColor: string
  use24HourTime?: boolean
}

export function TimeRangePill({ start, end, cardColor, use24HourTime = false }: TimeRangePillProps) {
  return (
    <HStack pt={2}>
      <Text
        fontSize="xs"
        fontWeight="semibold"
        fontVariantNumeric="tabular-nums"
        backgroundColor="white"
        color={cardColor}
        borderRadius={4}
        paddingX={2}
      >
        {formatTimeShort(start, use24HourTime)} → {formatTimeShort(end, use24HourTime)}
      </Text>
    </HStack>
  )
}

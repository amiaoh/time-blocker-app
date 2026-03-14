import { Text } from '@chakra-ui/react'
import { formatTimeShort } from '@/utils/formatTime'

interface TimeRangePillProps {
  start: Date
  end: Date
  cardColor: string
  use24HourTime?: boolean
}

export function TimeRangePill({ start, end, cardColor, use24HourTime = false }: TimeRangePillProps) {
  return (
    <Text
      fontSize="xs"
      fontWeight="semibold"
      fontVariantNumeric="tabular-nums"
      backgroundColor="white"
      color={cardColor}
      borderTopRightRadius="xl"
      borderBottomLeftRadius="xl"
      borderTopLeftRadius={0}
      borderBottomRightRadius={0}
      paddingX={2}
      paddingY={1}
    >
      {formatTimeShort(start, use24HourTime)} → {formatTimeShort(end, use24HourTime)}
    </Text>
  )
}

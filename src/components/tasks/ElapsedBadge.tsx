import { Text } from '@chakra-ui/react'

interface ElapsedBadgeProps {
  label: string
  isOvertime?: boolean
}

export function ElapsedBadge({ label, isOvertime }: ElapsedBadgeProps) {
  return (
    <Text
      fontSize="xs"
      color={isOvertime ? 'red.300' : 'white'}
      flexShrink={0}
      fontVariantNumeric="tabular-nums"
      backgroundColor={isOvertime ? 'red.900' : 'whiteAlpha.300'}
      borderRadius={4}
      paddingX={2}
      ml="auto"
    >
      {label}
    </Text>
  )
}

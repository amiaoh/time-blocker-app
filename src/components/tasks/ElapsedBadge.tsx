import { Text } from '@chakra-ui/react'

interface ElapsedBadgeProps {
  label: string
  isOvertime?: boolean
}

export function ElapsedBadge({ label, isOvertime }: ElapsedBadgeProps) {
  return (
    <Text
      fontSize="xs"
      color={isOvertime ? 'red.300' : 'gray.500'}
      flexShrink={0}
      fontVariantNumeric="tabular-nums"
      backgroundColor={isOvertime ? 'red.900' : undefined}
      borderRadius={isOvertime ? 4 : undefined}
      paddingX={isOvertime ? 2 : undefined}
      ml="auto"
    >
      {label}
    </Text>
  )
}

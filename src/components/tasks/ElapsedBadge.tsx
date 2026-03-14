import { Text } from '@chakra-ui/react'

interface ElapsedBadgeProps {
  label: string
}

export function ElapsedBadge({ label }: ElapsedBadgeProps) {
  return (
    <Text
      fontSize="xs"
      color="white"
      flexShrink={0}
      fontVariantNumeric="tabular-nums"
      backgroundColor="whiteAlpha.300"
      borderRadius={4}
      paddingX={2}
    >
      {label}
    </Text>
  )
}

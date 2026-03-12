import { Text } from '@chakra-ui/react'

interface ElapsedBadgeProps {
  label: string
}

export function ElapsedBadge({ label }: ElapsedBadgeProps) {
  return (
    <Text
      fontSize="xs"
      color="gray.600"
      flexShrink={0}
      fontVariantNumeric="tabular-nums"
      backgroundColor="gray.400"
      borderRadius={4}
      paddingX={2}
    >
      {label}
    </Text>
  )
}

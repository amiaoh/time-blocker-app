import { Text } from '@chakra-ui/react'

interface ActionBtnProps {
  label: string
  onClick: () => void
  color?: string
  hoverColor?: string
  ariaLabel?: string
}

export function ActionBtn({ label, onClick, color = 'gray.500', hoverColor = 'white', ariaLabel }: ActionBtnProps) {
  return (
    <Text
      as="button"
      fontSize="sm"
      color={color}
      _hover={{ color: hoverColor }}
      cursor="pointer"
      onClick={onClick}
      bg="transparent"
      border="none"
      p={0}
      flexShrink={0}
      aria-label={ariaLabel ?? label}
    >
      {label}
    </Text>
  )
}

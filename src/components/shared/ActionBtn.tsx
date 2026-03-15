import { Button } from '@chakra-ui/react'

interface ActionBtnProps {
  label: string
  onClick: () => void
  color?: string
  hoverColor?: string
  ariaLabel?: string
}

export function ActionBtn({ label, onClick, color = 'whiteAlpha.800', hoverColor = 'white', ariaLabel }: ActionBtnProps) {
  return (
    <Button
      variant="ghost"
      fontSize="sm"
      color={color}
      bg="whiteAlpha.100"
      _hover={{ color: hoverColor, bg: 'whiteAlpha.200' }}
      _active={{ bg: 'whiteAlpha.300', opacity: 0.8 }}
      px={2}
      py={1}
      h="auto"
      minW="auto"
      borderRadius="md"
      flexShrink={0}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
    >
      {label}
    </Button>
  )
}

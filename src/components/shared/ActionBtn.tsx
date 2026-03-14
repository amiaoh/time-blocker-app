import { Button } from '@chakra-ui/react'

interface ActionBtnProps {
  label: string
  onClick: () => void
  color?: string
  hoverColor?: string
  ariaLabel?: string
}

export function ActionBtn({ label, onClick, color = 'whiteAlpha.600', hoverColor = 'white', ariaLabel }: ActionBtnProps) {
  return (
    <Button
      variant="ghost"
      fontSize="sm"
      color={color}
      _hover={{ color: hoverColor, bg: 'transparent' }}
      p={0}
      h="auto"
      minW="auto"
      flexShrink={0}
      onClick={onClick}
      aria-label={ariaLabel ?? label}
    >
      {label}
    </Button>
  )
}

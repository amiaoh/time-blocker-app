import { Button } from '@chakra-ui/react'

interface AddPresetBtnProps {
  onClick?: () => void
}

export function AddPresetBtn({ onClick }: AddPresetBtnProps) {
  return (
    <Button
      variant="ghost"
      fontSize="lg"
      color="gray.500"
      _hover={{ color: 'gray.300', bg: 'whiteAlpha.100' }}
      _active={{ bg: 'whiteAlpha.200', opacity: 0.8 }}
      p={1}
      h="auto"
      w="32px"
      minW="auto"
      flexShrink={0}
      onClick={onClick}
      aria-label="Add preset list"
      title="Add preset list"
    >
      ≡+
    </Button>
  )
}

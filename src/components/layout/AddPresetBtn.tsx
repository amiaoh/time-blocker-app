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
      _hover={{ color: 'gray.300', bg: 'transparent' }}
      p={1}
      h="auto"
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

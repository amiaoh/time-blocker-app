import { Button } from '@chakra-ui/react'

interface TextBtnProps {
  label: string
  icon: string
  onClick: () => void
}

export function TextBtn({ label, icon, onClick }: TextBtnProps) {
  return (
    <Button
      variant="ghost"
      fontSize="sm"
      color="gray.200"
      _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
      _active={{ bg: 'whiteAlpha.200', opacity: 0.8 }}
      px={2}
      py={1}
      h="auto"
      minW="auto"
      borderRadius="md"
      gap={1}
      onClick={onClick}
      aria-label={label}
    >
      {icon} {label}
    </Button>
  )
}

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
      _hover={{ color: 'gray.200', bg: 'transparent' }}
      p={0}
      h="auto"
      minW="auto"
      gap={1}
      onClick={onClick}
      aria-label={label}
    >
      {icon} {label}
    </Button>
  )
}

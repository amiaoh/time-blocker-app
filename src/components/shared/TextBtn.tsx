import { Button } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface TextBtnProps {
  label: string
  icon: ReactNode
  onClick: () => void
}

export function TextBtn({ label, icon, onClick }: TextBtnProps) {
  return (
    <Button
      variant="ghost"
      fontSize="sm"
      color="gray.500"
      _hover={{ color: 'gray.300', bg: 'whiteAlpha.100' }}
      _active={{ bg: 'whiteAlpha.200', opacity: 0.8 }}
      px={2}
      py={1}
      h="auto"
      minW="auto"
      borderRadius="md"
      gap={1.5}
      onClick={onClick}
      aria-label={label}
    >
      {icon} {label}
    </Button>
  )
}

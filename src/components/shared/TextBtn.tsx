import { Text } from '@chakra-ui/react'

interface TextBtnProps {
  label: string
  icon: string
  onClick: () => void
}

export function TextBtn({ label, icon, onClick }: TextBtnProps) {
  return (
    <Text
      as="button"
      fontSize="sm"
      color="gray.500"
      _hover={{ color: 'gray.200' }}
      cursor="pointer"
      bg="transparent"
      border="none"
      p={0}
      display="flex"
      alignItems="center"
      gap={1}
      onClick={onClick}
      aria-label={label}
    >
      {icon} {label}
    </Text>
  )
}

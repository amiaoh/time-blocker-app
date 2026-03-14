import { Button } from '@chakra-ui/react'

interface SettingsBtnProps {
  onClick: () => void
}

export function SettingsBtn({ onClick }: SettingsBtnProps) {
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
      aria-label="Open settings"
    >
      ⚙
    </Button>
  )
}

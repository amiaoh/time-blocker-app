import { Button, HStack, MenuContent, MenuItem, MenuPositioner, MenuRoot, MenuTrigger, Text } from '@chakra-ui/react'
import { LayoutDashboard, Menu, Settings } from 'lucide-react'

interface MenuBtnProps {
  onOpenSettings: () => void
  onOpenOverview: () => void
}

export function MenuBtn({ onOpenSettings, onOpenOverview }: MenuBtnProps) {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
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
          aria-label="Open menu"
        >
          <Menu size={18} />
        </Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent
          bg="gray.900"
          borderColor="gray.700"
          borderRadius="xl"
          minW="160px"
          py={1}
        >
          <MenuItem
            value="settings"
            color="gray.200"
            fontSize="sm"
            px={4}
            py={3}
            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
            cursor="pointer"
            onClick={onOpenSettings}
          >
            <HStack gap={3} align="center">
              <Settings size={18} />
              <Text>Settings</Text>
            </HStack>
          </MenuItem>
          <MenuItem
            value="overview"
            color="gray.200"
            fontSize="sm"
            px={4}
            py={3}
            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
            cursor="pointer"
            onClick={onOpenOverview}
          >
            <HStack gap={3} align="center">
              <LayoutDashboard size={18} />
              <Text>Overview</Text>
            </HStack>
          </MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}

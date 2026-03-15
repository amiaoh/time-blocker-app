import { Box, Button, HStack, Text } from '@chakra-ui/react'
import { ChevronLeft } from 'lucide-react'
import { MAX_CONTAINER_WIDTH } from '@/constants'

interface OverviewScreenProps {
  onBack: () => void
}

export function OverviewScreen({ onBack }: OverviewScreenProps) {
  return (
    <Box minH="100vh" bg="gray.950" pb={28}>
      <Box maxW={MAX_CONTAINER_WIDTH} mx="auto" px={4} pt={8}>
        <HStack mb={6} align="center">
          <Button
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
            _active={{ bg: 'whiteAlpha.200', opacity: 0.8 }}
            px={2}
            py={1}
            h="auto"
            onClick={onBack}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </Button>
          <Text flex={1} textAlign="center" fontWeight="bold" fontSize="xl" color="white">
            Overview
          </Text>
          <Box w={8} />
        </HStack>

        <Text color="gray.500" textAlign="center" fontSize="sm">
          Coming soon
        </Text>
      </Box>
    </Box>
  )
}

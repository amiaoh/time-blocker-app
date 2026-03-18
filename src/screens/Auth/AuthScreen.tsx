import { Box, Button, Stack, Text } from '@chakra-ui/react'
import { useAuth } from '@/context/AuthContext'

export function AuthScreen() {
  const { signInWithGoogle } = useAuth()

  return (
    <Box minH="100vh" bg="gray.950" display="flex" alignItems="center" justifyContent="center">
      <Stack align="center" gap={6} px={8} maxW="320px" w="full">
        <Text fontSize="4xl">⏱</Text>
        <Stack align="center" gap={1}>
          <Text fontSize="2xl" fontWeight="bold" color="white">Time Blocker</Text>
          <Text color="gray.500" textAlign="center" fontSize="sm">
            Sign in to save your tasks and presets
          </Text>
        </Stack>
        <Button
          w="full"
          bg="white"
          color="gray.900"
          borderRadius="full"
          h={12}
          fontWeight="semibold"
          _hover={{ bg: 'gray.100' }}
          _active={{ bg: 'gray.200' }}
          onClick={signInWithGoogle}
        >
          Continue with Google
        </Button>
      </Stack>
    </Box>
  )
}

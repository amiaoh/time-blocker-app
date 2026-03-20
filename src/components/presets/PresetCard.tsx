import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import type { PresetList } from '@/types'
import { ActionBtn } from '@/components/shared/ActionBtn'

interface PresetCardProps {
  preset: PresetList
  onOpen: () => void
  onDelete: () => void
}

export function PresetCard({ preset, onOpen, onDelete }: PresetCardProps) {
  return (
    <Box bg="gray.800" borderRadius="xl" p={4} cursor="pointer" _hover={{ bg: 'gray.750' }} onClick={onOpen}>
      <Stack gap={2} align="center" textAlign="center" w="full">
        <Flex h={10} align="center" justify="center">
          <Text fontSize="3xl" lineHeight={1}>{preset.icon}</Text>
        </Flex>
        <HStack gap={1} justify="center" align="flex-start" onClick={(e) => e.stopPropagation()}>
          <Text
            fontWeight="bold"
            color="white"
            fontSize="sm"
            lineHeight={1.3}
            h="2.6em"
            overflow="hidden"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {preset.name}
          </Text>
          <ActionBtn label="Delete preset" color="gray.600" hoverColor="red.400" onClick={onDelete}>
            <Trash2 size={12} />
          </ActionBtn>
        </HStack>
      </Stack>
    </Box>
  )
}

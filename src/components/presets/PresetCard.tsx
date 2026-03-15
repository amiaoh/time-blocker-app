import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import type { PresetList } from '@/types'
import { PresetCardActions } from './PresetCardActions'

interface PresetCardProps {
  preset: PresetList
  onEdit: () => void
  onLoad: () => void
}

export function PresetCard({ preset, onEdit, onLoad }: PresetCardProps) {
  return (
    <Box
      bg="gray.800"
      borderRadius="xl"
      p={4}
      cursor="pointer"
      _hover={{ bg: 'gray.750' }}
      onClick={onEdit}
    >
      <Stack gap={2} align="center" textAlign="center">
        <Flex h={10} align="center" justify="center">
          <Text fontSize="3xl" lineHeight={1}>{preset.icon}</Text>
        </Flex>
        <Text fontWeight="bold" color="white" fontSize="sm" lineHeight={1.3}>
          {preset.name}
        </Text>
        <Box onClick={(e) => e.stopPropagation()}>
          <PresetCardActions onEdit={onEdit} onLoad={onLoad} />
        </Box>
      </Stack>
    </Box>
  )
}

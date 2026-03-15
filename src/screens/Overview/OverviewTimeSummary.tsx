import { Box, HStack, Text } from '@chakra-ui/react'
import { formatMinutes } from '@/utils/formatTime'

interface OverviewTimeSummaryProps {
  totalPlannedMin: number
  totalSpentMin: number
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Box flex={1} bg="gray.800" borderRadius="xl" px={4} py={5} textAlign="center">
      <Text fontSize="xs" color="gray.400" fontWeight="semibold" mb={1}>{label}</Text>
      <Text fontSize="2xl" fontWeight="bold" color="white" fontVariantNumeric="tabular-nums">
        {value}
      </Text>
    </Box>
  )
}

export function OverviewTimeSummary({ totalPlannedMin, totalSpentMin }: OverviewTimeSummaryProps) {
  return (
    <HStack gap={3} mb={6}>
      <StatCard label="Planned" value={formatMinutes(totalPlannedMin)} />
      <StatCard label="Spent" value={formatMinutes(totalSpentMin)} />
    </HStack>
  )
}

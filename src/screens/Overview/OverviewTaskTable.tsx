import { Box, Grid, Text } from '@chakra-ui/react'
import type { Task } from '@/types'
import { formatSeconds } from '@/utils/formatTime'

interface OverviewTaskTableProps {
  title: string
  tasks: Task[]
}

function TableHeader() {
  return (
    <Grid templateColumns="1fr 56px 56px" gap={3} px={3} pb={1}>
      <Box />
      <Text fontSize="xs" fontWeight="semibold" color="gray.400" textAlign="right">Planned</Text>
      <Text fontSize="xs" fontWeight="semibold" color="gray.400" textAlign="right">Spent</Text>
    </Grid>
  )
}

function TaskRow({ task, index }: { task: Task; index: number }) {
  const planned = formatSeconds(task.durationMin * 60)
  const spent = formatSeconds(task.spentSeconds ?? 0)
  const isOvertime = (task.spentSeconds ?? 0) > task.durationMin * 60

  return (
    <Grid
      templateColumns="1fr 56px 56px"
      gap={3}
      px={3}
      py={2}
      borderRadius="md"
      bg={index % 2 === 0 ? 'whiteAlpha.50' : 'transparent'}
      alignItems="center"
    >
      <Text fontSize="sm" color="white" lineClamp={1}>
        {task.icon} {task.title}
      </Text>
      <Text fontSize="xs" color="gray.400" fontVariantNumeric="tabular-nums" textAlign="right">
        {planned}
      </Text>
      <Text
        fontSize="xs"
        fontVariantNumeric="tabular-nums"
        color={isOvertime ? 'red.300' : 'gray.400'}
        textAlign="right"
      >
        {spent}
      </Text>
    </Grid>
  )
}

export function OverviewTaskTable({ title, tasks }: OverviewTaskTableProps) {
  if (tasks.length === 0) return null

  return (
    <Box mb={6}>
      <Text fontWeight="bold" fontSize="lg" color="white" mb={3}>{title}</Text>
      <TableHeader />
      {tasks.map((task, i) => <TaskRow key={task.id} task={task} index={i} />)}
    </Box>
  )
}

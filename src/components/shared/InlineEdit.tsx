import { useState, useRef } from 'react'
import { Input, Text } from '@chakra-ui/react'

interface InlineEditProps {
  displayValue: string
  editValue: string
  onSave: (value: string) => void
  type?: 'text' | 'number'
  min?: number
  max?: number
  fontSize?: string
  fontWeight?: string
  color?: string
  fontVariantNumeric?: string
  lineClamp?: number
  inputWidth?: string
}

export function InlineEdit({
  displayValue, editValue, onSave, type = 'text',
  min, max, fontSize, fontWeight, color, fontVariantNumeric, lineClamp, inputWidth,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(editValue)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEditing() {
    setValue(editValue)
    setIsEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commit() {
    setIsEditing(false)
    const trimmed = value.trim()
    if (!trimmed || trimmed === editValue) return
    if (type === 'number') {
      let num = Number(trimmed)
      if (Number.isNaN(num)) return
      if (min !== undefined) num = Math.max(min, num)
      if (max !== undefined) num = Math.min(max, num)
      onSave(String(num))
    } else {
      onSave(trimmed)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { setIsEditing(false) }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        type={type}
        variant="outline"
        border="none"
        outline="none"
        _focusVisible={{ boxShadow: 'none' }}
        bg="whiteAlpha.100"
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
        borderRadius="sm"
        px={1}
        h="1.5em"
        minH={0}
        width={inputWidth}
        autoFocus
      />
    )
  }

  return (
    <Text
      fontSize={fontSize} fontWeight={fontWeight} color={color}
      fontVariantNumeric={fontVariantNumeric} lineClamp={lineClamp}
      cursor="pointer" onClick={startEditing}
      _hover={{ bg: 'whiteAlpha.100', borderRadius: 'sm' }}
    >
      {displayValue}
    </Text>
  )
}

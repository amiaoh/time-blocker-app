import { useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

interface EmojiPickerPopoverProps {
  currentIcon: string
  color: string
  onSelect: (emoji: string) => void
  disabled?: boolean
}

export function EmojiPickerPopover({ currentIcon, color, onSelect, disabled }: EmojiPickerPopoverProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  return (
    <Box ref={containerRef} position="relative" flexShrink={0}>
      {/* Coloured icon square — matches original design, click to change emoji */}
      <Box
        as="button"
        w={10}
        h={10}
        borderRadius="lg"
        bg={color}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="lg"
        border="none"
        cursor={disabled ? 'default' : 'pointer'}
        opacity={disabled ? 0.6 : 1}
        onClick={() => !disabled && setOpen((v) => !v)}
        style={{ userSelect: 'none' }}
        aria-label="Change icon"
      >
        {currentIcon}
      </Box>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left={0}
          zIndex={1000}
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}
        >
          <Picker
            data={data}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
            onEmojiSelect={(emoji: { native: string }) => {
              onSelect(emoji.native)
              setOpen(false)
            }}
          />
        </Box>
      )}
    </Box>
  )
}

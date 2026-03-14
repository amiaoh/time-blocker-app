import { Box, Button } from '@chakra-ui/react'
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react'
import { useEffect, useRef, useState } from 'react'

interface EmojiPickerPopoverProps {
  currentIcon: string
  onSelect: (emoji: string) => void
  disabled?: boolean
}

export function EmojiPickerPopover({ currentIcon, onSelect, disabled }: EmojiPickerPopoverProps) {
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
      <Button
        w={10}
        h={10}
        borderRadius="lg"
        bg="inherit"
        p={0}
        minW="auto"
        fontSize="2xl"
        disabled={disabled}
        opacity={disabled ? 0.6 : 1}
        _hover={{ bg: 'whiteAlpha.200', opacity: disabled ? 0.6 : 1 }}
        onClick={() => !disabled && setOpen((v) => !v)}
        style={{ userSelect: 'none' }}
        aria-label="Change icon"
      >
        {currentIcon}
      </Button>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 4px)"
          left={0}
          zIndex={1000}
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}
        >
          <EmojiPicker
            theme={Theme.DARK}
            previewConfig={{ showPreview: false }}
            skinTonesDisabled
            onEmojiClick={(emoji: EmojiClickData) => {
              onSelect(emoji.emoji)
              setOpen(false)
            }}
          />
        </Box>
      )}
    </Box>
  )
}

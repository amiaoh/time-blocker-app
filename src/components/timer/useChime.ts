import { useRef, useCallback } from 'react'

/**
 * Synthesises a gentle bell chime using the Web Audio API.
 * No audio file needed — works offline and avoids bundle size.
 */
export function useChime() {
  const audioCtxRef = useRef<AudioContext | null>(null)

  const play = useCallback(() => {
    const ctx = audioCtxRef.current ?? new AudioContext()
    audioCtxRef.current = ctx

    const now = ctx.currentTime

    // Bell-like tone: fundamental + harmonics with quick attack, long decay
    const frequencies = [523.25, 1046.5, 1568.0] // C5, C6, G6
    const gains = [0.4, 0.2, 0.1]

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(gains[i] ?? 0.1, now + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.5)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 2.5)
    })
  }, [])

  return { play }
}

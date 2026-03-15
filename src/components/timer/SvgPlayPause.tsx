import { CX, CY, PLAY_BTN_R, PLAY_BTN_BG_IDLE, PLAY_BTN_BG_ACTIVE, TICK_COLOR } from './timerGeometry'

interface SvgPlayPauseProps {
  isRunning: boolean
  isIdle: boolean
}

export function SvgPlayPause({ isRunning, isIdle }: SvgPlayPauseProps) {
  return (
    <>
      <circle
        cx={CX} cy={CY} r={PLAY_BTN_R}
        fill={isIdle ? PLAY_BTN_BG_IDLE : PLAY_BTN_BG_ACTIVE}
        style={{ pointerEvents: 'none' }}
      />
      <text
        x={CX} y={CY + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={15}
        fill={isIdle ? TICK_COLOR : 'white'}
        aria-hidden="true"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {isRunning ? '⏸' : '▶'}
      </text>
    </>
  )
}

import { CX, CY, PLAY_BTN_R, PLAY_BTN_BG_IDLE, PLAY_BTN_BG_ACTIVE, TICK_COLOR } from './timerGeometry'

interface SvgPlayPauseProps {
  isRunning: boolean
  isIdle: boolean
  onClick?: () => void
}

export function SvgPlayPause({ isRunning, isIdle, onClick }: SvgPlayPauseProps) {
  return (
    <>
      <circle
        cx={CX} cy={CY} r={PLAY_BTN_R}
        fill={isIdle ? PLAY_BTN_BG_IDLE : PLAY_BTN_BG_ACTIVE}
        style={{ cursor: onClick ? 'pointer' : 'default', outline: 'none' }}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        tabIndex={onClick ? 0 : undefined}
      />
      <text
        x={CX} y={CY + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={15}
        fill={isIdle ? TICK_COLOR : 'white'}
        aria-hidden="true"
        style={{ cursor: onClick ? 'pointer' : 'default', pointerEvents: 'none', userSelect: 'none' }}
      >
        {isRunning ? '⏸' : '▶'}
      </text>
    </>
  )
}

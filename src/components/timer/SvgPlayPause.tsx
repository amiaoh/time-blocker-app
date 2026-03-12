import { CX, CY } from './timerGeometry'

interface SvgPlayPauseProps {
  isRunning: boolean
  isIdle: boolean
  onClick?: () => void
}

export function SvgPlayPause({ isRunning, isIdle, onClick }: SvgPlayPauseProps) {
  return (
    <>
      <circle
        cx={CX} cy={CY} r={28}
        fill={isIdle ? '#2D3748' : '#0F0F0F'}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
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
        fill={isIdle ? '#4A5568' : 'white'}
        aria-hidden="true"
        style={{ cursor: onClick ? 'pointer' : 'default', pointerEvents: 'none', userSelect: 'none' }}
      >
        {isRunning ? '⏸' : '▶'}
      </text>
    </>
  )
}

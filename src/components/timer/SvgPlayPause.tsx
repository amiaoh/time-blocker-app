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
      {isRunning ? (
        <>
          <rect x={CX - 5.5} y={CY - 7} width={4} height={14} rx={1} fill={isIdle ? TICK_COLOR : 'white'} style={{ pointerEvents: 'none' }} />
          <rect x={CX + 1.5} y={CY - 7} width={4} height={14} rx={1} fill={isIdle ? TICK_COLOR : 'white'} style={{ pointerEvents: 'none' }} />
        </>
      ) : (
        <polygon
          points={`${CX - 5},${CY - 8} ${CX + 9},${CY} ${CX - 5},${CY + 8}`}
          fill={isIdle ? TICK_COLOR : 'white'}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </>
  )
}

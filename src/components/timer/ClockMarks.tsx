import { OUTER_R, INNER_MARKER_R, CLOCK_MARKS, TICK_COLOR, TICK_LABEL_COLOR, polarToXY } from './timerGeometry'

export function ClockMarks() {
  return (
    <>
      {CLOCK_MARKS.map((mark) => {
        const angleDeg = (mark / 60) * 360
        const outer = polarToXY(angleDeg, OUTER_R)
        const inner = polarToXY(angleDeg, INNER_MARKER_R + 4)
        const label = polarToXY(angleDeg, OUTER_R + 10)
        return (
          <g key={mark}>
            <line
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke={TICK_COLOR}
              strokeWidth={mark === 0 ? 2 : 1}
            />
            <text
              x={label.x} y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fill={TICK_LABEL_COLOR}
              fontFamily="system-ui, sans-serif"
            >
              {mark}
            </text>
          </g>
        )
      })}
    </>
  )
}

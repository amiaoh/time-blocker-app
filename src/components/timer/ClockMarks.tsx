import { OUTER_R, INNER_MARKER_R, LABEL_R, polarToXY } from './timerGeometry'

const MARKS = Array.from({ length: 12 }, (_, i) => i * 5)

export function ClockMarks() {
  return (
    <>
      {MARKS.map((mark) => {
        const angleDeg = (mark / 60) * 360
        const outer = polarToXY(angleDeg, OUTER_R)
        const inner = polarToXY(angleDeg, INNER_MARKER_R + 4)
        const label = polarToXY(angleDeg, LABEL_R + 40)
        return (
          <g key={mark}>
            <line
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke="#4A5568"
              strokeWidth={mark === 0 ? 2 : 1}
            />
            <text
              x={label.x} y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fill="#718096"
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

// Isotipo de la guía: anzuelo geométrico (neón verde) que atraviesa
// una calabaza pixelada (resplandor naranja desde sus "píxeles" vacíos).
const PIXELES_CALABAZA = [
  "..XXXX..",
  ".XXXXXX.",
  "XX.XX.XX",
  "XXXXXXXX",
  "X.X..X.X",
  ".XXXXXX.",
];

export function Calabaza({ size = 40, brillo = true }) {
  const celdas = [];
  PIXELES_CALABAZA.forEach((fila, y) =>
    [...fila].forEach((c, x) => {
      if (c === "X") celdas.push(<rect key={`${x}-${y}`} x={x * 4} y={y * 4 + 4} width="4" height="4" fill="#FF6B00" />);
      else if (y > 1 && y < 5) celdas.push(<rect key={`${x}-${y}`} x={x * 4} y={y * 4 + 4} width="4" height="4" fill="#FFB800" />);
    })
  );
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden style={brillo ? { filter: "drop-shadow(0 0 6px rgba(255,107,0,.55))" } : undefined}>
      <rect x="14" y="0" width="4" height="4" fill="#00FF9D" />
      {celdas}
    </svg>
  );
}

export default function Logo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden className="logo-svg">
      <g style={{ filter: "drop-shadow(0 0 6px rgba(255,107,0,.5))" }}>
        {PIXELES_CALABAZA.map((fila, y) =>
          [...fila].map((c, x) =>
            c === "X" ? (
              <rect key={`${x}-${y}`} x={8 + x * 4} y={20 + y * 4} width="4" height="4" fill="#FF6B00" />
            ) : y > 1 && y < 5 ? (
              <rect key={`${x}-${y}`} x={8 + x * 4} y={20 + y * 4} width="4" height="4" fill="#FFB800" opacity=".9" />
            ) : null
          )
        )}
      </g>
      {/* anzuelo geométrico: argolla, caña recta y punta con lengüeta, en ángulos rectos */}
      <g fill="none" stroke="#00FF9D" strokeWidth="2.5" strokeLinecap="square" style={{ filter: "drop-shadow(0 0 4px rgba(0,255,157,.7))" }}>
        <rect x="26" y="2" width="6" height="5" />
        <path d="M29 7 V38 H18 V30" />
        <path d="M18 30 L22 34" />
      </g>
    </svg>
  );
}

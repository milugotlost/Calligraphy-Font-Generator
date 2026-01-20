import React, { useRef, useEffect } from 'react';
import { TextConfig, SealConfig } from '../types';

interface SVGCanvasProps {
  config: TextConfig;
  seal: SealConfig;
  setSeal: (seal: SealConfig) => void;
  onExport: (svgString: string) => void;
  forwardedRef: React.RefObject<SVGSVGElement>;
}

export const SVGCanvas: React.FC<SVGCanvasProps> = ({ config, seal, setSeal, onExport, forwardedRef }) => {
  const { text, fontSize, letterSpacing, lineHeight, layout, font, color, backgroundColor, showGrid, padding } = config;

  // Split text into lines
  const lines = text.split('\n');

  // Calculate dimensions
  // NOTE: For Chinese characters, width roughly equals height (em square).
  const charSize = fontSize;

  // Calculate Canvas Size
  let canvasWidth = 0;
  let canvasHeight = 0;

  // Helper to get font family string
  const getFontFamily = () => {
    switch (font) {
      case 'lishu':
        // Priority: Embedded MoeLi -> MOE Standard Lishu -> Commercial (Arphic) -> Windows System -> Web Fallback
        return "'MoeLi', '教育部標準隸書', 'MOEStandardLishu', 'MOE Lishu', '文鼎隸書_B', 'AR LiShuB5 BD', 'LiSu', 'Lishu', '隶书', 'SimLi', 'ZCOOL XiaoWei', serif";
      case 'kaishu':
        return "'Ma Shan Zheng', cursive";
      case 'serif':
        return "'Noto Serif TC', serif";
      default:
        return "'ZCOOL XiaoWei', serif";
    }
  };

  // Layout Logic
  // We compute the position of every character manually to ensure perfect vertical/horizontal alignment in SVG
  // This avoids browser inconsistencies with `writing-mode`.

  interface CharData {
    char: string;
    x: number;
    y: number;
  }

  const charsToRender: CharData[] = [];

  if (layout === 'horizontal') {
    // Horizontal: Lines flow Top to Bottom. Chars flow Left to Right.
    const maxLineLength = Math.max(...lines.map(l => l.length));

    canvasWidth = (padding * 2) + (maxLineLength * charSize) + ((maxLineLength - 1) * letterSpacing);
    canvasHeight = (padding * 2) + (lines.length * charSize) + ((lines.length - 1) * lineHeight);

    lines.forEach((line, rowIndex) => {
      const y = padding + rowIndex * (charSize + lineHeight) + (charSize * 0.85); // Baseline adjustment

      (Array.from(line) as string[]).forEach((char, colIndex) => {
        const x = padding + colIndex * (charSize + letterSpacing);
        charsToRender.push({ char, x, y });
      });
    });
  } else {
    // Vertical: Columns flow Right to Left. Chars flow Top to Bottom.
    const maxLineLength = Math.max(...lines.map(l => l.length));

    // Width = Number of lines * (charSize + spacing between lines)
    canvasWidth = (padding * 2) + (lines.length * charSize) + ((lines.length - 1) * lineHeight);
    // Height = Max chars in a line * (charSize + spacing between chars)
    canvasHeight = (padding * 2) + (maxLineLength * charSize) + ((maxLineLength - 1) * letterSpacing);

    lines.forEach((line, lineIndex) => {
      // Lines go from Right to Left.
      // x = Width - padding - (lineIndex + 1) * charSize - (lineIndex * lineSpacing)
      // Actually, let's anchor left of the char.
      // Rightmost column is lineIndex 0.

      const x = canvasWidth - padding - (lineIndex + 1) * charSize - (lineIndex * lineHeight);

      (Array.from(line) as string[]).forEach((char, charIndex) => {
        const y = padding + charIndex * (charSize + letterSpacing) + (charSize * 0.85); // Baseline adjustment
        charsToRender.push({ char, x, y });
      });
    });
  }

  // Ensure minimum canvas size
  canvasWidth = Math.max(canvasWidth, 300);
  canvasHeight = Math.max(canvasHeight, 300);

  // Handle Dragging Seal
  const isDraggingSeal = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleSealMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingSeal.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSeal.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    setSeal({
      ...seal,
      x: seal.x + dx,
      y: seal.y + dy
    });
  };

  const handleMouseUp = () => {
    isDraggingSeal.current = false;
  };

  return (
    <div
      className="overflow-auto border border-stone-300 bg-stone-100 shadow-inner rounded-lg p-4 flex justify-center items-center min-h-[400px]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        ref={forwardedRef}
        width={canvasWidth}
        height={canvasHeight}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className="bg-white shadow-lg cursor-default"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Background Texture Effect (Simple noise or gradient could be added here, sticking to solid color for SVG purity for now) */}

        {/* Grid Lines if enabled */}
        {showGrid && (
          <g stroke="#e5e5e5" strokeWidth="1" fill="none">
            {/* This is a simplified grid approximation */}
            {layout === 'vertical'
              ? lines.map((_, i) => {
                const x = canvasWidth - padding - (i + 1) * charSize - (i * lineHeight);
                return (
                  <rect
                    key={`grid-col-${i}`}
                    x={x}
                    y={padding}
                    width={charSize}
                    height={canvasHeight - 2 * padding}
                  />
                )
              })
              : lines.map((_, i) => {
                const y = padding + i * (charSize + lineHeight);
                return (
                  <rect
                    key={`grid-row-${i}`}
                    x={padding}
                    y={y}
                    width={canvasWidth - 2 * padding}
                    height={charSize}
                  />
                )
              })
            }
          </g>
        )}

        {/* Text */}
        <g
          fontFamily={getFontFamily()}
          fontSize={fontSize}
          fill={color}
          style={{ whiteSpace: 'pre' }}
        >
          {charsToRender.map((c, i) => (
            <text key={i} x={c.x} y={c.y}>{c.char}</text>
          ))}
        </g>

        {/* Seal */}
        {seal.visible && (
          <g
            transform={`translate(${seal.x}, ${seal.y})`}
            onMouseDown={handleSealMouseDown}
            style={{ cursor: 'move' }}
            className="select-none"
          >
            <rect width={seal.size} height={seal.size} fill="#b91c1c" rx="4" />
            <text
              x={seal.size / 2}
              y={seal.size / 2 + (seal.size * 0.2)}
              fontSize={seal.size * 0.4}
              fill="white"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Ma Shan Zheng', cursive" // Always use calligraphy for seal
            >
              {/* Very basic split for seal text to wrap 4 chars into 2x2 if possible */}
              {seal.text.length <= 2 ? seal.text : (
                <>
                  <tspan x={seal.size / 2} dy={-seal.size * 0.15}>{seal.text.slice(0, Math.ceil(seal.text.length / 2))}</tspan>
                  <tspan x={seal.size / 2} dy={seal.size * 0.35}>{seal.text.slice(Math.ceil(seal.text.length / 2))}</tspan>
                </>
              )}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
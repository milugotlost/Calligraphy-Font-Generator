import React, { useState, useRef } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { SVGCanvas } from './components/SVGCanvas';
import { TextConfig, SealConfig } from './types';
import saveAs from 'file-saver';
import { Brush, Sparkles } from 'lucide-react';
import opentype from 'opentype.js';
// Import font file directly to get the hashed URL processed by Vite
// @ts-ignore - Importing ttf is valid in Vite but TS might complain without specific config
import fontUrl from './assets/fonts/MoeLi.ttf';

const DEFAULT_TEXT = `隸書
風格
生成`;

const App: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [config, setConfig] = useState<TextConfig>({
    text: DEFAULT_TEXT,
    fontSize: 80,
    letterSpacing: 10,
    lineHeight: 20,
    layout: 'vertical',
    font: 'lishu', // Default to Lishu
    color: '#1c1917', // stone-900
    backgroundColor: '#fdfbf7', // warm paper
    showGrid: false,
    padding: 60,
    transparentBg: false,
  });

  const [seal, setSeal] = useState<SealConfig>({
    text: '墨寶',
    size: 60,
    x: 100,
    y: 300,
    visible: true,
  });

  // Helper: Convert Blob to Base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Helper: Load font using opentype.js
  const loadFont = async (): Promise<opentype.Font> => {
    return new Promise((resolve, reject) => {
      opentype.load(fontUrl, (err, font) => {
        if (err || !font) {
          reject(err || new Error('Failed to load font'));
        } else {
          resolve(font);
        }
      });
    });
  };

  // Helper: Convert text element to path using opentype.js
  const textToPath = (
    font: opentype.Font,
    text: string,
    x: number,
    y: number,
    fontSize: number
  ): string => {
    const path = font.getPath(text, x, y, fontSize);
    return path.toSVG(2); // precision = 2 decimal places
  };

  // Main export function with text-to-path conversion
  const handleExport = async (format: 'svg' | 'png' = 'svg') => {
    if (!svgRef.current || isExporting) return;

    setIsExporting(true);

    try {
      console.log('[Export] Loading font for text-to-path conversion...');
      const font = await loadFont();
      console.log('[Export] Font loaded successfully');

      // Clone the SVG to avoid modifying the original
      const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;

      // Find all text elements and convert to paths
      const textElements = svgClone.querySelectorAll('text');
      console.log(`[Export] Found ${textElements.length} text elements to convert`);

      textElements.forEach((textEl) => {
        const text = textEl.textContent || '';
        if (!text.trim()) return;

        const x = parseFloat(textEl.getAttribute('x') || '0');
        const y = parseFloat(textEl.getAttribute('y') || '0');
        const fill = textEl.getAttribute('fill') || textEl.closest('g')?.getAttribute('fill') || '#000';

        // Get font size from parent g or element itself
        const parentG = textEl.closest('g');
        let fontSize = 80; // default
        if (parentG) {
          const fsSrc = parentG.getAttribute('font-size');
          if (fsSrc) fontSize = parseFloat(fsSrc);
        }
        const elFontSize = textEl.getAttribute('font-size');
        if (elFontSize) fontSize = parseFloat(elFontSize);

        // Convert text to path SVG string
        const pathSvg = textToPath(font, text, x, y, fontSize);

        // Parse the path SVG and create a proper path element
        const parser = new DOMParser();
        const pathDoc = parser.parseFromString(pathSvg, 'image/svg+xml');
        const pathEl = pathDoc.querySelector('path');

        if (pathEl) {
          pathEl.setAttribute('fill', fill);
          // Replace text element with path element
          textEl.parentNode?.replaceChild(pathEl, textEl);
        }
      });

      // Serialize the modified SVG
      let svgData = new XMLSerializer().serializeToString(svgClone);

      // Clean up any xmlns issues from parsing
      svgData = svgData.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '');

      if (format === 'svg') {
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        saveAs(svgBlob, `calligraphy-outlined-${Date.now()}.svg`);
        console.log('[Export] SVG with outlined text saved');
      } else {
        // For PNG, we still need to embed font for the image rendering
        // But since text is now paths, we don't need the font
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const width = svgClone.getAttribute('width') ? Number(svgClone.getAttribute('width')) : 1000;
        const height = svgClone.getAttribute('height') ? Number(svgClone.getAttribute('height')) : 1000;

        const scale = 2;
        canvas.width = width * scale;
        canvas.height = height * scale;

        if (ctx) {
          ctx.scale(scale, scale);
        }

        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                saveAs(blob, `calligraphy-${Date.now()}.png`);
                console.log('[Export] PNG saved');
              }
              URL.revokeObjectURL(url);
              setIsExporting(false);
            }, 'image/png');
          }
        };

        img.onerror = (e) => {
          console.error("Image load failed", e);
          alert("圖片生成失敗，可能是字體檔案過大或記憶體不足。");
          setIsExporting(false);
        };

        img.src = url;
        return; // Early return to keep isExporting true until callback
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert(`匯出失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }

    setIsExporting(false);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--gradient-paper)' }}>
      {/* Header - 精緻水墨風格 */}
      <header
        className="py-8 px-6 mb-10 shadow-xl relative overflow-hidden"
        style={{ background: 'var(--gradient-header)' }}
      >
        {/* 裝飾性背景元素 */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(201, 162, 39, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201, 162, 39, 0.2) 0%, transparent 40%)'
          }}
        />

        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'var(--gradient-gold)' }}
            >
              <Brush size={28} className="text-stone-900" />
            </div>
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold tracking-widest"
                style={{
                  color: 'var(--color-paper-cream)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                書法字體生成器
              </h1>
              <p className="text-sm mt-1 tracking-wide" style={{ color: 'var(--color-gold-light)' }}>
                Calligraphy Generator | SVG Export
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-sm" style={{ color: 'var(--color-ink-faint)' }}>
            <Sparkles size={16} style={{ color: 'var(--color-gold-primary)' }} />
            <span>React + TypeScript + SVG</span>
          </div>
        </div>

        {/* 底部金色裝飾線 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: 'var(--gradient-gold)' }}
        />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <ControlPanel
            config={config}
            setConfig={setConfig}
            seal={seal}
            setSeal={setSeal}
            onDownload={handleExport}
            isExporting={isExporting}
          />
        </div>

        {/* Right Column: Preview (8 cols) */}
        <div className="lg:col-span-8 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center mb-5">
            <h2
              className="text-xl font-bold heading-decorated"
              style={{ color: 'var(--color-ink-dark)' }}
            >
              預覽 (Preview)
            </h2>
            <span
              className="text-sm px-4 py-2 rounded-full font-medium"
              style={{
                background: 'rgba(201, 162, 39, 0.15)',
                color: 'var(--color-gold-dark)',
                border: '1px solid rgba(201, 162, 39, 0.3)'
              }}
            >
              {config.layout === 'vertical' ? '📜 直書模式' : '📖 橫書模式'}
            </span>
          </div>
          <SVGCanvas
            config={config}
            seal={seal}
            setSeal={setSeal}
            onExport={() => handleExport('svg')}
            forwardedRef={svgRef}
          />
          <p
            className="mt-5 text-sm text-center leading-relaxed"
            style={{ color: 'var(--color-ink-light)' }}
          >
            💡 提示：您可以拖曳紅色印章調整位置。
            <br />
            <span style={{ color: 'var(--color-ink-faint)' }}>
              📝 匯出的 SVG 文字已轉為路徑，可在任何軟體中正確顯示。
            </span>
          </p>
        </div>

      </main>
    </div>
  );
};

export default App;
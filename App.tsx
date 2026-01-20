import React, { useState, useRef } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { SVGCanvas } from './components/SVGCanvas';
import { TextConfig, SealConfig } from './types';
import saveAs from 'file-saver';
import { Brush, Sparkles } from 'lucide-react';

const DEFAULT_TEXT = `隸書
風格
生成`;

const App: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

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

  const handleExport = (format: 'svg' | 'png' = 'svg') => {
    if (!svgRef.current) return;

    if (format === 'svg') {
      // 匯出 SVG
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      saveAs(svgBlob, `calligraphy-${Date.now()}.svg`);
    } else {
      // 匯出 PNG
      const svg = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      // 設定 Canvas 尺寸
      const width = svg.getAttribute('width') ? Number(svg.getAttribute('width')) : 1000;
      const height = svg.getAttribute('height') ? Number(svg.getAttribute('height')) : 1000;
      canvas.width = width;
      canvas.height = height;

      // 轉換 SVG 為 Blob URL
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, `calligraphy-${Date.now()}.png`);
            }
            URL.revokeObjectURL(url);
          }, 'image/png');
        }
      };

      img.src = url;
    }
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
            💡 提示：您可以拖曳紅色印章調整位置。下載格式為 SVG 向量檔。
            <br />
            <span style={{ color: 'var(--color-ink-faint)' }}>
              註：優先使用「教育部標準隸書」。請確保您的電腦已安裝該字體。
            </span>
          </p>
        </div>

      </main>
    </div>
  );
};

export default App;
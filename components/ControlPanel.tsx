import React from 'react';
import { TextConfig, SealConfig, LayoutMode, FontStyle } from '../types';
import { AlignVerticalSpaceAround, AlignHorizontalSpaceAround, Type, Grid3X3, Download, Palette, Settings2 } from 'lucide-react';

interface ControlPanelProps {
  config: TextConfig;
  setConfig: (config: TextConfig) => void;
  seal: SealConfig;
  setSeal: (seal: SealConfig) => void;
  onDownload: (format: 'svg' | 'png') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig, seal, setSeal, onDownload }) => {

  const updateConfig = <K extends keyof TextConfig>(key: K, value: TextConfig[K]) => {
    setConfig({ ...config, [key]: value });
  };

  const updateSeal = <K extends keyof SealConfig>(key: K, value: SealConfig[K]) => {
    setSeal({ ...seal, [key]: value });
  };

  return (
    <div className="card space-y-8">

      {/* Card Header */}
      <div className="card-header flex items-center gap-3">
        <Settings2 size={20} style={{ color: 'var(--color-gold-primary)' }} />
        <h3 className="font-bold text-lg" style={{ color: 'var(--color-ink-dark)' }}>控制面板</h3>
      </div>

      {/* Input Text - 白底黑字 */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold" style={{ color: 'var(--color-ink-medium)' }}>
          📝 內容 (Text)
        </label>
        <textarea
          className="textarea-calligraphy w-full min-h-[140px]"
          value={config.text}
          onChange={(e) => updateConfig('text', e.target.value)}
          placeholder="在此輸入文字..."
        />
      </div>

      {/* Layout & Font */}
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-3">
          <label className="block text-sm font-semibold" style={{ color: 'var(--color-ink-medium)' }}>
            ↕️ 排列 (Layout)
          </label>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: '2px solid var(--color-paper-antique)' }}
          >
            <button
              onClick={() => updateConfig('layout', 'vertical')}
              className="flex-1 p-3 flex justify-center items-center gap-2 font-medium transition-all duration-200"
              style={{
                background: config.layout === 'vertical' ? 'var(--color-ink-dark)' : 'white',
                color: config.layout === 'vertical' ? 'var(--color-paper-cream)' : 'var(--color-ink-medium)'
              }}
            >
              <AlignVerticalSpaceAround size={18} /> 直書
            </button>
            <button
              onClick={() => updateConfig('layout', 'horizontal')}
              className="flex-1 p-3 flex justify-center items-center gap-2 font-medium transition-all duration-200"
              style={{
                background: config.layout === 'horizontal' ? 'var(--color-ink-dark)' : 'white',
                color: config.layout === 'horizontal' ? 'var(--color-paper-cream)' : 'var(--color-ink-medium)'
              }}
            >
              <AlignHorizontalSpaceAround size={18} /> 橫書
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold" style={{ color: 'var(--color-ink-medium)' }}>
            🖌️ 字體 (Style)
          </label>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: '2px solid var(--color-paper-antique)' }}
          >
            <button
              onClick={() => updateConfig('font', 'lishu')}
              className="flex-1 p-3 flex justify-center items-center font-medium transition-all duration-200"
              style={{
                background: config.font === 'lishu' ? 'var(--color-ink-dark)' : 'white',
                color: config.font === 'lishu' ? 'var(--color-paper-cream)' : 'var(--color-ink-medium)'
              }}
              title="優先使用：教育部標準隸書 / 文鼎隸書"
            >
              <span className="font-lishu text-lg">隸書</span>
            </button>
            <button
              onClick={() => updateConfig('font', 'kaishu')}
              className="flex-1 p-3 flex justify-center items-center font-medium transition-all duration-200"
              style={{
                background: config.font === 'kaishu' ? 'var(--color-ink-dark)' : 'white',
                color: config.font === 'kaishu' ? 'var(--color-paper-cream)' : 'var(--color-ink-medium)'
              }}
              title="Ma Shan Zheng"
            >
              <span className="font-kaishu text-lg">行楷</span>
            </button>
            <button
              onClick={() => updateConfig('font', 'serif')}
              className="flex-1 p-3 flex justify-center items-center font-medium transition-all duration-200"
              style={{
                background: config.font === 'serif' ? 'var(--color-ink-dark)' : 'white',
                color: config.font === 'serif' ? 'var(--color-paper-cream)' : 'var(--color-ink-medium)'
              }}
            >
              <span className="font-serif-tc text-lg">明體</span>
            </button>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
            隸書優先順序：教育部標準隸書 → 文鼎/AR → 系統內建 → ZCOOL
          </p>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--color-ink-light)' }}>
            <span>字體大小 (Size)</span>
            <span className="font-mono font-bold" style={{ color: 'var(--color-gold-dark)' }}>{config.fontSize}px</span>
          </div>
          <input
            type="range" min="20" max="200" value={config.fontSize}
            onChange={(e) => updateConfig('fontSize', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--color-ink-light)' }}>
            <span>字元間距 (Char Spacing)</span>
            <span className="font-mono font-bold" style={{ color: 'var(--color-gold-dark)' }}>{config.letterSpacing}px</span>
          </div>
          <input
            type="range" min="0" max="100" value={config.letterSpacing}
            onChange={(e) => updateConfig('letterSpacing', Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--color-ink-light)' }}>
            <span>行距 (Line Height)</span>
            <span className="font-mono font-bold" style={{ color: 'var(--color-gold-dark)' }}>{config.lineHeight}px</span>
          </div>
          <input
            type="range" min="0" max="150" value={config.lineHeight}
            onChange={(e) => updateConfig('lineHeight', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Colors & Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--color-ink-medium)' }}>
          <Palette size={16} /> 顏色設定
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm" style={{ color: 'var(--color-ink-light)' }}>墨色 (Ink)</label>
            <input
              type="color"
              value={config.color}
              onChange={(e) => updateConfig('color', e.target.value)}
              className="h-12 w-full cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm" style={{ color: 'var(--color-ink-light)' }}>紙色 (Paper)</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                disabled={config.transparentBg}
                className={`h-12 w-full cursor-pointer transition-opacity ${config.transparentBg ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* 透明背景開關 */}
        <label className="flex items-center gap-2 cursor-pointer select-none border border-stone-200 rounded-lg p-3 hover:bg-stone-50 transition-colors">
          <input
            type="checkbox"
            checked={config.transparentBg}
            onChange={(e) => updateConfig('transparentBg', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium" style={{ color: 'var(--color-ink-medium)' }}>
            ✨ 使用透明背景 (Transparent Background)
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="showGrid"
            type="checkbox"
            checked={config.showGrid}
            onChange={(e) => updateConfig('showGrid', e.target.checked)}
          />
          <span className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--color-ink-medium)' }}>
            <Grid3X3 size={16} /> 顯示格線
          </span>
        </label>
      </div>

      <hr style={{ borderColor: 'var(--color-paper-antique)' }} />

      {/* Seal Settings */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold" style={{ color: 'var(--color-ink-medium)' }}>
            🔴 落款印章 (Seal)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={seal.visible}
              onChange={(e) => updateSeal('visible', e.target.checked)}
            />
            <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>顯示</span>
          </label>
        </div>
        {seal.visible && (
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={seal.text}
              onChange={(e) => updateSeal('text', e.target.value)}
              maxLength={4}
              placeholder="印章文字"
              className="input-primary text-sm"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>大小</span>
              <input
                type="range" min="30" max="150"
                value={seal.size}
                onChange={(e) => updateSeal('size', Number(e.target.value))}
                className="flex-1"
                style={{ accentColor: 'var(--color-seal-red)' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => onDownload('svg')}
          className="btn-primary w-full py-3 text-base flex flex-col items-center justify-center gap-1"
        >
          <div className="flex items-center gap-2">
            <Download size={20} />
            <span>SVG</span>
          </div>
          <span className="text-xs opacity-80 font-normal">向量 (Vector)</span>
        </button>
        <button
          onClick={() => onDownload('png')}
          className="btn-primary w-full py-3 text-base flex flex-col items-center justify-center gap-1"
          style={{ background: 'var(--color-ink-medium)' }}
        >
          <div className="flex items-center gap-2">
            <Download size={20} />
            <span>PNG</span>
          </div>
          <span className="text-xs opacity-80 font-normal">圖檔 (Image)</span>
        </button>
      </div>

    </div>
  );
};
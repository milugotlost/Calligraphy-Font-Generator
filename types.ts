export type LayoutMode = 'vertical' | 'horizontal';

export type FontStyle = 'lishu' | 'kaishu' | 'serif';

export interface TextConfig {
  text: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  layout: LayoutMode;
  font: FontStyle;
  color: string;
  backgroundColor: string;
  showGrid: boolean;
  padding: number;
}

export interface SealConfig {
  text: string;
  size: number;
  x: number;
  y: number;
  visible: boolean;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
}
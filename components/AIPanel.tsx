import React, { useState } from 'react';
import { Sparkles, PenTool, Stamp } from 'lucide-react';
import { generatePoem, suggestSealText } from '../services/geminiService';

interface AIPanelProps {
  onApplyText: (text: string) => void;
  onApplySeal: (text: string) => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({ onApplyText, onApplySeal }) => {
  const [topic, setTopic] = useState('');
  const [loadingText, setLoadingText] = useState(false);
  
  const [name, setName] = useState('');
  const [loadingSeal, setLoadingSeal] = useState(false);

  const handleGeneratePoem = async () => {
    if (!topic.trim()) return;
    setLoadingText(true);
    try {
        const result = await generatePoem(topic);
        if (result) onApplyText(result);
    } catch (e) {
        alert("AI 生成失敗，請檢查 API Key 或稍後再試。");
    } finally {
        setLoadingText(false);
    }
  };

  const handleGenerateSeal = async () => {
    if (!name.trim()) return;
    setLoadingSeal(true);
    try {
        const result = await suggestSealText(name);
        if (result) onApplySeal(result);
    } catch (e) {
        alert("AI 生成失敗");
    } finally {
        setLoadingSeal(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5 space-y-6 shadow-sm">
        <div className="flex items-center space-x-2 text-amber-900 border-b border-amber-200 pb-2">
            <Sparkles size={20} />
            <h3 className="font-bold">AI 書法助手 (Gemini)</h3>
        </div>

        {/* Poem Generator */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-amber-800 flex items-center">
                <PenTool size={14} className="mr-1"/> 靈感創作
            </label>
            <div className="flex space-x-2">
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="輸入主題 (例如: 春節, 靜心)"
                    className="flex-1 p-2 text-sm border border-amber-200 rounded focus:ring-amber-500 focus:border-amber-500 bg-white"
                />
                <button 
                    onClick={handleGeneratePoem}
                    disabled={loadingText || !topic}
                    className="px-4 py-2 bg-amber-700 text-white text-sm rounded hover:bg-amber-800 disabled:opacity-50 transition-colors"
                >
                    {loadingText ? '...' : '生成'}
                </button>
            </div>
            <p className="text-xs text-amber-700 opacity-70">
                AI 將為您撰寫適合書法的詩詞或對聯。
            </p>
        </div>

        {/* Seal Generator */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-amber-800 flex items-center">
                <Stamp size={14} className="mr-1"/> 印章設計
            </label>
            <div className="flex space-x-2">
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="輸入名字"
                    className="flex-1 p-2 text-sm border border-amber-200 rounded focus:ring-amber-500 focus:border-amber-500 bg-white"
                />
                <button 
                    onClick={handleGenerateSeal}
                    disabled={loadingSeal || !name}
                    className="px-4 py-2 bg-amber-700 text-white text-sm rounded hover:bg-amber-800 disabled:opacity-50 transition-colors"
                >
                    {loadingSeal ? '...' : '設計'}
                </button>
            </div>
        </div>
    </div>
  );
};
import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePoem = async (topic: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `請以「${topic}」為主題，創作一首繁體中文的四句五言或七言絕句，或者一副對聯。
    請只回傳詩詞內容，不要有標題或額外的解釋。
    確保格式適合書法作品（例如使用換行分隔）。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const suggestSealText = async (name: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `請為名字「${name}」設計一個適合書法落款的印章文字（2-4字）。
    例如：「王小明」可以是「王氏小明」或「小明之印」或「翰墨」。
    請只回傳印章上的文字，不要有其他解釋。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Clean up potential extra characters
    let text = response.text?.trim() || "";
    text = text.replace(/[「」"'\n]/g, '');
    return text.substring(0, 4); 
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
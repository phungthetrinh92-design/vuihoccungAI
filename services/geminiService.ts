
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateGdtcQuestions = async (): Promise<Question[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Hãy tạo 5 câu hỏi trắc nghiệm môn Giáo dục thể chất lớp 1 cho trẻ em Việt Nam. Nội dung xoay quanh: tư thế đứng nghiêm, đứng nghỉ, quay phải, quay trái, dậm chân tại chỗ hoặc các trò chơi vận động đơn giản. Ngôn ngữ phù hợp với lứa tuổi 6 tuổi.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            content: { type: Type.STRING, description: "Nội dung câu hỏi" },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Danh sách 3 lựa chọn A, B, C"
            },
            correctAnswer: { type: Type.STRING, description: "Lựa chọn đúng (ví dụ: 'A. ...')" },
            explanation: { type: Type.STRING, description: "Giải thích ngắn gọn tại sao đúng" }
          },
          required: ["id", "content", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Không nhận được dữ liệu từ AI");
  return JSON.parse(text.trim());
};

export const generateAudio = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Đọc chậm rãi và vui vẻ câu hỏi sau: ${text}` }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Không thể tạo âm thanh");
  return base64Audio;
};

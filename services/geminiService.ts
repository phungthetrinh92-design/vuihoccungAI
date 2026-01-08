
import { Question } from "../types";

/**
 * Generates GDTC questions by calling the internal Vercel API
 */
export const generateGdtcQuestions = async (): Promise<Question[]> => {
  const prompt = "Hãy tạo 5 câu hỏi trắc nghiệm môn Giáo dục thể chất lớp 1 cho trẻ em Việt Nam. Nội dung xoay quanh: tư thế đứng nghiêm, đứng nghỉ, quay phải, quay trái, dậm chân tại chỗ hoặc các trò chơi vận động đơn giản. Ngôn ngữ phù hợp với lứa tuổi 6 tuổi.";

  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Không thể tạo câu hỏi");
  }

  const data = await response.json();
  if (!data.text) throw new Error("Không nhận được dữ liệu từ AI");
  
  return JSON.parse(data.text.trim());
};

/**
 * Generates Audio (TTS) by calling the internal Vercel API
 */
export const generateAudio = async (text: string): Promise<string> => {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `Đọc chậm rãi và vui vẻ câu hỏi sau: ${text}`,
      model: "gemini-2.5-flash-preview-tts",
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Không thể tạo âm thanh");
  }

  const data = await response.json();
  if (!data.text) throw new Error("Dữ liệu âm thanh trống");
  
  return data.text;
};


import React, { useState } from 'react';
import { Question } from '../types';
import { generateAudio } from '../services/geminiService';
import { playPcmAudio } from '../utils/audioUtils';

interface Props {
  question: Question;
  index: number;
}

const QuestionCard: React.FC<Props> = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64 = await generateAudio(question.content + ". Các lựa chọn là: " + question.options.join(", "));
      await playPcmAudio(base64);
    } catch (error) {
      console.error("Audio error:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const getOptionStatus = (option: string) => {
    if (!selectedOption) return 'default';
    if (option === question.correctAnswer) return 'correct';
    if (option === selectedOption) return 'wrong';
    return 'disabled';
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-emerald-100 transition-all hover:shadow-2xl mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <button 
          onClick={handleSpeak}
          disabled={isSpeaking}
          className={`p-2 rounded-full ${isSpeaking ? 'bg-gray-100' : 'bg-emerald-100 hover:bg-emerald-200'} transition-colors`}
          title="Nghe câu hỏi"
        >
          {isSpeaking ? (
             <svg className="w-6 h-6 animate-pulse text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-4h2v4zm4 0h-2V8h2v8z"/></svg>
          ) : (
             <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 2.828M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          )}
        </button>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <span className="flex-shrink-0 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
          {index + 1}
        </span>
        <h3 className="text-xl font-bold text-gray-800 pt-2 leading-tight">
          {question.content}
        </h3>
      </div>

      <div className="grid gap-4">
        {question.options.map((option, i) => {
          const status = getOptionStatus(option);
          return (
            <button
              key={i}
              onClick={() => !selectedOption && setSelectedOption(option)}
              disabled={!!selectedOption}
              className={`text-left p-4 rounded-2xl border-2 transition-all text-lg font-medium
                ${status === 'default' ? 'border-gray-100 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50' : ''}
                ${status === 'correct' ? 'border-emerald-500 bg-emerald-100 text-emerald-700' : ''}
                ${status === 'wrong' ? 'border-red-400 bg-red-50 text-red-600' : ''}
                ${status === 'disabled' ? 'opacity-50 border-gray-100' : ''}
              `}
            >
              <span className="inline-block w-8 font-bold">{String.fromCharCode(65 + i)}.</span>
              {option.replace(/^[A-C]\.\s*/, '')}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div className="mt-6 p-4 rounded-2xl bg-blue-50 border-2 border-blue-100 animate-fadeIn">
          <p className="text-blue-800">
            <span className="font-bold">✨ Giải thích:</span> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;

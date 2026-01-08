
import React, { useState, useEffect } from 'react';
import { generateGdtcQuestions } from './services/geminiService';
import { Question, AppState } from './types';
import QuestionCard from './components/QuestionCard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [studentName, setStudentName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setState(AppState.NAME_INPUT);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!studentName.trim()) return;

    setState(AppState.LOADING);
    setError(null);
    try {
      const data = await generateGdtcQuestions();
      setQuestions(data);
      setState(AppState.RESULT);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
      setState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setState(AppState.IDLE);
    setStudentName('');
    setQuestions([]);
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8">
      {/* Decorative Bubbles */}
      <div className="fixed top-20 left-10 w-24 h-24 bg-yellow-200 rounded-full opacity-30 bubble-float -z-10"></div>
      <div className="fixed bottom-40 right-10 w-32 h-32 bg-emerald-200 rounded-full opacity-30 bubble-float -z-10" style={{animationDelay: '1s'}}></div>
      <div className="fixed top-1/2 left-1/2 w-16 h-16 bg-blue-200 rounded-full opacity-30 bubble-float -z-10" style={{animationDelay: '2s'}}></div>

      {/* Header */}
      <header className="max-w-4xl mx-auto pt-12 text-center">
        <div 
          className="inline-block bg-white p-2 rounded-full shadow-md mb-4 border-2 border-emerald-400 cursor-pointer hover:scale-105 transition-transform"
          onClick={resetApp}
        >
          <span className="px-4 py-1 text-emerald-600 font-bold uppercase tracking-wider text-sm">Giáo Dục Thể Chất - Lớp 1</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-emerald-800 mb-4 tracking-tight">
          Vui Học <span className="text-orange-500">Cùng AI</span> 🏃‍♂️
        </h1>
        
        {state === AppState.IDLE && (
          <>
            <p className="text-lg text-emerald-700 max-w-xl mx-auto mb-10 font-medium leading-relaxed">
              Chào mừng các bé đến với lớp học thể dục vui nhộn! Hãy cùng nhau ôn tập và rèn luyện sức khỏe nhé.
            </p>
            <button 
              onClick={handleStart}
              className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-emerald-600 rounded-3xl hover:bg-emerald-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Vào Lớp Thôi!
              <svg className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
          </>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto mt-8">
        {state === AppState.NAME_INPUT && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-emerald-100 animate-fadeIn">
            <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">Tên của em là gì nhỉ?</h2>
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <input 
                autoFocus
                type="text" 
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ví dụ: Minh Anh"
                className="w-full px-6 py-4 rounded-2xl border-2 border-emerald-100 focus:border-emerald-500 outline-none text-xl font-medium text-emerald-900 transition-colors"
              />
              <button 
                type="submit"
                disabled={!studentName.trim()}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-xl shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                Bắt Đầu Ngay 🚀
              </button>
            </form>
          </div>
        )}

        {state === AppState.LOADING && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg border-4 border-emerald-50">
            <div className="inline-block w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">Đang khởi tạo thử thách...</h2>
            <p className="text-emerald-600">Thầy giáo AI đang soạn câu hỏi cho <span className="font-bold">{studentName}</span> nè!</p>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="bg-red-50 border-2 border-red-200 p-8 rounded-3xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Ôi! Có chút trục trặc</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button onClick={() => handleGenerate()} className="bg-red-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-600 shadow-lg">Thử Lại</button>
          </div>
        )}

        {state === AppState.RESULT && (
          <div className="animate-slideUp">
            <div className="bg-emerald-100 p-4 rounded-2xl mb-8 flex items-center gap-4 border-2 border-emerald-200">
              <div className="text-3xl">⭐</div>
              <div>
                <h2 className="text-xl font-bold text-emerald-800">Chào mừng bạn nhỏ: {studentName}!</h2>
                <p className="text-emerald-700">Hãy cùng hoàn thành 5 câu hỏi dưới đây nhé.</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 px-4">
              <h2 className="text-lg font-bold text-emerald-800">Bộ Câu Hỏi Dành Cho Bạn:</h2>
              <button 
                onClick={() => handleGenerate()}
                className="text-emerald-600 font-bold hover:underline flex items-center gap-1 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Đổi câu hỏi
              </button>
            </div>
            
            {questions.map((q, idx) => (
              <QuestionCard key={q.id} question={q} index={idx} />
            ))}
            
            <div className="text-center mt-12 bg-white p-8 rounded-3xl shadow-xl border-4 border-emerald-50">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">Tuyệt vời lắm {studentName}!</h3>
              <p className="text-emerald-600 font-medium mb-6 italic">"Khỏe mạnh để học tập và vui chơi thật tốt nhé!"</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => handleGenerate()}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-3xl font-bold shadow-xl hover:bg-emerald-700 transition-all"
                >
                  Luyện Tập Tiếp ⚽
                </button>
                <button 
                  onClick={resetApp}
                  className="bg-gray-100 text-gray-600 px-8 py-4 rounded-3xl font-bold shadow hover:bg-gray-200 transition-all"
                >
                  Thoát
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation (Sticky CTA) */}
      {(state === AppState.RESULT) && (
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-emerald-100 flex items-center gap-4">
            <p className="text-emerald-800 font-bold hidden md:block">Cố lên {studentName}!</p>
            <button 
              onClick={() => handleGenerate()}
              className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-orange-600 transition-colors"
            >
              Lấy câu hỏi mới
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;

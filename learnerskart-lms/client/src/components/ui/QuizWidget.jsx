import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle, Award } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function QuizWidget({ quiz, lessonId, courseId, onFinished }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOption }
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null); // { scorePercentage, passed, correctCount }
  const [loading, setLoading] = useState(false);

  // Time Limit Countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isSubmitted]);

  const handleSelectOption = (qId, option) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const nextQuestion = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const autoSubmit = () => {
    toast.error('Time is up! Submitting your answers automatically.');
    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Format answers for API
      const formattedAnswers = quiz.questions.map(q => ({
        questionId: q._id,
        answer: userAnswers[q._id] || ''
      }));

      const res = await api.post(`/quiz-attempts/${quiz._id}`, {
        answers: formattedAnswers,
        lessonId,
        courseId
      });

      if (res.data.success) {
        setIsSubmitted(true);
        setResults({
          scorePercentage: res.data.scorePercentage,
          passed: res.data.passed,
          correctCount: res.data.correctCount,
          totalQuestions: res.data.totalQuestions,
          xpAwarded: res.data.xpAwarded
        });
        
        if (res.data.passed) {
          toast.success(`🎉 Quiz Passed! Score: ${res.data.scorePercentage}% (+${res.data.xpAwarded} XP)`);
        } else {
          toast.error(`❌ Quiz Failed. Score: ${res.data.scorePercentage}% (Required: ${quiz.passPercentage}%)`);
        }

        if (onFinished) {
          onFinished();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit quiz attempt.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (isSubmitted && results) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-md max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            results.passed ? 'bg-success/15 text-success' : 'bg-red-50 text-red-500'
          }`}>
            <Award size={36} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Assessment Results</h2>
          <p className={`text-sm font-bold mt-1 ${results.passed ? 'text-success' : 'text-red-500'}`}>
            {results.passed ? 'STATUS: PASSED ✅' : 'STATUS: FAILED ❌'}
          </p>
        </div>

        {/* Results Metrics grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Your Score</span>
            <span className="text-xl font-extrabold text-slate-800">{results.scorePercentage}%</span>
          </div>
          <div className="text-center border-x border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Correct Answers</span>
            <span className="text-xl font-extrabold text-slate-800">{results.correctCount} / {results.totalQuestions}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">XP Gained</span>
            <span className="text-xl font-extrabold text-gamify">+{results.xpAwarded} XP</span>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <h3 className="font-bold text-slate-800 text-sm mb-4">Question Analysis:</h3>
        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2 mb-6">
          {quiz.questions.map((q, qIdx) => {
            const userAnswer = userAnswers[q._id] || '';
            const isCorrect = q.correctAnswer.trim().toLowerCase() === userAnswer.trim().toLowerCase();

            return (
              <div key={q._id} className={`p-4 border rounded-xl ${
                isCorrect ? 'border-success/30 bg-success/5' : 'border-red-100 bg-red-50/10'
              }`}>
                <p className="text-xs font-bold text-slate-800 flex gap-2">
                  <span>{qIdx + 1}.</span>
                  {q.questionText}
                </p>
                <div className="mt-2.5 space-y-1">
                  <p className="text-[11px]">
                    <span className="font-bold text-slate-500">Your Answer:</span>{' '}
                    <span className={isCorrect ? 'text-success font-semibold' : 'text-red-500 font-semibold'}>
                      {userAnswer || 'No response'}
                    </span>
                  </p>
                  <p className="text-[11px]">
                    <span className="font-bold text-slate-500">Correct Answer:</span>{' '}
                    <span className="text-success font-semibold">{q.correctAnswer}</span>
                  </p>
                  {q.explanation && (
                    <p className="text-[10px] text-slate-500 leading-relaxed bg-white border border-slate-100 p-2 rounded-lg mt-2 font-medium">
                      💡 <span className="font-semibold text-slate-700">Explanation:</span> {q.explanation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => {
            setIsSubmitted(false);
            setUserAnswers({});
            setCurrentIdx(0);
            setTimeLeft(quiz.timeLimit * 60);
          }}
          className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          Retake Assessment
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-md max-w-2xl mx-auto flex flex-col h-[520px]">
      
      {/* Quiz Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4 select-none">
        <div>
          <h2 className="font-extrabold text-slate-800 text-base">{quiz.title}</h2>
          <span className="text-xs text-slate-400 font-semibold">
            Question {currentIdx + 1} of {quiz.questions.length}
          </span>
        </div>
        
        {/* Timer Box */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs ${
          timeLeft < 60 ? 'border-red-200 bg-red-50 text-red-500 animate-pulse' : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}>
          <AlertCircle size={14} />
          {formatTimer(timeLeft)}
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="flex-1 overflow-y-auto pr-2 mb-4">
        <div className="flex items-start gap-2.5">
          <HelpCircle size={18} className="text-primary mt-0.5 shrink-0" />
          <h3 className="font-extrabold text-slate-800 text-sm leading-relaxed">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* Options List */}
        <div className="mt-6 space-y-3.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = userAnswers[currentQuestion._id] === option;
            const letter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(currentQuestion._id, option)}
                className={`w-full flex items-center p-4 border rounded-xl text-left transition-all duration-200 ${
                  isSelected 
                    ? 'border-primary bg-primary/5 text-primary shadow-sm font-semibold' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold mr-3.5 ${
                  isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {letter}
                </span>
                <span className="text-xs leading-normal">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer controls */}
      <div className="border-t border-slate-100 pt-4 flex justify-between items-center select-none">
        <button
          onClick={prevQuestion}
          disabled={currentIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-500 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {currentIdx === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            {loading ? 'Grading...' : 'Submit Assessment'}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        )}
      </div>

    </div>
  );
}

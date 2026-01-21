// components/free-test/TestQuestion.jsx (UPDATED)
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "../../../node_modules/react-i18next";
import TestProgress from "./TestProgress";
import AudioPlayer from "./AudioPlayer";

const TestQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  currentLevel,
  progress,
  onSubmitAnswer,
  isLoading,
  isLastQuestion,
}) => {
  const { t } = useTranslation();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(30);
  const [expired, setExpired] = useState(false);
  const submitRef = useRef(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setExpired(false);
    submitRef.current = false;

    // Timer only for questions without audio
    const isAudio = Boolean(question?.audioUrl);
    if (isAudio) {
      setRemainingSeconds(null);
      return;
    }

    const storageKey = `freeTest:q:${String(currentLevel)}:${String(
      questionNumber
    )}:startedAt`;
    const now = Date.now();
    const startedAt = Number(localStorage.getItem(storageKey)) || now;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, String(now));
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, 30 - elapsed);
      setRemainingSeconds(left);
      if (left === 0) {
        setExpired(true);
      }
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [questionNumber, question?.audioUrl, currentLevel]);

  const handleAnswerSelect = (answerIndex) => {
    if (!isLoading) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || isLoading) return;
    await onSubmitAnswer(selectedAnswer);
  };

  // Auto-submit on expiry for non-audio questions
  // If the user selected an answer before time ran out, submit that answer; otherwise submit null
  useEffect(() => {
    if (expired && !submitRef.current && !question?.audioUrl) {
      submitRef.current = true;
      onSubmitAnswer(selectedAnswer ?? null);
    }
  }, [expired, onSubmitAnswer, question?.audioUrl, selectedAnswer]);

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  const getButtonText = () => {
    if (isLoading) return t("freeTest.questions.submitting");
    if (isLastQuestion) return t("freeTest.questions.finishLevel");
    return t("freeTest.questions.nextQuestion");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6">
        <TestProgress
          currentQuestion={questionNumber}
          totalQuestions={totalQuestions}
          progress={progress}
          currentLevel={currentLevel}
        />
      </div>

      <div className="p-8">
        {question?.audioUrl ? (
          <div className="mb-6">
            <AudioPlayer
              src={question.audioUrl}
              storageKey={`freeTest:${String(currentLevel)}:${String(
                questionNumber
              )}:audio`}
              maxPlays={2}
            />
            <p className="text-sm text-[var(--SubText)] text-center mt-2">
              {t("freeTest.questions.listenCarefully")}
            </p>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-500">
              {t("freeTest.questions.noAudioForThisQuestion")}
            </p>
          </div>
        )}

        {!question?.audioUrl && (
          <div className="mb-4 flex items-center justify-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${expired
                  ? "bg-red-100 text-red-700"
                  : remainingSeconds <= 10
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-[var(--Light)] text-[var(--Main)]"
                }`}
            >
              {expired
                ? t("freeTest.questions.timeUp", "Time's up")
                : t("freeTest.questions.timeLeft", {
                  defaultValue: "Time left: {{s}}s",
                  s: remainingSeconds ?? 0,
                })}
            </span>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--Main)] mb-4 text-center">
            {t("freeTest.questions.question")} {questionNumber}
          </h2>
          <p
            className="text-xl text-[var(--Main)] text-center leading-relaxed"
            dir="ltr"
          >
            {question?.question}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {question?.options?.map((option, index) => (
            <button
              key={index}
              dir="ltr"
              onClick={() => handleAnswerSelect(index)}
              disabled={isLoading}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${selectedAnswer === index
                  ? "border-[var(--Yellow)] bg-yellow-50 ring-2 ring-[var(--Yellow)] ring-opacity-50"
                  : "border-[var(--Input)] hover:border-[var(--Yellow)] hover:bg-gray-50"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              <div className="flex items-center gap-2 space-x-4 rtl:space-x-reverse">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${selectedAnswer === index
                      ? "bg-[var(--Yellow)] text-white"
                      : "bg-gray-200 text-[var(--Main)]"
                    }`}
                >
                  {getOptionLetter(index)}
                </div>
                <span className="text-lg text-[var(--Main)]">{option}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null || isLoading || expired}
          className="w-full py-4 bg-[var(--Yellow)] text-white font-semibold rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>{getButtonText()}</span>
            </div>
          ) : (
            getButtonText()
          )}
        </button>

        {selectedAnswer === null && !isLoading && (
          <p className="text-center text-[var(--SubText)] mt-4">
            {t("freeTest.questions.selectAnswer")}
          </p>
        )}
      </div>
    </div>
  );
};

export default TestQuestion;

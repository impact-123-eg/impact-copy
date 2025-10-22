// components/free-test/TestQuestion.jsx (UPDATED)
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

  useEffect(() => {
    setSelectedAnswer(null);
  }, [questionNumber]);

  const handleAnswerSelect = (answerIndex) => {
    if (!isLoading) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || isLoading) return;
    await onSubmitAnswer(selectedAnswer);
  };

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
            <AudioPlayer src={question.audioUrl} />
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
              onClick={() => handleAnswerSelect(index)}
              disabled={isLoading}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                selectedAnswer === index
                  ? "border-[var(--Yellow)] bg-yellow-50 ring-2 ring-[var(--Yellow)] ring-opacity-50"
                  : "border-[var(--Input)] hover:border-[var(--Yellow)] hover:bg-gray-50"
              } ${
                isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    selectedAnswer === index
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
          disabled={selectedAnswer === null || isLoading}
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

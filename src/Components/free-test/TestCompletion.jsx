// components/free-test/TestCompletion.jsx (UPDATED)
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TestCompletion = ({ results }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getLevelDisplayName = (level) => {
    const levelMap = {
      Starter: t("freeTest.progress.starter"),
      Beginner: t("freeTest.progress.starter"),
      Intermediate: t("freeTest.progress.level5"),
      Advanced: t("freeTest.progress.level9"),
      A1: t("freeTest.progress.level1"),
      A2: t("freeTest.progress.level2"),
      B1: t("freeTest.progress.level3"),
      B2: t("freeTest.progress.level4"),
      "Basic 1": t("freeTest.progress.basic1"),
      "Basic 2": t("freeTest.progress.basic2"),
      "Level 1": t("freeTest.progress.level1"),
      "Level 2": t("freeTest.progress.level2"),
      "Level 3": t("freeTest.progress.level3"),
      "Level 4": t("freeTest.progress.level4"),
      "Level 5": t("freeTest.progress.level5"),
      "Level 6": t("freeTest.progress.level6"),
      "Level 7": t("freeTest.progress.level7"),
      "Level 8": t("freeTest.progress.level8"),
      "Level 9": t("freeTest.progress.level9"),
    };

    return levelMap[level] || level;
  };

  const getScoreMessage = (score, total = 50) => {
    const percentage = (score / total) * 100;

    if (percentage >= 90) return t("freeTest.completion.perfectScore");
    if (percentage >= 70) return t("freeTest.completion.wellDone");
    return t("freeTest.completion.goodJob");
  };

  const handleBookSession = () => {
    navigate("/free-session", {
      state: {
        preSelectedLevel: results?.finalLevel,
        fromTest: true,
      },
    });
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (!results) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)] mx-auto mb-4"></div>
        <p className="text-[var(--SubText)]">
          {t("freeTest.completion.loadingResults")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-500 text-white p-8 text-center">
        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎊</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {t("freeTest.completion.testComplete")}
        </h1>
        <p className="text-lg opacity-90">
          {t("freeTest.completion.congratulations")}
        </p>
      </div>

      {/* Results Content */}
      <div className="p-8">
        {/* Linked Booking Notice */}
        {results.linkedToSession && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <svg
                className="w-6 h-6 text-blue-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-blue-700 text-sm">
                {t("freeTest.completion.testLinkedToBooking")}
              </p>
            </div>
          </div>
        )}

        {/* Level Result */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--Main)] mb-4">
            {t("freeTest.completion.yourEnglishLevel")}
          </h2>
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-3xl font-bold px-8 py-4 rounded-2xl shadow-lg">
            {getLevelDisplayName(results.finalLevel)}
          </div>
        </div>

        {/* Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-[var(--Main)] mb-2">
              {results.score}
            </div>
            <div className="text-sm text-[var(--SubText)]">
              {t("freeTest.completion.correctAnswers")}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <div className="text-lg font-semibold text-[var(--Main)] mb-2">
              {getScoreMessage(results.score)}
            </div>
            <div className="text-sm text-[var(--SubText)]">
              {t("freeTest.completion.recommendedCourse")}:{" "}
              {getLevelDisplayName(results.finalLevel)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* {!results?.linkedToSession && (
            <button
              onClick={handleBookSession}
              className="w-full py-4 bg-[var(--Yellow)] text-white font-semibold rounded-xl hover:bg-opacity-90 transition-colors text-lg"
            >
              {t("freeTest.completion.bookFreeSession")}
            </button>
          )} */}

          <button
            onClick={handleGoHome}
            className="w-full py-3 border-2 border-[var(--Input)] text-[var(--Main)] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t("freeTest.completion.goHome")}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 text-[var(--SubText)] hover:text-[var(--Main)] transition-colors"
          >
            {t("freeTest.completion.retakeTest")}
          </button>
        </div>

        {/* Encouragement */}
        <div className="text-center mt-6 pt-6 border-t border-[var(--Input)]">
          <p className="text-sm text-[var(--SubText)]">
            {getScoreMessage(results.score)} {t("freeTest.completion.wellDone")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestCompletion;

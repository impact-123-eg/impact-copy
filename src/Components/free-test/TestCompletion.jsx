import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../hooks/useI18n";

const TestCompletion = ({ results }) => {
  const { t, initialize, loading, localizePath } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getLevelDisplayName = (level) => {
    const levelMap = {
      Starter: t("free-test", "starter", "Starter"),
      Beginner: t("free-test", "starter", "Starter"),
      Intermediate: t("free-test", "level5", "Level 5"),
      Advanced: t("free-test", "level9", "Level 9"),
      A1: t("free-test", "level1", "Level 1"),
      A2: t("free-test", "level2", "Level 2"),
      B1: t("free-test", "level3", "Level 3"),
      B2: t("free-test", "level4", "Level 4"),
      "Basic 1": t("free-test", "basic1", "Basic 1"),
      "Basic 2": t("free-test", "basic2", "Basic 2"),
      "Level 1": t("free-test", "level1", "Level 1"),
      "Level 2": t("free-test", "level2", "Level 2"),
      "Level 3": t("free-test", "level3", "Level 3"),
      "Level 4": t("free-test", "level4", "Level 4"),
      "Level 5": t("free-test", "level5", "Level 5"),
      "Level 6": t("free-test", "level6", "Level 6"),
      "Level 7": t("free-test", "level7", "Level 7"),
      "Level 8": t("free-test", "level8", "Level 8"),
      "Level 9": t("free-test", "level9", "Level 9"),
    };

    return levelMap[level] || level;
  };

  const getScoreMessage = (score, total = 50) => {
    const percentage = (score / total) * 100;

    if (percentage >= 90) return t("free-test", "perfectScore", "Perfect Score!");
    if (percentage >= 70) return t("free-test", "wellDone", "Well Done!");
    return t("free-test", "goodJob", "Good Job!");
  };

  const handleBookSession = () => {
    navigate(localizePath("/free-session"), {
      state: {
        preSelectedLevel: results?.finalLevel,
        fromTest: true,
      },
    });
  };

  const handleGoHome = () => {
    navigate(localizePath("/"));
  };

  if (loading || !results) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)] mx-auto mb-4"></div>
        <p className="text-[var(--SubText)]">
          {t("free-test", "loadingResults", "Loading Results...")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-sky-600 to-sky-500 text-white p-8 text-center">
        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎊</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {t("free-test", "testComplete", "Test Complete!")}
        </h1>
        <p className="text-lg opacity-90">
          {t("free-test", "congratulations", "Congratulations!")}
        </p>
      </div>

      <div className="p-8">
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
                {t("free-test", "testLinkedToBooking", "Your test results are linked to your booking.")}
              </p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--Main)] mb-4">
            {t("free-test", "yourEnglishLevel", "Your English Level")}
          </h2>
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-3xl font-bold px-8 py-4 rounded-2xl shadow-lg">
            {getLevelDisplayName(results.finalLevel)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-[var(--Main)] mb-2">
              {results.score}
            </div>
            <div className="text-sm text-[var(--SubText)]">
              {t("free-test", "correctAnswers", "Correct Answers")}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <div className="text-lg font-semibold text-[var(--Main)] mb-2">
              {getScoreMessage(results.score)}
            </div>
            <div className="text-sm text-[var(--SubText)]">
              {t("free-test", "recommendedCourse", "Recommended course")}:{" "}
              {getLevelDisplayName(results.finalLevel)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full py-3 border-2 border-[var(--Input)] text-[var(--Main)] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t("free-session", "backToHome", "Back to Home")}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 text-[var(--SubText)] hover:text-[var(--Main)] transition-colors"
          >
            {t("free-test", "retakeTest", "Retake Test")}
          </button>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-[var(--Input)]">
          <p className="text-sm text-[var(--SubText)]">
            {getScoreMessage(results.score)} {t("free-test", "wellDone", "Well done!")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestCompletion;

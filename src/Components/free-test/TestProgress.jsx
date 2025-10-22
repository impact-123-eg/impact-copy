// components/free-test/TestProgress.jsx (UPDATED)
import React from "react";
import { useTranslation } from "react-i18next";

const TestProgress = ({
  currentQuestion,
  totalQuestions,
  progress,
  currentLevel,
}) => {
  const { t } = useTranslation();

  const getLevelDisplayName = (level) => {
    const levelMap = {
      Starter: t("freeTest.progress.starter"),
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

  return (
    <div className="space-y-4">
      {/* Level and Progress Info */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
          {t("freeTest.progress.currentLevel")}:{" "}
          {getLevelDisplayName(currentLevel)}
        </div>
        <div className="text-sm font-medium">
          {t("freeTest.questions.question")} {currentQuestion}{" "}
          {t("freeTest.questions.of")} {totalQuestions}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
        <div
          className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Progress Percentage */}
      <div className="text-center text-sm font-medium">
        {Math.round(progress)}% {t("freeTest.progress.complete")}
      </div>
    </div>
  );
};

export default TestProgress;

// components/free-test/LevelTransition.jsx (UPDATED)
import React from "react";
import { useTranslation } from "react-i18next";

const LevelTransition = ({ nextLevel, onContinue }) => {
  const { t } = useTranslation();

  const getLevelDisplayName = (level) => {
    const levelMap = {
      Starter: t("freeTest.progress.starter"),
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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center">
      {/* Celebration Icon */}
      <div className="mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🎉</span>
        </div>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-[var(--Main)] mb-4">
        {t("freeTest.transition.levelUp")}
      </h1>

      {/* Message */}
      <div className="space-y-4 mb-8">
        <p className="text-xl text-green-600 font-semibold">
          {t("freeTest.transition.greatProgress")}
        </p>
        <p className="text-lg text-[var(--SubText)] leading-relaxed">
          {t("freeTest.transition.readyForNextLevel")}
        </p>
      </div>

      {/* Next Level Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
        <div className="text-sm text-blue-600 font-medium mb-2">
          {t("freeTest.transition.continueToLevel")}
        </div>
        <div className="text-2xl font-bold text-blue-700">
          {getLevelDisplayName(nextLevel)}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full py-4 bg-[var(--Yellow)] text-white font-semibold rounded-xl hover:bg-opacity-90 transition-colors text-lg"
      >
        {t("freeTest.transition.continue")}
      </button>

      {/* Encouragement Text */}
      <p className="text-sm text-[var(--SubText)] mt-4">
        {t("freeTest.transition.wellDone")}
      </p>
    </div>
  );
};

export default LevelTransition;

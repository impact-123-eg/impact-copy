import { useEffect } from "react";
import { useI18n } from "../../hooks/useI18n";

const LevelTransition = ({ nextLevel, onContinue }) => {
  const { t, initialize, loading } = useI18n();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getLevelDisplayName = (level) => {
    const levelMap = {
      Starter: t("free-test", "starter", "Starter"),
      A1: t("free-test", "a1", "A1"),
      A2: t("free-test", "a2", "A2"),
      B1: t("free-test", "b1", "B1"),
      B2: t("free-test", "b2", "B2"),
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🎉</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[var(--Main)] mb-4">
        {t("free-test", "levelUp", "Level Up!")}
      </h1>

      <div className="space-y-4 mb-8">
        <p className="text-xl text-green-600 font-semibold">
          {t("free-test", "greatProgress", "Great Progress!")}
        </p>
        <p className="text-lg text-[var(--SubText)] leading-relaxed">
          {t("free-test", "readyForNextLevel", "You are ready for the next level!")}
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
        <div className="text-sm text-blue-600 font-medium mb-2">
          {t("free-test", "continueToLevel", "Continue to Level")}
        </div>
        <div className="text-2xl font-bold text-blue-700">
          {getLevelDisplayName(nextLevel)}
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-4 bg-[var(--Yellow)] text-white font-semibold rounded-xl hover:bg-opacity-90 transition-colors text-lg"
      >
        {t("free-test", "continue", "Continue")}
      </button>

      <p className="text-sm text-[var(--SubText)] mt-4">
        {t("free-test", "wellDone", "Well done!")}
      </p>
    </div>
  );
};

export default LevelTransition;

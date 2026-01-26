import { useEffect } from "react";
import { useI18n } from "../../hooks/useI18n";

const TestProgress = ({
  currentQuestion,
  totalQuestions,
  progress,
  currentLevel,
}) => {
  const { t, initialize, loading } = useI18n();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getLevelDisplayName = (level) => {
    const levelMap = {
      Starter: t("free-test", "starter", "Starter"),
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
    return <div className="h-20 flex items-center justify-center">...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
          {t("free-test", "currentLevel", "Current Level")}:{" "}
          {getLevelDisplayName(currentLevel)}
        </div>
        <div className="text-sm font-medium">
          {t("free-test", "question", "Question")} {currentQuestion}{" "}
          {t("free-test", "of", "of")} {totalQuestions}
        </div>
      </div>

      <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
        <div
          className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="text-center text-sm font-medium">
        {Math.round(progress)}% {t("free-test", "complete", "complete")}
      </div>
    </div>
  );
};

export default TestProgress;

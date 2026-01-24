import { useI18n } from "../../hooks/useI18n";

const FreeTestContainer = () => {
  const { t, initialize, loading: i18nLoading } = useI18n();
  const [testStage, setTestStage] = useState("welcome");
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const {
    testData,
    currentQuestionIndex,
    currentQuestion,
    totalQuestions,
    currentLevel,
    progress,
    isLoading,
    isSubmitting,
    shouldShowTransition,
    startTest,
    submitAnswer,
    continueToNextLevel,
    error,
    clearError,
    existingTest,
  } = useFreeTest();

  // Clear persisted client state between test runs (audio play counters, per-question timers)
  const clearAudioPlayCounters = () => {
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (
          // Audio play counters used by AudioPlayer
          (k.startsWith("freeTest:") && k.endsWith(":audio")) ||
          k.startsWith("audio:") ||
          // Per-question timers used by TestQuestion
          (k.startsWith("freeTest:q:") && k.endsWith(":startedAt"))
        ) {
          localStorage.removeItem(k);
        }
      }
    } catch { }
  };

  // Effect to automatically manage stage transitions (edge-aware)
  useEffect(() => {
    console.log("Stage check:", {
      stage: testStage,
      hasFinalResults: !!testData?.finalResults,
      shouldShowTransition,
      currentLevel,
    });

    if (testData?.finalResults) {
      // Move to completion
      if (testStage !== "completion") {
        setTestStage("completion");
        setShowTransition(false);
      }
      return;
    }

    // Enter transition only if hook says so and we're not already in transition
    if (shouldShowTransition && testStage !== "transition") {
      setShowTransition(true);
      setTestStage("transition");
      return;
    }

    // Exit transition when hook flag is cleared
    if (!shouldShowTransition && testStage === "transition") {
      setShowTransition(false);
      setTestStage("question");
      return;
    }

    // Initial move from welcome to question when data arrives
    if (testData && testStage === "welcome") {
      setTestStage("question");
      setShowTransition(false);
    }
  }, [testData, shouldShowTransition, testStage, currentLevel]);

  const handleStartTest = async (userInfo) => {
    try {
      // Reset audio limits for a fresh attempt
      clearAudioPlayCounters();
      await startTest(userInfo);
    } catch (error) {
      console.error("Failed to start test:", error);
    }
  };

  const handleAnswerSubmit = async (answerIndex) => {
    try {
      await submitAnswer(answerIndex);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  const handleContinueToNextLevel = () => {
    console.log("Continuing to next level");
    // Clear hook transition flag first to prevent effect from re-triggering transition
    continueToNextLevel();
    // Clear local transition state and move to questions
    setShowTransition(false);
    setTestStage("question");
  };

  // Determine when to show the warning note
  const shouldShowWarningNote =
    testStage === "question" || testStage === "transition";

  // Render different stages
  const renderStage = () => {
    console.log("Rendering stage:", testStage);

    switch (testStage) {
      case "welcome":
        return (
          <TestWelcome
            onStartTest={handleStartTest}
            isLoading={isLoading}
            error={error}
            clearError={clearError}
            existingTest={existingTest}
          />
        );

      case "question":
        return (
          <TestQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            currentLevel={currentLevel}
            progress={progress}
            onSubmitAnswer={handleAnswerSubmit}
            isLoading={isSubmitting}
            isLastQuestion={currentQuestionIndex === totalQuestions - 1}
          />
        );

      case "transition":
        return (
          <LevelTransition
            nextLevel={testData?.nextLevel || currentLevel}
            onContinue={handleContinueToNextLevel}
          />
        );

      case "completion":
        return (
          <TestCompletion
            results={testData?.finalResults}
            onBookSession={() => {
              /* Navigate to booking */
            }}
            onViewDetails={() => {
              /* Show detailed results */
            }}
          />
        );

      default:
        return (
          <TestWelcome
            onStartTest={handleStartTest}
            isLoading={isLoading}
            error={error}
            clearError={clearError}
            existingTest={existingTest}
          />
        );
    }
  };

  if (isLoading && testStage === "welcome") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--Yellow)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Warning Note - Show during test only (not on welcome or completion) */}
        <WarningNote show={shouldShowWarningNote} />

        {renderStage()}
      </div>
    </div>
  );
};

export default FreeTestContainer;

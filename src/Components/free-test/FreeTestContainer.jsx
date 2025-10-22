// components/free-test/FreeTestContainer.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TestWelcome from "./TestWelcome";
import TestQuestion from "./TestQuestion";
import LevelTransition from "./LevelTransition";
import TestCompletion from "./TestCompletion";
import WarningNote from "./WarningNote";
import { useFreeTest } from "@/hooks/Actions/freeTest/useFreeTest";

const FreeTestContainer = () => {
  const { t } = useTranslation();
  const [testStage, setTestStage] = useState("welcome");
  const [showTransition, setShowTransition] = useState(false);

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

  // Effect to automatically manage stage transitions
  useEffect(() => {
    console.log("Stage check:", {
      stage: testStage,
      hasFinalResults: !!testData?.finalResults,
      shouldShowTransition,
      currentLevel,
    });

    if (testData?.finalResults) {
      setTestStage("completion");
      setShowTransition(false);
    } else if (shouldShowTransition && !showTransition) {
      // Show transition when we should and it's not already showing
      setShowTransition(true);
      setTestStage("transition");
    } else if (testData && testStage === "welcome") {
      setTestStage("question");
      setShowTransition(false);
    }
  }, [testData, shouldShowTransition, testStage, showTransition, currentLevel]);

  const handleStartTest = async (userInfo) => {
    try {
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
    // Clear the transition state and move to questions
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

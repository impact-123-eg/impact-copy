// hooks/useFreeTest.js - Updated with proper existing test handling
import { useState, useCallback } from "react";
import { useStartTest, useSubmitTest } from "./useFreeTestCruds";

export const useFreeTest = () => {
  const [testState, setTestState] = useState({
    testData: null,
    currentQuestionIndex: 0,
    userAnswers: [],
    currentLevelAnswers: [],
    currentLevel: "Starter",
    isSubmitting: false,
    showTransition: false,
    existingTest: false,
    error: null,
  });

  const { mutate: startTestMutation, isPending: isStarting } = useStartTest();
  const { mutate: submitTestMutation, isPending: isSubmitting } =
    useSubmitTest();

  const startTest = useCallback(
    (userData) => {
      setTestState((prev) => ({ ...prev, error: null }));

      startTestMutation(
        { data: userData },
        {
          onSuccess: (response) => {
            const data = response?.data || response;
            console.log("Test started:", data);

            // Check for error message in response
            if (data.message && data.message.includes("already completed")) {
              setTestState((prev) => ({
                ...prev,
                error: data.message,
                isSubmitting: false,
              }));
              return;
            }

            // If we have existing userAnswers from backend, use them
            const existingUserAnswers = data.userAnswers || [];
            const existingTest = data.existingTest || false;

            setTestState({
              testData: {
                testId: data.testId,
                questions: data.questions,
                level: data.level || "Starter",
              },
              currentQuestionIndex: existingTest
                ? existingUserAnswers.length % data.questions.length
                : 0,
              userAnswers: existingUserAnswers,
              currentLevelAnswers: [],
              currentLevel: data.level || "Starter",
              isSubmitting: false,
              showTransition: false,
              existingTest: existingTest,
              error: null,
            });
          },
          onError: (error) => {
            console.error("Failed to start test:", error);
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Failed to start test";
            setTestState((prev) => ({
              ...prev,
              isSubmitting: false,
              error: errorMessage,
            }));
          },
        }
      );
    },
    [startTestMutation]
  );

  // In your useFreeTest hook - submitAnswer function
  const submitAnswer = useCallback(
    (answerIndex) => {
      if (testState.isSubmitting) return;

      const newCurrentLevelAnswers = [
        ...testState.currentLevelAnswers,
        answerIndex,
      ];
      const newUserAnswers = [...testState.userAnswers, answerIndex];
      const isLastQuestion =
        testState.currentQuestionIndex ===
        testState.testData.questions.length - 1;

      if (!isLastQuestion) {
        // Move to next question
        setTestState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          currentLevelAnswers: newCurrentLevelAnswers,
          userAnswers: newUserAnswers,
        }));
      } else {
        // Submit the level
        setTestState((prev) => ({ ...prev, isSubmitting: true }));

        console.log(
          "🟡 Submitting level with answers:",
          newCurrentLevelAnswers
        );

        submitTestMutation(
          {
            data: {
              testId: testState.testData.testId,
              answers: newCurrentLevelAnswers,
            },
          },
          {
            onSuccess: (response) => {
              console.log("🟢 Submit test response:", response);
              const data = response?.data?.data || response?.data || response;
              console.log("📊 Processed response data:", data);

              if (data.nextLevel && data.questions) {
                console.log("🔄 Moving to next level:", data.nextLevel);
                // Move to next level
                setTestState((prev) => ({
                  testData: {
                    testId: prev.testData.testId,
                    questions: data.questions,
                    level: data.nextLevel,
                  },
                  currentQuestionIndex: 0,
                  userAnswers: newUserAnswers,
                  currentLevelAnswers: [],
                  currentLevel: data.nextLevel,
                  isSubmitting: false,
                  showTransition: true,
                }));
              } else if (data.finalLevel) {
                console.log(
                  "🎯 Test completed with final level:",
                  data.finalLevel
                );
                // Test completed
                setTestState((prev) => ({
                  ...prev,
                  testData: {
                    ...prev.testData,
                    finalResults: data,
                  },
                  isSubmitting: false,
                  showTransition: false,
                }));
              } else {
                console.log("❓ Unexpected response format:", data);
              }
            },
            onError: (error) => {
              console.log("🔴 Submit test error:", error);
              setTestState((prev) => ({
                ...prev,
                isSubmitting: false,
              }));
            },
          }
        );
      }
    },
    [testState, submitTestMutation]
  );

  const clearError = useCallback(() => {
    setTestState((prev) => ({ ...prev, error: null }));
  }, []);

  const continueToNextLevel = useCallback(() => {
    setTestState((prev) => ({
      ...prev,
      showTransition: false,
    }));
  }, []);

  const shouldShowTransition = testState.showTransition;

  return {
    // State
    ...testState,

    // Loading states
    isLoading: isStarting || testState.isSubmitting,
    isStarting,
    isSubmitting: testState.isSubmitting,

    // Actions
    startTest,
    submitAnswer,
    continueToNextLevel,
    clearError,

    // Derived values
    currentQuestion:
      testState.testData?.questions?.[testState.currentQuestionIndex],
    totalQuestions: testState.testData?.questions?.length || 0,
    progress: testState.testData?.questions
      ? ((testState.currentQuestionIndex + 1) /
          testState.testData.questions.length) *
        100
      : 0,
    isLastQuestion:
      testState.currentQuestionIndex ===
      testState.testData?.questions?.length - 1,
    shouldShowTransition,
  };
};

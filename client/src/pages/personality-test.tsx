import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import WelcomeScreen from "@/components/test/welcome-screen";
import GenderSelection from "@/components/test/gender-selection";
import TestScreen from "@/components/test/test-screen";
import ResultsScreen from "@/components/test/results-screen";
import type { Question, TestAnswer, TestScores } from "@shared/schema";
import { Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

type TestState = "welcome" | "gender" | "testing" | "results";

export default function PersonalityTest() {
  const [testState, setTestState] = useState<TestState>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [testResults, setTestResults] = useState<TestScores | null>(null);

  // Fetch questions
  const { data: questions, isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
    enabled: testState === "testing",
  });

  // Submit test mutation
  const submitTestMutation = useMutation({
    mutationFn: async (answers: TestAnswer[]) => {
      const response = await apiRequest("POST", "/api/submit-test", {
        sessionId,
        answers
      });
      return response.json();
    },
    onSuccess: (results: TestScores) => {
      setTestResults(results);
      setTestState("results");
      clearProgress();
    },
  });

  // Progress management
  const saveProgress = () => {
    const progress = {
      currentQuestion,
      answers,
      sessionId,
    };
    localStorage.setItem("personalityTestProgress", JSON.stringify(progress));
  };

  const loadProgress = () => {
    const saved = localStorage.getItem("personalityTestProgress");
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        setCurrentQuestion(progress.currentQuestion || 0);
        setAnswers(progress.answers || []);
        return true;
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
    return false;
  };

  const clearProgress = () => {
    localStorage.removeItem("personalityTestProgress");
  };

  // Load progress on component mount
  useEffect(() => {
    if (testState === "welcome") {
      const hasProgress = loadProgress();
      if (hasProgress && answers.length > 0) {
        setTestState("testing");
      }
    }
  }, [testState]);

  // Save progress when answers change
  useEffect(() => {
    if (testState === "testing" && answers.length > 0) {
      saveProgress();
    }
  }, [answers, currentQuestion, testState]);

  const startTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setTestResults(null);
    clearProgress();
    setTestState("testing");
  };

  const selectOption = (questionId: number, optionIndex: number) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, optionIndex };
    } else {
      newAnswers.push({ questionId, optionIndex });
    }
    
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (!questions) return;
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit test
      submitTestMutation.mutate(answers);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const retakeTest = () => {
    startTest();
  };

  const shareResults = async () => {
    if (!testResults) return;
    
    const shareText = `성격 호르몬 유형 테스트 결과: ${testResults.resultTitle}\n에스트로겐 성향: ${testResults.estrogenPercentage}%\n테스토스테론 성향: ${testResults.testosteronePercentage}%`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "성격 호르몬 유형 테스트 결과",
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText + "\n" + window.location.href);
        alert("결과가 클립보드에 복사되었습니다!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  // Loading state
  if (testState === "testing" && questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">질문을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">성격 호르몬 유형 테스트</h1>
            <p className="text-gray-600">에스트로겐 vs 테스토스테론 성향 분석</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {testState === "welcome" && (
          <WelcomeScreen onStartTest={startTest} />
        )}
        
        {testState === "testing" && questions && (
          <TestScreen
            questions={questions}
            currentQuestion={currentQuestion}
            answers={answers}
            onSelectOption={selectOption}
            onNextQuestion={nextQuestion}
            onPreviousQuestion={previousQuestion}
            isSubmitting={submitTestMutation.isPending}
          />
        )}
        
        {testState === "results" && testResults && (
          <ResultsScreen
            results={testResults}
            onRetakeTest={retakeTest}
            onShareResults={shareResults}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 text-sm">
            이 테스트는 심리학적 연구를 바탕으로 제작되었으며, 오락 목적으로 사용됩니다.
          </p>
        </div>
      </footer>
    </div>
  );
}

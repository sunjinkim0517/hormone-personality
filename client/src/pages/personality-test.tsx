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
        answers,
        gender: selectedGender
      });
      return response.json();
    },
    onSuccess: (results: TestScores) => {
      setTestResults(results);
      setTestState("results");
      clearProgress();
    },
    onError: (error: Error) => {
      console.error("Test submission error:", error);
      // You might want to show an error message to the user here
    }
  });

  // Progress management
  const saveProgress = () => {
    const progress = {
      currentQuestion,
      answers,
      sessionId,
      selectedGender,
      testState
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
        setSelectedGender(progress.selectedGender || null);
        return progress.testState === "testing" && progress.answers && progress.answers.length > 0;
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
      if (hasProgress) {
        setTestState("testing");
      }
    }
  }, [testState]);

  // Save progress when answers change
  useEffect(() => {
    if (testState === "testing" && answers.length > 0) {
      saveProgress();
    }
  }, [answers, currentQuestion, testState, selectedGender]);

  const startTest = () => {
    setTestState("gender");
  };

  const startTestWithGender = (gender: string) => {
    setSelectedGender(gender);
    setCurrentQuestion(0);
    setAnswers([]);
    setTestResults(null);
    clearProgress();
    setTestState("testing");
  };

  const goToHome = () => {
    setTestState("welcome");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedGender(null);
    setTestResults(null);
    clearProgress();
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
    setTestState("gender");
    setCurrentQuestion(0);
    setAnswers([]);
    setTestResults(null);
    clearProgress();
  };

  const shareResults = async () => {
    if (!testResults) return;
    
    let shareText = "";
    
    if (testResults.hpsResult) {
      // New HPS format
      shareText = `성격 호르몬 유형 테스트 결과: ${testResults.hpsResult.name} (${testResults.hpsResult.type})\n\n` +
        `🧠 호르몬 성향: ${testResults.hpsResult.percentages.hormone}% 테스토스테론\n` +
        `⚡ 행동 스타일: ${testResults.hpsResult.percentages.action}% 직접적\n` +
        `👥 관심 초점: ${testResults.hpsResult.percentages.focus}% 개인적\n\n` +
        `${testResults.hpsResult.description}`;
    } else {
      // Legacy format
      shareText = `성격 호르몬 유형 테스트 결과: ${testResults.resultTitle}\n` +
        `에스트로겐 성향: ${testResults.estrogenPercentage}%\n` +
        `테스토스테론 성향: ${testResults.testosteronePercentage}%`;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "성격 호르몬 유형 테스트 결과",
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Error sharing:", error);
          // Fallback to clipboard
          fallbackToClipboard(shareText);
        }
      }
    } else {
      fallbackToClipboard(shareText);
    }
  };

  const fallbackToClipboard = async (shareText: string) => {
    try {
      await navigator.clipboard.writeText(shareText + "\n\n" + window.location.href);
      alert("결과가 클립보드에 복사되었습니다!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      // Final fallback - create a text area and select it
      const textArea = document.createElement('textarea');
      textArea.value = shareText + "\n\n" + window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("결과가 클립보드에 복사되었습니다!");
    }
  };

  // Loading state
  if (testState === "testing" && questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">질문을 불러오는 중...</h2>
          <p className="text-gray-500">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                성격 호르몬 테스트
              </h1>
              <p className="text-sm text-gray-600">HPS (Hormone Personality System)</p>
            </div>
            {testState !== "welcome" && (
              <Button
                onClick={goToHome}
       
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
              >
                <Home className="w-4 h-4 mr-1" />
                홈
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {testState === "welcome" && (
          <WelcomeScreen onStartTest={startTest} />
        )}
        
        {testState === "gender" && (
          <GenderSelection 
            selectedGender={selectedGender}
            onSelectGender={startTestWithGender}
          />
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
      {testState === "welcome" && (
        <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-500">
            과학적 근거를 바탕으로 한 성격 분석 • 개인정보는 저장되지 않습니다
          </p>
        </footer>
      )}
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import type { Question, TestAnswer } from "@shared/schema";
import { cn } from "@/lib/utils";

interface TestScreenProps {
  questions: Question[];
  currentQuestion: number;
  answers: TestAnswer[];
  onSelectOption: (questionId: number, optionIndex: number) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  isSubmitting: boolean;
}

export default function TestScreen({
  questions,
  currentQuestion,
  answers,
  onSelectOption,
  onNextQuestion,
  onPreviousQuestion,
  isSubmitting
}: TestScreenProps) {
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers.find(a => a.questionId === question.id);
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = currentAnswer !== undefined;

  return (
    <div>
      {/* Progress Bar */}
      <Card className="bg-white rounded-2xl shadow-lg mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">진행률</span>
            <span className="text-sm font-medium text-gray-600">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="progress-bar" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardContent className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {question.text}
            </h3>
            
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => onSelectOption(question.id, index)}
                    className={cn(
                      "w-full flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 text-left",
                      "hover:border-primary/50 hover:bg-primary/5",
                      currentAnswer?.optionIndex === index
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-gray-200"
                    )}
                  >
                    <span 
                      className={cn(
                        "w-5 h-5 border-2 rounded-full mr-4 flex-shrink-0 flex items-center justify-center transition-colors",
                        currentAnswer?.optionIndex === index
                          ? "border-primary bg-primary"
                          : "border-gray-300"
                      )}
                    >
                      {currentAnswer?.optionIndex === index && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </span>
                    <span className="text-gray-700 font-medium">{option.text}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              onClick={onPreviousQuestion}
              disabled={currentQuestion === 0}
              variant="ghost"
              className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              이전
            </Button>
            
            <Button
              onClick={onNextQuestion}
              disabled={!canProceed || isSubmitting}
              className="px-6 py-3 test-gradient text-white rounded-lg hover:opacity-90 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  {isLastQuestion ? "결과 보기" : "다음"}
                  {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

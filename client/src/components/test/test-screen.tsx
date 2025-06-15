import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check, Loader2, Brain } from "lucide-react";
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

  const getDimensionInfo = (dimension: 'H' | 'A' | 'F') => {
    switch (dimension) {
      case 'H':
        return {
          name: '호르몬 성향',
          color: 'from-pink-500 to-purple-500',
          bgColor: 'from-pink-50 to-purple-50',
          borderColor: 'border-pink-200'
        };
      case 'A':
        return {
          name: '행동 스타일',
          color: 'from-blue-500 to-indigo-500',
          bgColor: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200'
        };
      case 'F':
        return {
          name: '관심 초점',
          color: 'from-green-500 to-teal-500',
          bgColor: 'from-green-50 to-teal-50',
          borderColor: 'border-green-200'
        };
      default:
        return {
          name: '성격 분석',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'from-purple-50 to-pink-50',
          borderColor: 'border-purple-200'
        };
    }
  };

  const dimensionInfo = getDimensionInfo(question.dimension);

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${dimensionInfo.color} flex items-center justify-center`}>
                <Brain className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{dimensionInfo.name}</h3>
                <p className="text-sm text-gray-600">
                  {currentQuestion + 1} / {questions.length} 질문
                </p>
              </div>
            </div>
            <Badge className="bg-gray-100 text-gray-700">
              {Math.round(progress)}% 완료
            </Badge>
          </div>
          <Progress value={progress} className="h-3 bg-gray-100" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className={`bg-gradient-to-br ${dimensionInfo.bgColor} rounded-2xl shadow-lg border ${dimensionInfo.borderColor} overflow-hidden`}>
        <CardContent className="p-0">
          {/* Question Header */}
          <div className={`bg-gradient-to-r ${dimensionInfo.color} p-6 text-white`}>
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">질문 {currentQuestion + 1}</span>
            </div>
            <h2 className="text-xl font-bold leading-relaxed">
              {question.text}
            </h2>
          </div>
          
          {/* Options */}
          <div className="p-6 bg-white">
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => onSelectOption(question.id, index)}
                    className={cn(
                      "w-full flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 text-left group hover:shadow-md",
                      "hover:border-primary/40 hover:bg-primary/5 hover:transform hover:scale-[1.02]",
                      currentAnswer?.optionIndex === index
                        ? "border-primary bg-primary/5 ring-4 ring-primary/20 shadow-lg"
                        : "border-gray-200 bg-white"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-6 h-6 border-2 rounded-full mr-4 flex-shrink-0 flex items-center justify-center transition-all duration-200",
                        currentAnswer?.optionIndex === index
                          ? "border-primary bg-primary shadow-lg"
                          : "border-gray-300 group-hover:border-primary/60"
                      )}
                    >
                      {currentAnswer?.optionIndex === index && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className={cn(
                      "text-gray-700 font-medium transition-colors leading-relaxed",
                      currentAnswer?.optionIndex === index
                        ? "text-primary"
                        : "group-hover:text-primary"
                    )}>
                      {option.text}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={onPreviousQuestion}
          disabled={currentQuestion === 0}
          

          className="px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          이전
        </Button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: questions.length }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i < currentQuestion
                  ? "bg-primary"
                  : i === currentQuestion
                  ? "bg-primary/60 scale-125"
                  : "bg-gray-300"
              )}
            />
          ))}
        </div>
        
        <Button
          onClick={onNextQuestion}
          disabled={!canProceed || isSubmitting}
         
          className={cn(
            "px-8 py-3 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl",
            `bg-gradient-to-r ${dimensionInfo.color} hover:opacity-90 disabled:opacity-50`
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              {isLastQuestion ? "결과 보기" : "다음"}
              {!isLastQuestion && <ChevronRight className="w-5 h-5 ml-2" />}
            </>
          )}
        </Button>
      </div>
      
      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          가장 자연스럽게 느껴지는 답변을 선택해주세요
        </p>
      </div>
    </div>
  );
}
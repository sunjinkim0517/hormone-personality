import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, Share2, Star, Heart, Trophy, Scale, Zap } from "lucide-react";
import type { TestScores } from "@shared/schema";

interface ResultsScreenProps {
  results: TestScores;
  onRetakeTest: () => void;
  onShareResults: () => void;
}

export default function ResultsScreen({ results, onRetakeTest, onShareResults }: ResultsScreenProps) {
  const [showScores, setShowScores] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowScores(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getResultIcon = () => {
    switch (results.resultType) {
      case 'strong_estrogen':
        return <Heart className="w-8 h-8 text-white" />;
      case 'moderate_estrogen':
        return <Scale className="w-8 h-8 text-white" />;
      case 'strong_testosterone':
        return <Trophy className="w-8 h-8 text-white" />;
      case 'moderate_testosterone':
        return <Zap className="w-8 h-8 text-white" />;
      default:
        return <Star className="w-8 h-8 text-white" />;
    }
  };

  const getResultGradient = () => {
    switch (results.resultType) {
      case 'strong_estrogen':
        return 'estrogen-gradient';
      case 'moderate_estrogen':
        return 'bg-gradient-to-br from-pink-400 to-indigo-500';
      case 'strong_testosterone':
        return 'testosterone-gradient';
      case 'moderate_testosterone':
        return 'bg-gradient-to-br from-blue-400 to-purple-500';
      default:
        return 'test-gradient';
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg result-animation">
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${getResultGradient()}`}>
            {getResultIcon()}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{results.resultTitle}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {results.resultDescription}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
            <h3 className="font-semibold text-gray-900 mb-4">에스트로겐 성향</h3>
            <div className="relative">
              <Progress 
                value={showScores ? results.estrogenPercentage : 0} 
                className="h-4 mb-2"
                style={{
                  '--progress-background': 'hsl(336, 84%, 57%)',
                } as React.CSSProperties}
              />
              <span className="text-sm font-medium text-pink-700">
                {showScores ? `${results.estrogenPercentage}%` : '0%'}
              </span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4">테스토스테론 성향</h3>
            <div className="relative">
              <Progress 
                value={showScores ? results.testosteronePercentage : 0} 
                className="h-4 mb-2"
                style={{
                  '--progress-background': 'hsl(220, 87%, 56%)',
                } as React.CSSProperties}
              />
              <span className="text-sm font-medium text-blue-700">
                {showScores ? `${results.testosteronePercentage}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">상세 분석</h3>
          <div className="space-y-4">
            {results.analysis.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRetakeTest}
            variant="outline"
            className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary/5"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 테스트하기
          </Button>
          <Button
            onClick={onShareResults}
            className="px-8 py-3 test-gradient text-white hover:opacity-90"
          >
            <Share2 className="w-4 h-4 mr-2" />
            결과 공유하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

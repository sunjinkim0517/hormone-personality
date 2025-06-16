import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Share2, Star, Heart, Trophy, Users, Target, Brain } from "lucide-react";
import type { TestScores } from "@shared/schema";
import { getTypeImagePath, getTypeColor, dimensionExplanations } from "@/lib/test-data";

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

  const hpsResult = results.hpsResult;
  
  if (!hpsResult) {
    // Fallback for legacy results
    return <LegacyResultsView results={results} onRetakeTest={onRetakeTest} onShareResults={onShareResults} />;
  }

  const typeImagePath = getTypeImagePath(hpsResult.type);
  const typeColor = getTypeColor(hpsResult.type);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Result Card */}
      <Card className="bg-white rounded-3xl shadow-xl result-animation overflow-hidden">
        <CardContent className="p-0">
          {/* Header with gradient background */}
          <div className={`${typeColor} p-8 text-white text-center relative`}>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                <img 
                  src={typeImagePath} 
                  alt={hpsResult.name}
                  className="w-24 h-24 object-cover rounded-full"
                  onError={(e) => {
                    // Fallback to type text if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center hidden">
                  <span className="text-4xl text-white font-bold">{hpsResult.type}</span>
                </div>
              </div>
              
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                {hpsResult.type}
              </Badge>
              
              <h2 className="text-4xl font-bold mb-4">{hpsResult.name}</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                {hpsResult.description}
              </p>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8">
            <Tabs defaultValue="scores" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="scores" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  점수
                </TabsTrigger>
                <TabsTrigger value="traits" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  특성
                </TabsTrigger>
                <TabsTrigger value="careers" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  진로
                </TabsTrigger>
                <TabsTrigger value="compatibility" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  궁합
                </TabsTrigger>
              </TabsList>

              {/* Scores Tab */}
              <TabsContent value="scores" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Hormone Dimension */}
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      {dimensionExplanations.H.name}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">테스토스테론</span>
                          <span className="text-sm font-medium">{hpsResult.percentages.hormone}%</span>
                        </div>
                        <Progress 
                          value={showScores ? hpsResult.percentages.hormone : 0} 
                          className="h-3"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">에스트로겐</span>
                          <span className="text-sm font-medium">{100 - hpsResult.percentages.hormone}%</span>
                        </div>
                        <Progress 
                          value={showScores ? (100 - hpsResult.percentages.hormone) : 0} 
                          className="h-3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Dimension */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-blue-600" />
                      {dimensionExplanations.A.name}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">직접적</span>
                          <span className="text-sm font-medium">{hpsResult.percentages.action}%</span>
                        </div>
                        <Progress 
                          value={showScores ? hpsResult.percentages.action : 0} 
                          className="h-3"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">미묘한</span>
                          <span className="text-sm font-medium">{100 - hpsResult.percentages.action}%</span>
                        </div>
                        <Progress 
                          value={showScores ? (100 - hpsResult.percentages.action) : 0} 
                          className="h-3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Focus Dimension */}
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      {dimensionExplanations.F.name}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">개인적</span>
                          <span className="text-sm font-medium">{hpsResult.percentages.focus}%</span>
                        </div>
                        <Progress 
                          value={showScores ? hpsResult.percentages.focus : 0} 
                          className="h-3"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">관계적</span>
                          <span className="text-sm font-medium">{100 - hpsResult.percentages.focus}%</span>
                        </div>
                        <Progress 
                          value={showScores ? (100 - hpsResult.percentages.focus) : 0} 
                          className="h-3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Traits Tab */}
              <TabsContent value="traits" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      주요 강점
                    </h3>
                    <ul className="space-y-2">
                      {hpsResult.characteristics.strengths.map((strength, index) => (
                        <li key={index} className="text-green-700 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                    <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      성장 포인트
                    </h3>
                    <ul className="space-y-2">
                      {hpsResult.characteristics.growthTips.map((tip, index) => (
                        <li key={index} className="text-amber-700 flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Careers Tab */}
              <TabsContent value="careers" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      추천 직업
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {hpsResult.characteristics.careers.map((career, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800">
                          {career}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      유명인 유형
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {hpsResult.characteristics.celebrities.map((celebrity, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-800">
                          {celebrity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Compatibility Tab */}
              <TabsContent value="compatibility" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                    <h3 className="font-semibold text-red-800 mb-4">최고 궁합</h3>
                    <div className="space-y-2">
                      {hpsResult.compatibility.perfect.map((type, index) => (
                        <Badge key={index} className="bg-red-100 text-red-800 w-full justify-center">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-4">좋은 궁합</h3>
                    <div className="space-y-2">
                      {hpsResult.compatibility.good.map((type, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 w-full justify-center">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
                    <h3 className="font-semibold text-yellow-800 mb-4">성장 궁합</h3>
                    <div className="space-y-2">
                      {hpsResult.compatibility.growth.map((type, index) => (
                        <Badge key={index} className="bg-yellow-100 text-yellow-800 w-full justify-center">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onRetakeTest}
          variant="outline"
          size="lg"
          className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          다시 테스트하기
        </Button>
        <Button
          onClick={onShareResults}
          size="lg"
          className={`px-8 py-4 text-white hover:opacity-90 rounded-2xl ${typeColor}`}
        >
          <Share2 className="w-5 h-5 mr-2" />
          결과 공유하기
        </Button>
      </div>
    </div>
  );
}

// Legacy results view for backward compatibility
function LegacyResultsView({ results, onRetakeTest, onShareResults }: ResultsScreenProps) {
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
        return <Users className="w-8 h-8 text-white" />;
      case 'strong_testosterone':
        return <Trophy className="w-8 h-8 text-white" />;
      case 'moderate_testosterone':
        return <Target className="w-8 h-8 text-white" />;
      default:
        return <Star className="w-8 h-8 text-white" />;
    }
  };

  const getResultGradient = () => {
    switch (results.resultType) {
      case 'strong_estrogen':
        return 'bg-gradient-to-br from-pink-500 to-purple-500';
      case 'moderate_estrogen':
        return 'bg-gradient-to-br from-pink-400 to-indigo-500';
      case 'strong_testosterone':
        return 'bg-gradient-to-br from-blue-500 to-indigo-500';
      case 'moderate_testosterone':
        return 'bg-gradient-to-br from-blue-400 to-purple-500';
      default:
        return 'bg-gradient-to-br from-purple-500 to-pink-500';
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
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
          >
            <Share2 className="w-4 h-4 mr-2" />
            결과 공유하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

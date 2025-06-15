import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Trophy, Sparkles, Zap, Users, Target } from "lucide-react";

interface WelcomeScreenProps {
  onStartTest: () => void;
}

export default function WelcomeScreen({ onStartTest }: WelcomeScreenProps) {
  return (
    <div className="space-y-8">
      {/* Main Welcome Card */}
      <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
        <CardContent className="p-0">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Brain className="text-white w-10 h-10" />
              </div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                HPS (Hormone Personality System)
              </Badge>
              <h1 className="text-4xl font-bold mb-4">성격 호르몬 테스트</h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                15개 질문으로 알아보는 당신의 성격 유형 분석
              </p>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-8">
            {/* 3 Dimensions Explanation */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">3가지 차원으로 분석합니다</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-200/50 text-center">
                  <Heart className="text-pink-600 w-10 h-10 mx-auto mb-4" />
                  <h3 className="font-bold text-pink-800 text-lg mb-2">호르몬 성향</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-pink-700">테스토스테론</span>
                      <span className="text-xs text-pink-600">목표지향·경쟁적</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-700">에스트로겐</span>
                      <span className="text-xs text-pink-600">협력적·공감적</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200/50 text-center">
                  <Zap className="text-blue-600 w-10 h-10 mx-auto mb-4" />
                  <h3 className="font-bold text-blue-800 text-lg mb-2">행동 스타일</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">직접적</span>
                      <span className="text-xs text-blue-600">솔직한·명확한</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">미묘한</span>
                      <span className="text-xs text-blue-600">신중한·우회적</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border border-green-200/50 text-center">
                  <Users className="text-green-600 w-10 h-10 mx-auto mb-4" />
                  <h3 className="font-bold text-green-800 text-lg mb-2">관심 초점</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">개인적</span>
                      <span className="text-xs text-green-600">독립적·자기중심</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">관계적</span>
                      <span className="text-xs text-green-600">사회적·타인중심</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">8가지 성격 유형</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-red-100 to-orange-100 p-4 rounded-xl border border-red-200 text-center">
                  <h4 className="font-bold text-red-800 text-lg mb-1">TDI</h4>
                  <p className="text-sm text-red-600">강철 리더</p>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-xl border border-orange-200 text-center">
                  <h4 className="font-bold text-orange-800 text-lg mb-1">TDR</h4>
                  <p className="text-sm text-orange-600">열정 감화자</p>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-blue-100 p-4 rounded-xl border border-gray-200 text-center">
                  <h4 className="font-bold text-gray-800 text-lg mb-1">TSI</h4>
                  <p className="text-sm text-gray-600">쿨한 독행자</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-xl border border-blue-200 text-center">
                  <h4 className="font-bold text-blue-800 text-lg mb-1">TSR</h4>
                  <p className="text-sm text-blue-600">든든한 버팀목</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl border border-purple-200 text-center">
                  <h4 className="font-bold text-purple-800 text-lg mb-1">EDI</h4>
                  <p className="text-sm text-purple-600">당당한 프리스피릿</p>
                </div>
                <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-xl border border-pink-200 text-center">
                  <h4 className="font-bold text-pink-800 text-lg mb-1">EDR</h4>
                  <p className="text-sm text-pink-600">따뜻한 리더</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-xl border border-indigo-200 text-center">
                  <h4 className="font-bold text-indigo-800 text-lg mb-1">ESI</h4>
                  <p className="text-sm text-indigo-600">신비로운 몽상가</p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 p-4 rounded-xl border border-green-200 text-center">
                  <h4 className="font-bold text-green-800 text-lg mb-1">ESR</h4>
                  <p className="text-sm text-green-600">순수한 치유자</p>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="text-center">
              <Button 
                onClick={onStartTest}
                
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                테스트 시작하기
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                결과에는 성별 구분이 포함됩니다 (테토남/테토녀, 에겐남/에겐녀)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">정확한 분석</h3>
            <p className="text-sm text-gray-600">3차원 15문항으로 정밀한 성격 분석</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">궁합 분석</h3>
            <p className="text-sm text-gray-600">다른 유형과의 호환성 분석 제공</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">성장 가이드</h3>
            <p className="text-sm text-gray-600">개인 맞춤 성장 방향 제시</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
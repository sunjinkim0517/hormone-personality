import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Trophy, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onStartTest: () => void;
}

export default function WelcomeScreen({ onStartTest }: WelcomeScreenProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50">
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Brain className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">나는 어떤 성향일까?</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            20개 질문으로 알아보는 성격 호르몬 유형 분석
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-2xl border border-pink-200/50">
            <Heart className="text-pink-600 w-8 h-8 mx-auto mb-3" />
            <h3 className="font-bold text-pink-800 text-sm mb-1">에스트로겐</h3>
            <p className="text-xs text-pink-700">협력적 · 공감적</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200/50">
            <Trophy className="text-blue-600 w-8 h-8 mx-auto mb-3" />
            <h3 className="font-bold text-blue-800 text-sm mb-1">테스토스테론</h3>
            <p className="text-xs text-blue-700">경쟁적 · 목표지향</p>
          </div>
        </div>
        
        <Button 
          onClick={onStartTest}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          테스트 시작하기
        </Button>
        
        <p className="text-xs text-gray-500 mt-6">
          결과에는 성별 구분이 포함됩니다 (테토남/테토녀, 에겐남/에겐녀)
        </p>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Trophy } from "lucide-react";

interface WelcomeScreenProps {
  onStartTest: () => void;
}

export default function WelcomeScreen({ onStartTest }: WelcomeScreenProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-lg">
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 test-gradient rounded-full mx-auto mb-6 flex items-center justify-center">
            <Brain className="text-white text-2xl w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">성격 호르몬 유형을 알아보세요</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            이 테스트는 당신의 성격이 에스트로겐 성향인지 테스토스테론 성향인지를 분석합니다. 
            총 20개의 질문을 통해 당신의 고유한 성격 유형을 발견해보세요.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
            <div className="w-12 h-12 bg-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="text-white w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">에스트로겐 성향</h3>
            <p className="text-sm text-gray-600">협력적, 공감적, 관계 중심적, 감정적 지능이 높은 특성</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Trophy className="text-white w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">테스토스테론 성향</h3>
            <p className="text-sm text-gray-600">경쟁적, 도전적, 목표 지향적, 분석적 사고가 강한 특성</p>
          </div>
        </div>
        
        <Button 
          onClick={onStartTest}
          className="test-gradient text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-105"
        >
          테스트 시작하기
        </Button>
      </CardContent>
    </Card>
  );
}

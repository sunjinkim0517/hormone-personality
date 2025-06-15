import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, Sparkles } from "lucide-react";

interface GenderSelectionProps {
  selectedGender: string | null;
  onSelectGender: (gender: string) => void;
}

export default function GenderSelection({ selectedGender, onSelectGender }: GenderSelectionProps) {
  const genderOptions = [
    {
      id: 'male',
      label: '남성',
      icon: '👨',
      description: '테토남 / 에겐남 유형으로 분석',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'female',
      label: '여성',
      icon: '👩',
      description: '테토녀 / 에겐녀 유형으로 분석',
      gradient: 'from-pink-500 to-purple-600',
      bgGradient: 'from-pink-50 to-purple-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'other',
      label: '기타',
      icon: '👤',
      description: '일반적인 성격 유형으로 분석',
      gradient: 'from-gray-500 to-slate-600',
      bgGradient: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-200'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8 text-white text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Users className="text-white w-8 h-8" />
              </div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                2단계
              </Badge>
              <h2 className="text-3xl font-bold mb-3">성별을 선택해주세요</h2>
              <p className="text-lg opacity-90">
                더 정확한 분석을 위해 성별 정보가 필요합니다
              </p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid gap-6">
              {genderOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onSelectGender(option.id)}
                  className={`w-full transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedGender === option.id ? 'scale-[1.02]' : ''
                  }`}
                >
                  <Card className={`border-2 transition-all duration-300 overflow-hidden ${
                    selectedGender === option.id 
                      ? `${option.borderColor} shadow-xl ring-4 ring-opacity-20 ${option.borderColor.replace('border-', 'ring-')}`
                      : 'border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
                  }`}>
                    <CardContent className="p-0">
                      <div className={`bg-gradient-to-br ${option.bgGradient} p-6`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                            {option.icon}
                          </div>
                          <div className="text-left flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {option.label}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {option.description}
                            </p>
                          </div>
                          {selectedGender === option.id && (
                            <div className={`w-8 h-8 bg-gradient-to-br ${option.gradient} rounded-full flex items-center justify-center`}>
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
            
            {selectedGender && (
              <div className="mt-8 text-center">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">선택 완료</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {genderOptions.find(opt => opt.id === selectedGender)?.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    성별 정보는 결과 분석에만 사용되며 저장되지 않습니다
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🧠</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">과학적 근거</h3>
            <p className="text-sm text-gray-600">
              성별에 따른 호르몬 차이를 반영한 정밀한 성격 분석
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/60 backdrop-blur-sm border border-gray-200/50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🔒</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">개인정보 보호</h3>
            <p className="text-sm text-gray-600">
              모든 정보는 분석 후 즉시 삭제되며 저장되지 않습니다
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
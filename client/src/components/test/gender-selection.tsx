import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenderSelectionProps {
  selectedGender: string | null;
  onSelectGender: (gender: string) => void;
}

export default function GenderSelection({ selectedGender, onSelectGender }: GenderSelectionProps) {
  return (
    <Card className="bg-white rounded-2xl shadow-lg">
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Users className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">성별을 선택해주세요</h2>
          <p className="text-gray-600">결과에 성별 구분이 포함됩니다 (테토남/테토녀, 에겐남/에겐녀)</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={() => onSelectGender('male')}
            className={cn(
              "flex flex-col items-center p-6 border-2 rounded-xl transition-all duration-200",
              "hover:border-blue-400 hover:bg-blue-50",
              selectedGender === 'male'
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                : "border-gray-200"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full mb-3 flex items-center justify-center",
              selectedGender === 'male' ? "bg-blue-500" : "bg-gray-300"
            )}>
              <User className={cn("w-6 h-6", selectedGender === 'male' ? "text-white" : "text-gray-600")} />
            </div>
            <span className="font-medium text-gray-900">남성</span>
          </button>
          
          <button
            onClick={() => onSelectGender('female')}
            className={cn(
              "flex flex-col items-center p-6 border-2 rounded-xl transition-all duration-200",
              "hover:border-pink-400 hover:bg-pink-50",
              selectedGender === 'female'
                ? "border-pink-500 bg-pink-50 ring-2 ring-pink-200"
                : "border-gray-200"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full mb-3 flex items-center justify-center",
              selectedGender === 'female' ? "bg-pink-500" : "bg-gray-300"
            )}>
              <User className={cn("w-6 h-6", selectedGender === 'female' ? "text-white" : "text-gray-600")} />
            </div>
            <span className="font-medium text-gray-900">여성</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
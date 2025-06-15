import type { Question, HPSResult, HPSType, TestAnswer } from "@shared/schema";

// HPS 유형별 이미지 경로 매핑
export const getTypeImagePath = (type: HPSType): string => {
  return `/src/assets/types/${type.toLowerCase()}.png`;
};

// HPS 유형별 색상 매핑
export const getTypeColor = (type: HPSType): string => {
  const colorMap: Record<HPSType, string> = {
    'TDI': 'bg-gradient-to-br from-red-600 to-orange-600',
    'TDR': 'bg-gradient-to-br from-orange-500 to-red-500', 
    'TSI': 'bg-gradient-to-br from-gray-600 to-blue-600',
    'TSR': 'bg-gradient-to-br from-blue-500 to-indigo-500',
    'EDI': 'bg-gradient-to-br from-purple-500 to-pink-400',
    'EDR': 'bg-gradient-to-br from-pink-400 to-purple-400',
    'ESI': 'bg-gradient-to-br from-indigo-500 to-purple-500',
    'ESR': 'bg-gradient-to-br from-green-400 to-blue-400'
  };
  return colorMap[type] || 'bg-gradient-to-br from-purple-600 to-pink-600';
};

// HPS 유형별 아이콘 매핑
export const getTypeIcon = (type: HPSType): string => {
  const iconMap: Record<HPSType, string> = {
    'TDI': '👑',
    'TDR': '🔥',
    'TSI': '😎', 
    'TSR': '🛡️',
    'EDI': '✨',
    'EDR': '🌟',
    'ESI': '🌙',
    'ESR': '🕊️'
  };
  return iconMap[type] || '⭐';
};

// Legacy calculation function for backward compatibility
export const calculateTestResults = (answers: TestAnswer[], questions: Question[]) => {
  let estrogenScore = 0;
  let testosteroneScore = 0;
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.options[answer.optionIndex]) {
      const option = question.options[answer.optionIndex];
      estrogenScore += option.E;
      testosteroneScore += option.T;
    }
  });
  
  const totalScore = estrogenScore + testosteroneScore || 1;
  const estrogenPercentage = Math.round((estrogenScore / totalScore) * 100);
  const testosteronePercentage = Math.round((testosteroneScore / totalScore) * 100);
  
  return {
    estrogenScore,
    testosteroneScore,
    estrogenPercentage,
    testosteronePercentage,
  };
};

// HPS 차원별 설명
export const dimensionExplanations = {
  H: {
    name: '호르몬 성향',
    T: '테스토스테론 (목표지향적, 경쟁적)',
    E: '에스트로겐 (협력적, 공감적)'
  },
  A: {
    name: '행동 스타일',
    D: '직접적 (솔직한, 명확한)',
    S: '미묘한 (신중한, 우회적)'
  },
  F: {
    name: '관심 초점',
    I: '개인적 (독립적, 자기중심)',
    R: '관계적 (사회적, 타인중심)'
  }
};
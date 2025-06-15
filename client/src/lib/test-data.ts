import type { Question } from "@shared/schema";

export const testQuestions: Question[] = [
  {
    id: 1,
    text: "갈등 상황에서 당신의 첫 번째 반응은?",
    options: [
      { text: "상대방의 감정을 이해하려고 노력한다", estrogen: 3, testosterone: 0 },
      { text: "논리적으로 문제를 분석한다", estrogen: 0, testosterone: 3 },
      { text: "타협점을 찾으려고 한다", estrogen: 2, testosterone: 1 },
      { text: "내 의견을 확실히 표현한다", estrogen: 0, testosterone: 2 }
    ],
    order: 1
  },
  {
    id: 2,
    text: "새로운 프로젝트를 시작할 때 가장 중요하게 생각하는 것은?",
    options: [
      { text: "팀원들과의 화합과 협력", estrogen: 3, testosterone: 0 },
      { text: "명확한 목표 설정과 성과", estrogen: 0, testosterone: 3 },
      { text: "과정에서의 배움과 성장", estrogen: 2, testosterone: 1 },
      { text: "경쟁에서 이기는 것", estrogen: 0, testosterone: 2 }
    ],
    order: 2
  },
  // ... additional questions would be here
];

export const calculateTestResults = (answers: Array<{ questionId: number; optionIndex: number }>, questions: Question[]) => {
  let estrogenScore = 0;
  let testosteroneScore = 0;
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.options[answer.optionIndex]) {
      const option = question.options[answer.optionIndex];
      estrogenScore += option.estrogen;
      testosteroneScore += option.testosterone;
    }
  });
  
  const totalScore = estrogenScore + testosteroneScore;
  const estrogenPercentage = Math.round((estrogenScore / totalScore) * 100);
  const testosteronePercentage = Math.round((testosteroneScore / totalScore) * 100);
  
  return {
    estrogenScore,
    testosteroneScore,
    estrogenPercentage,
    testosteronePercentage,
  };
};

import { users, testQuestions, testResults, type User, type InsertUser, type TestQuestion, type TestResult, type InsertTestResult, type Question, type HPSType, type HPSResult, type HPSScores } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllQuestions(): Promise<Question[]>;
  saveTestResult(result: InsertTestResult): Promise<TestResult>;
  getTestResult(sessionId: string): Promise<TestResult | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private results: Map<string, TestResult>;
  private currentUserId: number;
  private currentQuestionId: number;
  private currentResultId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.results = new Map();
    this.currentUserId = 1;
    this.currentQuestionId = 1;
    this.currentResultId = 1;
    
    this.initializeQuestions();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private initializeQuestions() {
    // New HPS questions - 15 questions total (5 per dimension)
    const questionsData: Omit<Question, 'id'>[] = [
      // Hormone dimension questions (H: T vs E)
      {
        text: "스트레스를 받을 때 당신의 해소 방법은?",
        dimension: 'H' as const,
        options: this.shuffleArray([
          { text: "운동이나 신체 활동으로 풀어낸다", T: 3, E: 0, D: 0, S: 0, I: 0, R: 0 },
          { text: "음악을 듣거나 감정을 표현한다", T: 0, E: 3, D: 0, S: 0, I: 0, R: 0 },
          { text: "혼자 생각하며 정리한다", T: 1, E: 2, D: 0, S: 0, I: 0, R: 0 },
          { text: "친구들과 대화하며 푼다", T: 0, E: 2, D: 0, S: 0, I: 0, R: 0 }
        ]),
        order: 1
      },
      {
        text: "성공에 대한 당신의 생각은?",
        dimension: 'H' as const,
        options: this.shuffleArray([
          { text: "목표 달성과 성과가 중요하다", T: 3, E: 0, D: 0, S: 0, I: 0, R: 0 },
          { text: "사람들과의 관계가 우선이다", T: 0, E: 3, D: 0, S: 0, I: 0, R: 0 },
          { text: "과정에서의 만족이 중요하다", T: 1, E: 2, D: 0, S: 0, I: 0, R: 0 },
          { text: "경쟁에서 이기는 것이 짜릿하다", T: 2, E: 0, D: 0, S: 0, I: 0, R: 0 }
        ]),
        order: 2
      },
      {
        text: "어려운 결정을 내릴 때 가장 중요한 기준은?",
        dimension: 'H' as const,
        options: this.shuffleArray([
          { text: "논리적 분석과 데이터", T: 3, E: 0, D: 0, S: 0, I: 0, R: 0 },
          { text: "직감과 감정적 확신", T: 0, E: 3, D: 0, S: 0, I: 0, R: 0 },
          { text: "효율성과 실용성", T: 2, E: 1, D: 0, S: 0, I: 0, R: 0 },
          { text: "주변 사람들에게 미칠 영향", T: 0, E: 2, D: 0, S: 0, I: 0, R: 0 }
        ]),
        order: 3
      },
      {
        text: "새로운 도전에 직면했을 때?",
        dimension: 'H' as const,
        options: this.shuffleArray([
          { text: "즉시 행동에 옮긴다", T: 3, E: 0, D: 0, S: 0, I: 0, R: 0 },
          { text: "신중하게 계획을 세운다", T: 1, E: 2, D: 0, S: 0, I: 0, R: 0 },
          { text: "위험을 감수하고 도전한다", T: 2, E: 0, D: 0, S: 0, I: 0, R: 0 },
          { text: "다른 사람들과 상의한다", T: 0, E: 3, D: 0, S: 0, I: 0, R: 0 }
        ]),
        order: 4
      },
      {
        text: "여가 시간에 선호하는 활동은?",
        dimension: 'H' as const,
        options: this.shuffleArray([
          { text: "스포츠나 경쟁적인 게임", T: 3, E: 0, D: 0, S: 0, I: 0, R: 0 },
          { text: "예술이나 문화 활동", T: 0, E: 3, D: 0, S: 0, I: 0, R: 0 },
          { text: "새로운 기술 배우기", T: 2, E: 1, D: 0, S: 0, I: 0, R: 0 },
          { text: "친구들과 수다떨기", T: 0, E: 2, D: 0, S: 0, I: 0, R: 0 }
        ]),
        order: 5
      },

      // Action dimension questions (A: D vs S)
      {
        text: "마음에 안 드는 일이 있을 때?",
        dimension: 'A' as const,
        options: this.shuffleArray([
          { text: "바로 말한다, 속 시원하게!", T: 0, E: 0, D: 3, S: 0, I: 0, R: 0 },
          { text: "상황을 보고 적절한 때를 기다린다", T: 0, E: 0, D: 0, S: 3, I: 0, R: 0 },
          { text: "은근슬쩍 표현한다", T: 0, E: 0, D: 1, S: 2, I: 0, R: 0 },
          { text: "직접적으로 의견을 표현한다", T: 0, E: 0, D: 2, S: 0, I: 0, R: 0 }
        ]),
        order: 6
      },
      {
        text: "갈등 상황에서 당신의 해결 방식은?",
        dimension: 'A' as const,
        options: this.shuffleArray([
          { text: "정면으로 부딪혀서 해결한다", T: 0, E: 0, D: 3, S: 0, I: 0, R: 0 },
          { text: "우회적으로 접근해서 풀어간다", T: 0, E: 0, D: 0, S: 3, I: 0, R: 0 },
          { text: "중재자를 통해 해결한다", T: 0, E: 0, D: 1, S: 2, I: 0, R: 0 },
          { text: "명확하게 입장을 표명한다", T: 0, E: 0, D: 2, S: 0, I: 0, R: 0 }
        ]),
        order: 7
      },
      {
        text: "의견을 표현할 때 당신의 스타일은?",
        dimension: 'A' as const,
        options: this.shuffleArray([
          { text: "솔직하고 직설적으로 말한다", T: 0, E: 0, D: 3, S: 0, I: 0, R: 0 },
          { text: "돌려서 부드럽게 표현한다", T: 0, E: 0, D: 0, S: 3, I: 0, R: 0 },
          { text: "예시를 들어 간접적으로 말한다", T: 0, E: 0, D: 1, S: 2, I: 0, R: 0 },
          { text: "명확하고 구체적으로 전달한다", T: 0, E: 0, D: 2, S: 0, I: 0, R: 0 }
        ]),
        order: 8
      },
      {
        text: "비판을 받았을 때 당신의 반응은?",
        dimension: 'A' as const,
        options: this.shuffleArray([
          { text: "즉시 반박하고 내 입장을 말한다", T: 0, E: 0, D: 3, S: 0, I: 0, R: 0 },
          { text: "일단 듣고 나중에 생각해본다", T: 0, E: 0, D: 0, S: 3, I: 0, R: 0 },
          { text: "감정적으로 상처받지만 참는다", T: 0, E: 0, D: 1, S: 2, I: 0, R: 0 },
          { text: "논리적으로 설명하며 대응한다", T: 0, E: 0, D: 2, S: 0, I: 0, R: 0 }
        ]),
        order: 9
      },
      {
        text: "리더십을 발휘할 때 당신의 방식은?",
        dimension: 'A' as const,
        options: this.shuffleArray([
          { text: "명확한 지시와 피드백을 준다", T: 0, E: 0, D: 3, S: 0, I: 0, R: 0 },
          { text: "격려와 지지를 통해 이끈다", T: 0, E: 0, D: 0, S: 3, I: 0, R: 0 },
          { text: "모범을 보이며 자연스럽게 이끈다", T: 0, E: 0, D: 1, S: 2, I: 0, R: 0 },
          { text: "목표를 제시하고 추진한다", T: 0, E: 0, D: 2, S: 0, I: 0, R: 0 }
        ]),
        order: 10
      },

      // Focus dimension questions (F: I vs R)
      {
        text: "중요한 결정을 내릴 때 가장 중요한 것은?",
        dimension: 'F' as const,
        options: this.shuffleArray([
          { text: "내 확신과 기준이 우선이다", T: 0, E: 0, D: 0, S: 0, I: 3, R: 0 },
          { text: "주변 사람들과의 관계를 고려한다", T: 0, E: 0, D: 0, S: 0, I: 0, R: 3 },
          { text: "내 가치관에 맞는지 판단한다", T: 0, E: 0, D: 0, S: 0, I: 2, R: 1 },
          { text: "모든 사람에게 도움이 되는지 본다", T: 0, E: 0, D: 0, S: 0, I: 0, R: 2 }
        ]),
        order: 11
      },
      {
        text: "성공의 기준으로 가장 중요한 것은?",
        dimension: 'F' as const,
        options: this.shuffleArray([
          { text: "내가 원하는 것을 이루는 것", T: 0, E: 0, D: 0, S: 0, I: 3, R: 0 },
          { text: "사람들과 좋은 관계를 유지하는 것", T: 0, E: 0, D: 0, S: 0, I: 0, R: 3 },
          { text: "내 능력을 인정받는 것", T: 0, E: 0, D: 0, S: 0, I: 2, R: 1 },
          { text: "주변 사람들이 행복해하는 것", T: 0, E: 0, D: 0, S: 0, I: 0, R: 2 }
        ]),
        order: 12
      },
      {
        text: "새로운 환경에 적응할 때?",
        dimension: 'F' as const,
        options: this.shuffleArray([
          { text: "내 스타일대로 차근차근 적응한다", T: 0, E: 0, D: 0, S: 0, I: 3, R: 0 },
          { text: "사람들과 관계를 먼저 형성한다", T: 0, E: 0, D: 0, S: 0, I: 0, R: 3 },
          { text: "내 방식을 고수하며 적응한다", T: 0, E: 0, D: 0, S: 0, I: 2, R: 1 },
          { text: "모든 사람과 어울리려고 노력한다", T: 0, E: 0, D: 0, S: 0, I: 0, R: 2 }
        ]),
        order: 13
      },
      {
        text: "팀 프로젝트에서 당신의 우선순위는?",
        dimension: 'F' as const,
        options: this.shuffleArray([
          { text: "내가 맡은 역할을 완벽하게 해내는 것", T: 0, E: 0, D: 0, S: 0, I: 3, R: 0 },
          { text: "팀 전체의 화합과 협력", T: 0, E: 0, D: 0, S: 0, I: 0, R: 3 },
          { text: "내 전문성을 발휘하는 것", T: 0, E: 0, D: 0, S: 0, I: 2, R: 1 },
          { text: "모든 팀원이 만족하는 결과", T: 0, E: 0, D: 0, S: 0, I: 0, R: 2 }
        ]),
        order: 14
      },
      {
        text: "인생에서 가장 중요한 가치는?",
        dimension: 'F' as const,
        options: this.shuffleArray([
          { text: "자유와 독립성", T: 0, E: 0, D: 0, S: 0, I: 3, R: 0 },
          { text: "사랑과 인간관계", T: 0, E: 0, D: 0, S: 0, I: 0, R: 3 },
          { text: "개인적 성취와 성장", T: 0, E: 0, D: 0, S: 0, I: 2, R: 1 },
          { text: "조화로운 공동체", T: 0, E: 0, D: 0, S: 0, I: 0, R: 2 }
        ]),
        order: 15
      }
    ];

    questionsData.forEach(questionData => {
      const question: Question = {
        id: this.currentQuestionId++,
        ...questionData
      };
      this.questions.set(question.id, question);
    });
  }

  // HPS Type definitions and calculations
  private getHPSTypeData(): Record<HPSType, any> {
    return {
      'TDI': {
        name: '강철 리더',
        description: '카리스마 넘치는 절대 리더입니다. 강한 추진력과 명확한 목표 의식을 가지고 있으며, 솔직하고 당당한 성격으로 사람들을 이끕니다.',
        icon: '👑',
        color: 'bg-gradient-to-br from-red-600 to-orange-600',
        characteristics: {
          strengths: ['강력한 리더십', '명확한 목표 의식', '결단력', '추진력'],
          weaknesses: ['독단적일 수 있음', '다른 의견 수용 어려움'],
          careers: ['CEO', '정치인', '창업가', '감독', '군인'],
          celebrities: ['이효리', '송혜교', '한가인'],
          growthTips: ['다른 사람 의견 경청하기', '감정적 배려 늘리기']
        },
        compatibility: {
          perfect: ['ESR' as HPSType],
          good: ['TSR' as HPSType, 'EDR' as HPSType],
          growth: ['TDR' as HPSType, 'TSI' as HPSType]
        }
      },
      'TDR': {
        name: '열정 감화자',
        description: '사람들을 이끄는 카리스마와 강한 존재감을 가진 리더입니다. 열정적이고 사교적이며 팀을 하나로 만드는 능력이 뛰어납니다.',
        icon: '🔥',
        color: 'bg-gradient-to-br from-orange-500 to-red-500',
        characteristics: {
          strengths: ['팀워크', '동기부여', '사교성', '영향력'],
          weaknesses: ['감정 기복', '과도한 관심 필요'],
          careers: ['연예인', '강사', '팀장', '코치', '방송인'],
          celebrities: ['제니', '수지', '에일리'],
          growthTips: ['개인 시간 가져서 에너지 충전', '감정 조절력 기르기']
        },
        compatibility: {
          perfect: ['ESI' as HPSType],
          good: ['EDI' as HPSType, 'TSI' as HPSType],
          growth: ['TDI' as HPSType, 'TSR' as HPSType]
        }
      },
      'TSI': {
        name: '쿨한 독행자',
        description: '혼자서도 강한 사람입니다. 신중하지만 단호하며, 자신만의 길을 걸어가는 독립적인 성향을 가지고 있습니다.',
        icon: '😎',
        color: 'bg-gradient-to-br from-gray-600 to-blue-600',
        characteristics: {
          strengths: ['독립성', '전문성', '집중력', '신중함'],
          weaknesses: ['소통 부족', '고립될 수 있음'],
          careers: ['예술가', '프리랜서', '전문가', '개발자', '연구원'],
          celebrities: ['현아', '솔로지옥 프리지아'],
          growthTips: ['소통의 중요성 인식', '표현력 기르기']
        },
        compatibility: {
          perfect: ['EDR' as HPSType],
          good: ['ESR' as HPSType, 'TDR' as HPSType],
          growth: ['TSR' as HPSType, 'TDI' as HPSType]
        }
      },
      'TSR': {
        name: '든든한 버팀목',
        description: '조용히 팀을 지원하는 힘을 가진 신뢰할 수 있는 동반자입니다. 책임감이 강하고 겸손하며 안정감을 제공합니다.',
        icon: '🛡️',
        color: 'bg-gradient-to-br from-blue-500 to-indigo-500',
        characteristics: {
          strengths: ['신뢰성', '책임감', '안정감', '지지력'],
          weaknesses: ['자기주장 약함', '수동적일 수 있음'],
          careers: ['매니저', '기획자', '컨설턴트', '프로듀서', '엔지니어'],
          celebrities: ['환승연애 이지연'],
          growthTips: ['자신의 의견 당당하게 표현', '주도성 기르기']
        },
        compatibility: {
          perfect: ['EDI' as HPSType],
          good: ['TDI' as HPSType, 'ESI' as HPSType],
          growth: ['TSI' as HPSType, 'TDR' as HPSType]
        }
      },
      'EDI': {
        name: '당당한 프리스피릿',
        description: '감성적이지만 당당한 자유로운 영혼입니다. 자기 표현이 확실하고 독특한 매력을 가진 예술적 성향이 강합니다.',
        icon: '✨',
        color: 'bg-gradient-to-br from-purple-500 to-pink-400',
        characteristics: {
          strengths: ['창의력', '표현력', '예술성', '개성'],
          weaknesses: ['변덕스러움', '현실감 부족할 수 있음'],
          careers: ['아티스트', '인플루언서', '디자이너', '작가', '배우'],
          celebrities: ['아이유', '태연'],
          growthTips: ['현실적 계획과 실행력 기르기', '일관성 유지하기']
        },
        compatibility: {
          perfect: ['TSR' as HPSType],
          good: ['TDR' as HPSType, 'ESR' as HPSType],
          growth: ['EDR' as HPSType, 'ESI' as HPSType]
        }
      },
      'EDR': {
        name: '따뜻한 리더',
        description: '감정적 지능이 높은 리더입니다. 사람들과 깊이 소통하며 공감력과 포용력을 바탕으로 따뜻하게 이끕니다.',
        icon: '🌟',
        color: 'bg-gradient-to-br from-pink-400 to-purple-400',
        characteristics: {
          strengths: ['공감력', '포용력', '소통력', '치유력'],
          weaknesses: ['감정적일 수 있음', '결정 어려움'],
          careers: ['상담사', '교사', 'HR', '사회복지사', '간호사'],
          celebrities: ['박보영', '김태희'],
          growthTips: ['자신의 감정도 챙기기', '객관적 판단력 기르기']
        },
        compatibility: {
          perfect: ['TSI' as HPSType],
          good: ['TDI' as HPSType, 'EDI' as HPSType],
          growth: ['ESR' as HPSType, 'ESI' as HPSType]
        }
      },
      'ESI': {
        name: '신비로운 몽상가',
        description: '깊은 내면 세계를 가진 예술적 감각이 뛰어난 사람입니다. 감수성이 풍부하고 창의적이며 독창적 사고를 가지고 있습니다.',
        icon: '🌙',
        color: 'bg-gradient-to-br from-indigo-500 to-purple-500',
        characteristics: {
          strengths: ['감수성', '창의성', '직감력', '예술성'],
          weaknesses: ['현실감 부족', '소극적일 수 있음'],
          careers: ['작가', '화가', '음악가', '연구원', '치료사'],
          celebrities: ['신세경', '정유진'],
          growthTips: ['사회적 관계에서 더 적극적이 되기', '현실적 계획 세우기']
        },
        compatibility: {
          perfect: ['TDR' as HPSType],
          good: ['TSR' as HPSType, 'ESR' as HPSType],
          growth: ['EDI' as HPSType, 'EDR' as HPSType]
        }
      },
      'ESR': {
        name: '순수한 치유자',
        description: '극도로 섬세하고 배려 깊은 평화주의자입니다. 조화를 중시하며 다른 사람들에게 힐링을 주는 순수한 마음을 가지고 있습니다.',
        icon: '🕊️',
        color: 'bg-gradient-to-br from-green-400 to-blue-400',
        characteristics: {
          strengths: ['섬세함', '배려심', '힐링력', '순수함'],
          weaknesses: ['상처받기 쉬움', '우유부단할 수 있음'],
          careers: ['간호사', '유치원교사', '치료사', '카운슬러', '사회복지사'],
          celebrities: ['장원영', '박지현'],
          growthTips: ['자기 확신과 주체성 기르기', '강인함 기르기']
        },
        compatibility: {
          perfect: ['TDI' as HPSType],
          good: ['TSI' as HPSType, 'EDI' as HPSType],
          growth: ['ESI' as HPSType, 'EDR' as HPSType]
        }
      }
    };
  }

  public calculateHPSResult(answers: Array<{ questionId: number; optionIndex: number }>): HPSResult {
    const questions = Array.from(this.questions.values());
    const questionMap = new Map(questions.map(q => [q.id, q]));
    
    const scores: HPSScores = { T: 0, E: 0, D: 0, S: 0, I: 0, R: 0 };
    
    // Calculate scores for each dimension
    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (question && question.options[answer.optionIndex]) {
        const option = question.options[answer.optionIndex];
        scores.T += option.T;
        scores.E += option.E;
        scores.D += option.D;
        scores.S += option.S;
        scores.I += option.I;
        scores.R += option.R;
      }
    }
    
    // Determine type based on highest scores in each dimension
    const hormoneType = scores.T > scores.E ? 'T' : 'E';
    const actionType = scores.D > scores.S ? 'D' : 'S';
    const focusType = scores.I > scores.R ? 'I' : 'R';
    
    const type = `${hormoneType}${actionType}${focusType}` as HPSType;
    
    // Calculate percentages
    const hormoneTotal = scores.T + scores.E;
    const actionTotal = scores.D + scores.S;
    const focusTotal = scores.I + scores.R;
    
    const percentages = {
      hormone: hormoneTotal > 0 ? Math.round((scores.T / hormoneTotal) * 100) : 50,
      action: actionTotal > 0 ? Math.round((scores.D / actionTotal) * 100) : 50,
      focus: focusTotal > 0 ? Math.round((scores.I / focusTotal) * 100) : 50
    };
    
    // Get type data
    const typeData = this.getHPSTypeData()[type];
    
    return {
      type,
      name: typeData.name,
      description: typeData.description,
      icon: typeData.icon,
      color: typeData.color,
      scores,
      percentages,
      characteristics: typeData.characteristics,
      compatibility: typeData.compatibility
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);}

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values()).sort((a, b) => a.order - b.order);
  }

  async saveTestResult(result: InsertTestResult): Promise<TestResult> {
    const testResult: TestResult = {
      id: this.currentResultId++,
      ...result,
      gender: result.gender || null
    };
    this.results.set(result.sessionId, testResult);
    return testResult;
  }

  async getTestResult(sessionId: string): Promise<TestResult | undefined> {
    return this.results.get(sessionId);
  }
}

export const storage = new MemStorage();
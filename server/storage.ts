import { users, testQuestions, testResults, type User, type InsertUser, type TestQuestion, type TestResult, type InsertTestResult, type Question } from "@shared/schema";

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

  private initializeQuestions() {
    const questionsData: Omit<Question, 'id'>[] = [
      {
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
        text: "새로운 프로젝트를 시작할 때 가장 중요하게 생각하는 것은?",
        options: [
          { text: "팀원들과의 화합과 협력", estrogen: 3, testosterone: 0 },
          { text: "명확한 목표 설정과 성과", estrogen: 0, testosterone: 3 },
          { text: "과정에서의 배움과 성장", estrogen: 2, testosterone: 1 },
          { text: "경쟁에서 이기는 것", estrogen: 0, testosterone: 2 }
        ],
        order: 2
      },
      {
        text: "스트레스를 받을 때 주로 어떻게 해소하나요?",
        options: [
          { text: "친구들과 대화하며 감정을 공유한다", estrogen: 3, testosterone: 0 },
          { text: "혼자만의 시간을 가지며 문제를 분석한다", estrogen: 0, testosterone: 3 },
          { text: "음악을 듣거나 예술 활동을 한다", estrogen: 2, testosterone: 1 },
          { text: "운동이나 신체 활동을 한다", estrogen: 1, testosterone: 2 }
        ],
        order: 3
      },
      {
        text: "의사결정을 할 때 주로 무엇을 고려하나요?",
        options: [
          { text: "다른 사람들에게 미칠 영향", estrogen: 3, testosterone: 0 },
          { text: "객관적인 데이터와 사실", estrogen: 0, testosterone: 3 },
          { text: "직감과 느낌", estrogen: 2, testosterone: 1 },
          { text: "효율성과 결과", estrogen: 1, testosterone: 2 }
        ],
        order: 4
      },
      {
        text: "팀 활동에서 당신의 역할은?",
        options: [
          { text: "팀원들의 의견을 조율하는 중재자", estrogen: 3, testosterone: 0 },
          { text: "전략을 세우고 실행하는 리더", estrogen: 0, testosterone: 3 },
          { text: "아이디어를 제공하는 창의적 역할", estrogen: 2, testosterone: 1 },
          { text: "경쟁력을 높이는 동력 역할", estrogen: 0, testosterone: 2 }
        ],
        order: 5
      },
      {
        text: "위험한 상황에서 당신의 반응은?",
        options: [
          { text: "신중하게 상황을 파악한 후 행동한다", estrogen: 3, testosterone: 0 },
          { text: "즉시 대응하여 상황을 해결한다", estrogen: 0, testosterone: 3 },
          { text: "다른 사람의 도움을 구한다", estrogen: 2, testosterone: 1 },
          { text: "도전으로 받아들이고 적극적으로 대처한다", estrogen: 0, testosterone: 2 }
        ],
        order: 6
      },
      {
        text: "성공을 측정하는 기준은?",
        options: [
          { text: "주변 사람들과의 좋은 관계", estrogen: 3, testosterone: 0 },
          { text: "목표 달성과 성과", estrogen: 0, testosterone: 3 },
          { text: "개인적 만족과 행복", estrogen: 2, testosterone: 1 },
          { text: "경쟁에서의 우위", estrogen: 0, testosterone: 2 }
        ],
        order: 7
      },
      {
        text: "새로운 사람을 만날 때 가장 먼저 주목하는 것은?",
        options: [
          { text: "그 사람의 감정과 표정", estrogen: 3, testosterone: 0 },
          { text: "그 사람의 능력과 성취", estrogen: 0, testosterone: 3 },
          { text: "그 사람의 관심사와 취미", estrogen: 2, testosterone: 1 },
          { text: "그 사람의 자신감과 카리스마", estrogen: 1, testosterone: 2 }
        ],
        order: 8
      },
      {
        text: "문제 해결 시 선호하는 방식은?",
        options: [
          { text: "여러 사람의 의견을 듣고 합의점을 찾는다", estrogen: 3, testosterone: 0 },
          { text: "체계적으로 분석하여 최적해를 찾는다", estrogen: 0, testosterone: 3 },
          { text: "창의적이고 혁신적인 방법을 시도한다", estrogen: 2, testosterone: 1 },
          { text: "빠르고 효과적인 해결책을 실행한다", estrogen: 1, testosterone: 2 }
        ],
        order: 9
      },
      {
        text: "여가 시간에 주로 무엇을 하나요?",
        options: [
          { text: "친구나 가족과 시간을 보낸다", estrogen: 3, testosterone: 0 },
          { text: "새로운 기술이나 지식을 배운다", estrogen: 0, testosterone: 3 },
          { text: "예술, 문화 활동을 즐긴다", estrogen: 2, testosterone: 1 },
          { text: "스포츠나 경쟁적인 게임을 한다", estrogen: 0, testosterone: 2 }
        ],
        order: 10
      },
      {
        text: "실패했을 때 당신의 반응은?",
        options: [
          { text: "다른 사람들의 위로와 조언을 구한다", estrogen: 3, testosterone: 0 },
          { text: "실패 원인을 분석하고 개선책을 찾는다", estrogen: 0, testosterone: 3 },
          { text: "감정을 충분히 표현하고 받아들인다", estrogen: 2, testosterone: 1 },
          { text: "더 강하게 도전하여 극복한다", estrogen: 0, testosterone: 2 }
        ],
        order: 11
      },
      {
        text: "리더십 스타일로 가장 적합한 것은?",
        options: [
          { text: "팀원들의 의견을 존중하고 격려하는 스타일", estrogen: 3, testosterone: 0 },
          { text: "명확한 방향 제시와 결단력 있는 스타일", estrogen: 0, testosterone: 3 },
          { text: "창의성을 자극하고 영감을 주는 스타일", estrogen: 2, testosterone: 1 },
          { text: "성과를 중시하고 경쟁을 유도하는 스타일", estrogen: 0, testosterone: 2 }
        ],
        order: 12
      },
      {
        text: "중요한 발표를 앞두고 있을 때?",
        options: [
          { text: "청중과의 공감대 형성에 집중한다", estrogen: 3, testosterone: 0 },
          { text: "논리적 구조와 데이터 준비에 집중한다", estrogen: 0, testosterone: 3 },
          { text: "창의적인 표현 방법을 고민한다", estrogen: 2, testosterone: 1 },
          { text: "강력한 임팩트와 설득력에 집중한다", estrogen: 1, testosterone: 2 }
        ],
        order: 13
      },
      {
        text: "친구가 고민을 털어놓을 때?",
        options: [
          { text: "공감하며 감정적 지지를 제공한다", estrogen: 3, testosterone: 0 },
          { text: "구체적인 해결책을 제시한다", estrogen: 0, testosterone: 3 },
          { text: "경험담을 나누며 위로한다", estrogen: 2, testosterone: 1 },
          { text: "현실적인 조언을 해준다", estrogen: 1, testosterone: 2 }
        ],
        order: 14
      },
      {
        text: "새로운 환경에 적응할 때?",
        options: [
          { text: "사람들과 관계를 먼저 형성한다", estrogen: 3, testosterone: 0 },
          { text: "규칙과 시스템을 파악한다", estrogen: 0, testosterone: 3 },
          { text: "천천히 관찰하며 적응한다", estrogen: 2, testosterone: 1 },
          { text: "적극적으로 나서서 주도권을 잡는다", estrogen: 0, testosterone: 2 }
        ],
        order: 15
      },
      {
        text: "쇼핑할 때 의사결정 기준은?",
        options: [
          { text: "다른 사람들의 의견과 추천", estrogen: 3, testosterone: 0 },
          { text: "기능성과 실용성", estrogen: 0, testosterone: 3 },
          { text: "감성적 만족도", estrogen: 2, testosterone: 1 },
          { text: "브랜드 가치와 지위", estrogen: 1, testosterone: 2 }
        ],
        order: 16
      },
      {
        text: "영화나 책을 선택할 때 선호하는 장르는?",
        options: [
          { text: "로맨스, 드라마", estrogen: 3, testosterone: 0 },
          { text: "스릴러, SF", estrogen: 0, testosterone: 3 },
          { text: "판타지, 예술영화", estrogen: 2, testosterone: 1 },
          { text: "액션, 어드벤처", estrogen: 0, testosterone: 2 }
        ],
        order: 17
      },
      {
        text: "목표를 설정할 때?",
        options: [
          { text: "다른 사람들과 함께 달성할 수 있는 목표", estrogen: 3, testosterone: 0 },
          { text: "측정 가능하고 구체적인 목표", estrogen: 0, testosterone: 3 },
          { text: "개인적 성장과 발전 목표", estrogen: 2, testosterone: 1 },
          { text: "도전적이고 야심찬 목표", estrogen: 0, testosterone: 2 }
        ],
        order: 18
      },
      {
        text: "피드백을 받을 때?",
        options: [
          { text: "감정적 반응을 먼저 보인다", estrogen: 3, testosterone: 0 },
          { text: "객관적으로 분석하고 수용한다", estrogen: 0, testosterone: 3 },
          { text: "의미를 깊이 생각해본다", estrogen: 2, testosterone: 1 },
          { text: "즉시 개선 방안을 실행한다", estrogen: 1, testosterone: 2 }
        ],
        order: 19
      },
      {
        text: "인생에서 가장 중요한 가치는?",
        options: [
          { text: "사랑과 인간관계", estrogen: 3, testosterone: 0 },
          { text: "성취와 성공", estrogen: 0, testosterone: 3 },
          { text: "자유와 창의성", estrogen: 2, testosterone: 1 },
          { text: "도전과 모험", estrogen: 0, testosterone: 2 }
        ],
        order: 20
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

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

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

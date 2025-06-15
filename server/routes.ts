import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { TestScores } from "@shared/schema";

const submitAnswersSchema = z.object({
  sessionId: z.string(),
  answers: z.array(z.object({
    questionId: z.number(),
    optionIndex: z.number()
  })),
  gender: z.string().nullable().optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all test questions
  app.get("/api/questions", async (_req, res) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  // Submit test answers and get results
  app.post("/api/submit-test", async (req, res) => {
    try {
      const { sessionId, answers, gender } = submitAnswersSchema.parse(req.body);
      
      // Get all questions for scoring
      const questions = await storage.getAllQuestions();
      const questionMap = new Map(questions.map(q => [q.id, q]));
      
      // Calculate scores
      let estrogenScore = 0;
      let testosteroneScore = 0;
      
      for (const answer of answers) {
        const question = questionMap.get(answer.questionId);
        if (question && question.options[answer.optionIndex]) {
          const option = question.options[answer.optionIndex];
          estrogenScore += option.estrogen;
          testosteroneScore += option.testosterone;
        }
      }
      
      // Calculate percentages and determine result type
      const totalScore = estrogenScore + testosteroneScore;
      const estrogenPercentage = Math.round((estrogenScore / totalScore) * 100);
      const testosteronePercentage = Math.round((testosteroneScore / totalScore) * 100);
      
      // Determine result type and details based on gender
      let resultType: string;
      let resultTitle: string;
      let resultDescription: string;
      let resultIcon: string;
      let resultColor: string;
      
      const genderSuffix = gender === 'male' ? '남' : gender === 'female' ? '녀' : '';
      
      if (estrogenPercentage > testosteronePercentage) {
        if (estrogenPercentage >= 70) {
          resultType = 'strong_estrogen';
          resultTitle = `에스트로겐 강함 (에겐${genderSuffix})`;
          resultDescription = '당신은 매우 협력적이고 공감적인 성격을 가지고 있습니다. 관계 중심적이며 감정적 지능이 높아 다른 사람들과 깊은 유대감을 형성하는 것을 중요하게 생각합니다.';
          resultIcon = 'fas fa-heart';
          resultColor = 'bg-gradient-to-br from-pink-500 to-purple-500';
        } else {
          resultType = 'moderate_estrogen';
          resultTitle = `에스트로겐 우세 (에겐${genderSuffix})`;
          resultDescription = '당신은 협력과 경쟁의 균형을 잘 맞추는 성격입니다. 감정적 지능과 논리적 사고를 모두 활용하며, 상황에 따라 유연하게 대처합니다.';
          resultIcon = 'fas fa-balance-scale';
          resultColor = 'bg-gradient-to-br from-pink-400 to-indigo-500';
        }
      } else {
        if (testosteronePercentage >= 70) {
          resultType = 'strong_testosterone';
          resultTitle = `테스토스테론 강함 (테토${genderSuffix})`;
          resultDescription = '당신은 매우 경쟁적이고 목표 지향적인 성격을 가지고 있습니다. 도전을 즐기며 분석적 사고로 문제를 해결하는 것을 선호합니다.';
          resultIcon = 'fas fa-trophy';
          resultColor = 'bg-gradient-to-br from-blue-500 to-indigo-600';
        } else {
          resultType = 'moderate_testosterone';
          resultTitle = `테스토스테론 우세 (테토${genderSuffix})`;
          resultDescription = '당신은 목표 달성과 인간관계의 균형을 잘 유지하는 성격입니다. 합리적 판단과 감정적 고려를 모두 중요하게 생각합니다.';
          resultIcon = 'fas fa-chess-knight';
          resultColor = 'bg-gradient-to-br from-blue-400 to-purple-500';
        }
      }
      
      // Generate detailed analysis
      const analysis = [];
      
      if (estrogenPercentage > testosteronePercentage) {
        analysis.push({
          title: '주요 강점',
          content: '높은 감정적 지능, 뛰어난 공감 능력, 협력적 리더십, 관계 구축 능력'
        });
        analysis.push({
          title: '의사결정 스타일',
          content: '다양한 관점을 고려하며, 상호 이익을 추구하는 합의 중심적 결정'
        });
        analysis.push({
          title: '추천 직업군',
          content: '상담, 교육, 인사관리, 사회복지, 의료, 예술 분야'
        });
      } else {
        analysis.push({
          title: '주요 강점',
          content: '강한 추진력, 분석적 사고, 목표 지향성, 경쟁력, 리더십'
        });
        analysis.push({
          title: '의사결정 스타일',
          content: '데이터 기반의 논리적 판단, 효율성과 성과를 중시하는 결정'
        });
        analysis.push({
          title: '추천 직업군',
          content: '경영, 엔지니어링, 금융, 영업, 스포츠, 기술 분야'
        });
      }
      
      analysis.push({
        title: '발전 방향',
        content: estrogenPercentage > testosteronePercentage ? 
          '때로는 더 단호한 결정력과 목표 지향적 사고를 기르는 것이 도움될 수 있습니다.' :
          '감정적 지능과 공감 능력을 기르면 더욱 균형잡힌 리더십을 발휘할 수 있습니다.'
      });
      
      // Save test result
      await storage.saveTestResult({
        sessionId,
        answers: JSON.stringify(answers),
        estrogenScore,
        testosteroneScore,
        resultType,
        gender: gender || null,
        completedAt: new Date().toISOString()
      });
      
      // Return calculated results
      const testScores: TestScores = {
        estrogenScore,
        testosteroneScore,
        estrogenPercentage,
        testosteronePercentage,
        resultType,
        resultTitle,
        resultDescription,
        resultIcon,
        resultColor,
        gender: gender ?? undefined,
        analysis
      };
      
      res.json(testScores);
    } catch (error) {
      console.error("Error submitting test:", error);
      res.status(400).json({ error: "Failed to submit test" });
    }
  });

  // Get test result by session ID
  app.get("/api/results/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const result = await storage.getTestResult(sessionId);
      
      if (!result) {
        return res.status(404).json({ error: "Test result not found" });
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching test result:", error);
      res.status(500).json({ error: "Failed to fetch test result" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

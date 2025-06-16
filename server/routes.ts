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
  // Health check endpoints
  app.get("/", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

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
      
      // Calculate HPS result using new system
      const hpsResult = storage.calculateHPSResult(answers);
      
      // Calculate legacy scores for backward compatibility
      const questions = await storage.getAllQuestions();
      const questionMap = new Map(questions.map(q => [q.id, q]));
      
      let estrogenScore = 0;
      let testosteroneScore = 0;
      
      // Legacy calculation (simplified)
      for (const answer of answers) {
        const question = questionMap.get(answer.questionId);
        if (question && question.options[answer.optionIndex]) {
          const option = question.options[answer.optionIndex];
          estrogenScore += option.E;
          testosteroneScore += option.T;
        }
      }
      
      const totalScore = estrogenScore + testosteroneScore || 1;
      const estrogenPercentage = Math.round((estrogenScore / totalScore) * 100);
      const testosteronePercentage = Math.round((testosteroneScore / totalScore) * 100);
      
      // Generate new HPS-based analysis
      const analysis = [
        {
          title: '주요 강점',
          content: hpsResult.characteristics.strengths.join(', ')
        },
        {
          title: '성장 포인트',
          content: hpsResult.characteristics.growthTips.join(', ')
        },
        {
          title: '추천 직업군',
          content: hpsResult.characteristics.careers.join(', ')
        },
        {
          title: '유명인 유형',
          content: hpsResult.characteristics.celebrities.join(', ')
        }
      ];
      
      // Save test result
      await storage.saveTestResult({
        sessionId,
        answers: JSON.stringify(answers),
        estrogenScore,
        testosteroneScore,
        resultType: hpsResult.type,
        gender: gender || null,
        completedAt: new Date().toISOString()
      });
      
      // Return results with both legacy and new HPS data
      const testScores: TestScores = {
        // Legacy fields
        estrogenScore,
        testosteroneScore,
        estrogenPercentage,
        testosteronePercentage,
        resultType: hpsResult.type,
        resultTitle: `${hpsResult.name} (${hpsResult.type})`,
        resultDescription: hpsResult.description,
        resultIcon: hpsResult.icon,
        resultColor: hpsResult.color,
        gender: gender ?? undefined,
        analysis,
        // New HPS result
        hpsResult
      };
      
      res.json(testScores);
    } catch (error) {
      console.error("Error submitting test:", error);
      res.status(400).json({ error: "Failed to submit test" });
    }
  });

  // Get HPS compatibility between two types
  app.get("/api/compatibility/:type1/:type2", async (req, res) => {
    try {
      const { type1, type2 } = req.params;
      
      // Simple compatibility calculation
      const dummyAnswers = []; // This would need actual logic
      const result1 = storage.calculateHPSResult(dummyAnswers);
      
      // For now, return basic compatibility info
      const compatibility = {
        type1,
        type2,
        rating: 3, // Out of 5
        description: "좋은 궁합입니다"
      };
      
      res.json(compatibility);
    } catch (error) {
      console.error("Error calculating compatibility:", error);
      res.status(500).json({ error: "Failed to calculate compatibility" });
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

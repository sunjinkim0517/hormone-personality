import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const testQuestions = pgTable("test_questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  options: jsonb("options").notNull(), // Array of option objects with text, estrogen, testosterone scores
  order: integer("order").notNull(),
});

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  answers: jsonb("answers").notNull(), // Array of answer indices
  estrogenScore: integer("estrogen_score").notNull(),
  testosteroneScore: integer("testosterone_score").notNull(),
  resultType: text("result_type").notNull(),
  gender: text("gender"),
  completedAt: text("completed_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTestQuestionSchema = createInsertSchema(testQuestions);
export const insertTestResultSchema = createInsertSchema(testResults);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TestQuestion = typeof testQuestions.$inferSelect;
export type TestResult = typeof testResults.$inferSelect;
export type InsertTestQuestion = z.infer<typeof insertTestQuestionSchema>;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;

// Test data types
export interface QuestionOption {
  text: string;
  // New HPS system: H (hormone), A (action), F (focus)
  T: number; // Testosterone tendency
  E: number; // Estrogen tendency  
  D: number; // Direct action
  S: number; // Subtle action
  I: number; // Individual focus
  R: number; // Relational focus
}

export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  order: number;
  dimension: 'H' | 'A' | 'F'; // Which dimension this question measures
}

export interface TestAnswer {
  questionId: number;
  optionIndex: number;
}

// HPS (Hormone Personality System) Types
export type HPSType = 'TDI' | 'TDR' | 'TSI' | 'TSR' | 'EDI' | 'EDR' | 'ESI' | 'ESR';

export interface HPSScores {
  T: number; // Testosterone
  E: number; // Estrogen  
  D: number; // Direct
  S: number; // Subtle
  I: number; // Individual
  R: number; // Relational
}

export interface HPSResult {
  type: HPSType;
  name: string;
  description: string;
  icon: string;
  color: string;
  scores: HPSScores;
  percentages: {
    hormone: number; // T vs E percentage
    action: number;  // D vs S percentage  
    focus: number;   // I vs R percentage
  };
  characteristics: {
    strengths: string[];
    weaknesses: string[];
    careers: string[];
    celebrities: string[];
    growthTips: string[];
  };
  compatibility: {
    perfect: HPSType[];
    good: HPSType[];
    growth: HPSType[];
  };
}

export interface TestScores {
  // Legacy fields for backward compatibility
  estrogenScore: number;
  testosteroneScore: number;
  estrogenPercentage: number;
  testosteronePercentage: number;
  resultType: string;
  resultTitle: string;
  resultDescription: string;
  resultIcon: string;
  resultColor: string;
  gender?: string;
  analysis: Array<{
    title: string;
    content: string;
  }>;
  // New HPS result
  hpsResult?: HPSResult;
}

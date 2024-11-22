import z from "zod";
export const OptionSchema = z.object({
  optionText: z.string(),
  isCorrect: z.boolean(),
});

export const AddNewQuestionSchema = z.object({
  question: z.string(),
  quizId: z.string(),
  options: z.array(OptionSchema),
});

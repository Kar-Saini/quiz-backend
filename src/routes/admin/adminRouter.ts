import { json, Router } from "express";
import adminAuthMiddleware from "../../middleware/adminAuthMiddleware";
import prisma from "../../lib/utils";

const adminRouter = Router();

export default adminRouter;

//createQuiz
adminRouter.post("/createQuiz", adminAuthMiddleware, async (req, res) => {
  try {
    console.log("Inside crete quiz");
    const {
      description,
      scheduledStartTime,
      scheduledEndTime,
      userId,
      rewardValue,
    } = req.body;
    console.log(description, scheduledStartTime, scheduledEndTime, req.userId);
    const quiz = await prisma.quiz.create({
      data: {
        description,
        scheduledEndTime,
        scheduledStartTime,
        creatorId: userId,
        rewardValue,
        quizPrice: "10000",
      },
    });
    console.log(quiz);
    res.json({ message: "Quiz created", quizId: quiz.id });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

//addQuestion
adminRouter.post("/addQuestion", async (req, res) => {
  try {
    const { question, quizId, options, userId } = req.body;

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      res.status(400).json({ message: "Invalid quiz ID" });
    }
    const newQuestionAdded = await prisma.$transaction(async (p) => {
      const newQuestion = await p.question.create({
        data: {
          question,
          quizId,
          creatorId: userId,
        },
      });
      const optionsData = options.map(
        (option: { optionText: string; isCorrect: boolean }) => ({
          choice: option.optionText,
          questionId: newQuestion.id,
          isCorrect: option.isCorrect,
        })
      );
      await prisma.option.createMany({ data: optionsData });
      return newQuestion;
    });
    res.json({ message: "Question added", questionId: newQuestionAdded.id });
  } catch (err) {
    res
      .status(500)
      .json({ message: "An error occurred while adding the question" });
  }
});

//deleteQuestion
adminRouter.delete(
  "/question/:questionId",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const questionId = req.params.questionId;
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      });
      if (!question) {
        res.status(401).json({ message: "Invalid question id" });
        return;
      }
      await prisma.question.delete({ where: { id: questionId } });
      res.json({ message: "Question deleted" });
    } catch (error) {
      res.status(401).json({ message: "Error while deleteing question" });
    }
  }
);
//delete quiz
adminRouter.delete("/quiz/:quizId", adminAuthMiddleware, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });
    if (!quiz) {
      res.status(401).json({ message: "Invalid quiz id" });
      return;
    }
    await prisma.quiz.delete({ where: { id: quizId } });
    res.json({ message: "Quiz deleted" });
  } catch (error) {
    res.status(401).json({ message: "Error while deleteing quiz" });
  }
});
//updateQuiz
adminRouter.post("/quiz/:quizId", adminAuthMiddleware, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });
    if (!quiz) {
      res.status(401).json({ message: "Invalid quiz id" });
    }
    const { description, scheduledStartTime, scheduledEndTime } = req.body;
    const updateData: {
      description?: string;
      scheduledStartTime?: string;
      scheduledEndTime?: string;
    } = {};

    if (description !== undefined) updateData.description = description;
    if (scheduledStartTime !== undefined)
      updateData.scheduledStartTime = scheduledStartTime;
    if (scheduledEndTime !== undefined)
      updateData.scheduledEndTime = scheduledEndTime;

    await prisma.quiz.update({
      where: { id: quizId },
      data: updateData,
    });
    res.json({ message: "Quiz updated" });
  } catch (error) {
    res.status(401).json({ message: "Error while updating quiz" });
  }
});

//updateQuizQuestion
adminRouter.post(
  "/question/:questionId",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const questionId = req.params.questionId;
      const questionExists = await prisma.question.findUnique({
        where: { id: questionId },
      });
      if (!questionExists) {
        res.status(401).json({ message: "Invalid question id" });
      }
      const {
        question,
        options,
      }: {
        question: string;
        options: { option: string; isCorrect: boolean }[];
      } = req.body;
      const updateQuestion: {
        question?: string;
        options?: { option: string; isCorrect: boolean }[];
      } = {};

      if (question !== undefined) updateQuestion.question = question;
      if (options.length > 0) {
        updateQuestion.options = options;
      }
      await prisma.question.update({
        where: { id: questionId },
        data: {
          question: updateQuestion.question,
        },
      });
      updateQuestion.options?.map(async (option) => {});
      //TODO : Update options efficiently
      res.json({ message: "Quiz updated" });
    } catch (error) {
      res.status(401).json({ message: "Error while updating quiz" });
    }
  }
);

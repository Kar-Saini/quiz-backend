import { Router } from "express";

import userAuthMiddleware from "../../middleware/userAuthMiddleware";
import prisma from "../../lib/utils";
const userRouter = Router();

userRouter.get("/", userAuthMiddleware, async (req, res) => {
  console.log(req.userId);
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    res.status(400).json({ message: "No user found" });
    return;
  }
  res.json({
    userId: req.userId,
    userRole: req.userRole,
    phoneNumber: user?.phoneNumber,
    username: user?.username,
    gender: user?.gender,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

userRouter.get("/quizes", userAuthMiddleware, async (req, res) => {
  try {
    const quizes = await prisma.quiz.findMany({
      select: {
        description: true,
        scheduledStartTime: true,
        scheduledEndTime: true,
        status: true,
        _count: {
          select: {
            attemptedUsers: true,
            registeredUsers: true,
            questions: true,
          },
        },
      },
    });
    res.json(quizes);
  } catch (error) {}
});

userRouter.get("/quiz/:quizId", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const questions = await prisma.question.findMany({
      where: { quizId },
      select: { question: true, options: true },
    });
    res.json(questions);
  } catch (error) {}
});

export default userRouter;

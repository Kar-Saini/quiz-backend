"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userAuthMiddleware_1 = __importDefault(require("../../middleware/userAuthMiddleware"));
const utils_1 = __importDefault(require("../../lib/utils"));
const userRouter = (0, express_1.Router)();
userRouter.get("/", userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.userId);
    const user = yield utils_1.default.user.findUnique({ where: { id: req.userId } });
    if (!user) {
        res.status(400).json({ message: "No user found" });
        return;
    }
    res.json({
        userId: req.userId,
        userRole: req.userRole,
        phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
        username: user === null || user === void 0 ? void 0 : user.username,
        gender: user === null || user === void 0 ? void 0 : user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}));
userRouter.get("/quizes", userAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizes = yield utils_1.default.quiz.findMany({
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
    }
    catch (error) { }
}));
userRouter.get("/quiz/:quizId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.params.quizId;
        const questions = yield utils_1.default.question.findMany({
            where: { quizId },
            select: { question: true, options: true },
        });
        res.json(questions);
    }
    catch (error) { }
}));
exports.default = userRouter;

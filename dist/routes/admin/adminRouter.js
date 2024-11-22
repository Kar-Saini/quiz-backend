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
const adminAuthMiddleware_1 = __importDefault(require("../../middleware/adminAuthMiddleware"));
const utils_1 = __importDefault(require("../../lib/utils"));
const adminRouter = (0, express_1.Router)();
exports.default = adminRouter;
//createQuiz
adminRouter.post("/createQuiz", adminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Inside crete quiz");
        const { description, scheduledStartTime, scheduledEndTime, userId } = req.body;
        console.log(description, scheduledStartTime, scheduledEndTime, req.userId);
        const quiz = yield utils_1.default.quiz.create({
            data: {
                description,
                scheduledEndTime,
                scheduledStartTime,
                creatorId: userId,
            },
        });
        console.log(quiz);
        res.json({ message: "Quiz created", quizId: quiz.id });
    }
    catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}));
//addQuestion
adminRouter.post("/addQuestion", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, quizId, options, userId } = req.body;
        const quiz = yield utils_1.default.quiz.findUnique({ where: { id: quizId } });
        if (!quiz) {
            res.status(400).json({ message: "Invalid quiz ID" });
        }
        const newQuestionAdded = yield utils_1.default.$transaction((p) => __awaiter(void 0, void 0, void 0, function* () {
            const newQuestion = yield p.question.create({
                data: {
                    question,
                    quizId,
                    creatorId: userId,
                },
            });
            const optionsData = options.map((option) => ({
                choice: option.optionText,
                questionId: newQuestion.id,
                isCorrect: option.isCorrect,
            }));
            yield utils_1.default.option.createMany({ data: optionsData });
            return newQuestion;
        }));
        res.json({ message: "Question added", questionId: newQuestionAdded.id });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "An error occurred while adding the question" });
    }
}));
//deleteQuestion
adminRouter.delete("/:questionId", adminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.params.questionId;
        console.log();
    }
    catch (error) { }
}));

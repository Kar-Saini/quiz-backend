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
        const { description, scheduledStartTime, scheduledEndTime, userId, rewardValue, } = req.body;
        console.log(description, scheduledStartTime, scheduledEndTime, req.userId);
        const quiz = yield utils_1.default.quiz.create({
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
adminRouter.delete("/question/:questionId", adminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.params.questionId;
        const question = yield utils_1.default.question.findUnique({
            where: { id: questionId },
        });
        if (!question) {
            res.status(401).json({ message: "Invalid question id" });
            return;
        }
        yield utils_1.default.question.delete({ where: { id: questionId } });
        res.json({ message: "Question deleted" });
    }
    catch (error) {
        res.status(401).json({ message: "Error while deleteing question" });
    }
}));
//delete quiz
adminRouter.delete("/quiz/:quizId", adminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.params.quizId;
        const quiz = yield utils_1.default.quiz.findUnique({
            where: { id: quizId },
        });
        if (!quiz) {
            res.status(401).json({ message: "Invalid quiz id" });
            return;
        }
        yield utils_1.default.quiz.delete({ where: { id: quizId } });
        res.json({ message: "Quiz deleted" });
    }
    catch (error) {
        res.status(401).json({ message: "Error while deleteing quiz" });
    }
}));
//updateQuiz
adminRouter.post("/quiz/:quizId", adminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = req.params.quizId;
        const quiz = yield utils_1.default.quiz.findUnique({
            where: { id: quizId },
        });
        if (!quiz) {
            res.status(401).json({ message: "Invalid quiz id" });
        }
        const { description, scheduledStartTime, scheduledEndTime } = req.body;
        const updateData = {};
        if (description !== undefined)
            updateData.description = description;
        if (scheduledStartTime !== undefined)
            updateData.scheduledStartTime = scheduledStartTime;
        if (scheduledEndTime !== undefined)
            updateData.scheduledEndTime = scheduledEndTime;
        yield utils_1.default.quiz.update({
            where: { id: quizId },
            data: updateData,
        });
        res.json({ message: "Quiz updated" });
    }
    catch (error) {
        res.status(401).json({ message: "Error while updating quiz" });
    }
}));
//updateQuizQuestion
adminRouter.post("/question/:questionId", adminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const questionId = req.params.questionId;
        const questionExists = yield utils_1.default.question.findUnique({
            where: { id: questionId },
        });
        if (!questionExists) {
            res.status(401).json({ message: "Invalid question id" });
        }
        const { question, options, } = req.body;
        const updateQuestion = {};
        if (question !== undefined)
            updateQuestion.question = question;
        if (options.length > 0) {
            updateQuestion.options = options;
        }
        yield utils_1.default.question.update({
            where: { id: questionId },
            data: {
                question: updateQuestion.question,
            },
        });
        (_a = updateQuestion.options) === null || _a === void 0 ? void 0 : _a.map((option) => __awaiter(void 0, void 0, void 0, function* () { }));
        //TODO : Update options efficiently
        res.json({ message: "Quiz updated" });
    }
    catch (error) {
        res.status(401).json({ message: "Error while updating quiz" });
    }
}));

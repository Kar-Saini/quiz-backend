"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNewQuestionSchema = exports.OptionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.OptionSchema = zod_1.default.object({
    optionText: zod_1.default.string(),
    isCorrect: zod_1.default.boolean(),
});
exports.AddNewQuestionSchema = zod_1.default.object({
    question: zod_1.default.string(),
    quizId: zod_1.default.string(),
    options: zod_1.default.array(exports.OptionSchema),
});

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
const zod_1 = require("zod");
const utils_1 = __importDefault(require("../lib/utils"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRouter = (0, express_1.Router)();
userRouter.get("/", (req, res) => {
    res.json({ message: "User" });
});
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const parsedData = UserRegisterSchema.safeParse(req.body);
        if (!parsedData.success || parsedData.error) {
            res.json({ message: parsedData.error }).status(401);
        }
        const hashedPassword = yield bcrypt_1.default.hash(((_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.password) || "", 10);
        const user = yield utils_1.default.user.create({
            data: {
                email: (_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.email,
                password: hashedPassword,
                phoneNumber: (_c = parsedData.data) === null || _c === void 0 ? void 0 : _c.phoneNumber,
            },
        });
        res.json({ message: "User added", id: user.id });
    }
    catch (error) {
        res.json({ message: "Something went wring" }).status(403);
    }
}));
exports.default = userRouter;
const UserRegisterSchema = zod_1.z
    .object({
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(6, { message: "Password mut be atleast of 6 characters" }),
    phoneNumber: zod_1.z.string(),
})
    .strict();

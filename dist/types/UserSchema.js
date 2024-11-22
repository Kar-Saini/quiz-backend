"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSignInSchema = exports.UserRegisterSchema = void 0;
const zod_1 = require("zod");
exports.UserRegisterSchema = zod_1.z
    .object({
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(6, { message: "Password mut be atleast of 6 characters" }),
    phoneNumber: zod_1.z.string(),
    userRole: zod_1.z.string().optional(),
})
    .strict();
exports.UserSignInSchema = zod_1.z
    .object({
    password: zod_1.z
        .string()
        .min(6, { message: "Password mut be atleast of 6 characters" }),
    phoneNumber: zod_1.z.string(),
})
    .strict();

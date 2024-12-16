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
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./routes/user/userRouter"));
const adminRouter_1 = __importDefault(require("./routes/admin/adminRouter"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema_1 = require("./types/UserSchema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = __importDefault(require("./lib/utils"));
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "Healthy sever" });
});
app.listen(PORT, () => {
    console.log("Server listening on PORT :" + PORT);
});
//Register
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log("iside register");
    try {
        const parsedData = UserSchema_1.UserRegisterSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({ error: (_a = parsedData.error) === null || _a === void 0 ? void 0 : _a.errors[0].message });
            return;
        }
        console.log(parsedData);
        const hashedPassword = yield bcrypt_1.default.hash((_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password, 10);
        //TODO : Fetch amount from wallet
        const user = yield utils_1.default.user.create({
            data: {
                email: (_c = parsedData.data) === null || _c === void 0 ? void 0 : _c.email,
                password: hashedPassword,
                phoneNumber: (_d = parsedData.data) === null || _d === void 0 ? void 0 : _d.phoneNumber,
                userRole: parsedData.data.userRole === "ADMIN" ? "ADMIN" : "USER",
                amount: "10000",
                lockedAmount: "5000",
            },
        });
        res.json({ message: "User added", id: user.id, userRole: user.userRole });
    }
    catch (error) {
        res.json({ message: "Something went wrong" }).status(403);
    }
}));
//Signin
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const parsedData = UserSchema_1.UserSignInSchema.safeParse(req.body);
        console.log((_a = parsedData.error) === null || _a === void 0 ? void 0 : _a.errors[0].message);
        if (!parsedData.success) {
            res.status(400).json({ error: (_b = parsedData.error) === null || _b === void 0 ? void 0 : _b.errors[0].message });
            return;
        }
        const userExists = yield utils_1.default.user.findUnique({
            where: { phoneNumber: parsedData.data.phoneNumber },
        });
        if (!userExists) {
            res.json({ message: "Invalid Phone Number" }).status(400);
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(parsedData.data.password, userExists.password);
        if (!isPasswordValid) {
            res.json({ message: "Invalid password" }).status(400);
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userRole: userExists.userRole,
            phoneNumber: userExists.phoneNumber,
            userId: userExists.id,
        }, process.env.SECRET_KEY || "secret", {
            expiresIn: "2h",
        });
        res.json({ message: "Logged in", token });
    }
    catch (error) {
        console.log(error);
    }
}));
app.use("/user", userRouter_1.default);
app.use("/admin", adminRouter_1.default);

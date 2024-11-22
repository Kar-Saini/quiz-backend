"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.json({ message: "Unauthorized" }).status(403);
            return;
        }
        const decodedToken = jsonwebtoken_1.default.decode(token);
        console.log(decodedToken);
        res.json({ message: "Hello" });
    }
    catch (error) { }
}
exports.default = authMiddleware;

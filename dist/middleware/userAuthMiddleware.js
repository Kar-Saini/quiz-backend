"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function userAuthMiddleware(req, res, next) {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.json({ message: "Unauthorized" }).status(403);
            return;
        }
        const decodedToken = jsonwebtoken_1.default.decode(token);
        if (decodedToken.userRole === "USER") {
            req.userId = decodedToken.userId;
            req.userRole = decodedToken.userRole;
        }
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
}
exports.default = userAuthMiddleware;

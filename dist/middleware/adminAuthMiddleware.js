"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminAuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function adminAuthMiddleware(req, res, next) {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        console.log("Token " + token);
        if (!token) {
            res.json({ message: "Unauthorized" }).status(403);
            return;
        }
        const decodedToken = jsonwebtoken_1.default.decode(token);
        console.log("decodedToken" + decodedToken);
        if (decodedToken.userRole === "ADMIN") {
            req.userId = decodedToken.userId;
            req.userRole = decodedToken.userRole;
        }
        console.log(decodedToken.userId, decodedToken.userRole);
        console.log(req.userId);
        next();
    }
    catch (error) { }
}

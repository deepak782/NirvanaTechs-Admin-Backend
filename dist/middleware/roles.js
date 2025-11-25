"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...allowedRoles) => (req, res, next) => {
    const userRole = req.user?.role;
    if (!allowedRoles.includes(userRole))
        return res.status(403).json({ message: "Access forbidden" });
    next();
};
exports.authorize = authorize;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
// --- REGISTER (Use Only for Initial Setup) ---
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ message: "Email already exists" });
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
        res.json({ message: "User created", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};
exports.register = register;
// --- LOGIN ---
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};
exports.login = login;

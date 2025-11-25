"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTest = exports.getAllTests = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getAllTests = async (req, res) => {
    const tests = await prisma_1.default.test.findMany();
    res.json(tests);
};
exports.getAllTests = getAllTests;
const createTest = async (req, res) => {
    const { message } = req.body;
    const test = await prisma_1.default.test.create({
        data: { message },
    });
    res.json(test);
};
exports.createTest = createTest;

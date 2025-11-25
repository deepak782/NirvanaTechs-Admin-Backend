"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.getClientById = exports.getClients = exports.createClient = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// CREATE CLIENT
const createClient = async (req, res) => {
    try {
        const { name, email, phone, company, whatsapp } = req.body;
        const client = await prisma_1.default.client.create({
            data: { name, email, phone, company, whatsapp },
        });
        return res.json({ message: "Client created", client });
    }
    catch (error) {
        return res.status(500).json({ message: "Error creating client", error });
    }
};
exports.createClient = createClient;
// GET ALL CLIENTS
const getClients = async (req, res) => {
    try {
        const { search = "" } = req.query;
        const clients = await prisma_1.default.client.findMany({
            where: {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search, mode: "insensitive" } },
                    { company: { contains: search, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        });
        return res.json({ clients });
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching clients", error });
    }
};
exports.getClients = getClients;
// GET CLIENT BY ID
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await prisma_1.default.client.findUnique({
            where: { id },
        });
        if (!client)
            return res.status(404).json({ message: "Client not found" });
        return res.json(client);
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching client", error });
    }
};
exports.getClientById = getClientById;
// UPDATE CLIENT
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await prisma_1.default.client.update({
            where: { id },
            data: req.body,
        });
        return res.json({ message: "Client updated", client: updated });
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating client", error });
    }
};
exports.updateClient = updateClient;
// DELETE CLIENT
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.client.delete({
            where: { id },
        });
        return res.json({ message: "Client deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting client", error });
    }
};
exports.deleteClient = deleteClient;

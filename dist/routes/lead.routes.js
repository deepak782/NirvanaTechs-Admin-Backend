"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lead_controller_1 = require("../controllers/lead.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// ➤ order matters: /by-mobile must come BEFORE /:id
router.get("/by-mobile/:mobile", auth_1.authMiddleware, lead_controller_1.getLeadByMobile);
// ➤ create a requirement (or new client + first requirement)
router.post("/", auth_1.authMiddleware, lead_controller_1.createLead);
// ➤ list all requirements (flat list)
router.get("/", auth_1.authMiddleware, lead_controller_1.getLeads);
// ➤ get requirement by its id
router.get("/:id", auth_1.authMiddleware, lead_controller_1.getLeadById);
// ➤ update requirement
router.put("/:id", auth_1.authMiddleware, lead_controller_1.updateLead);
// ➤ delete requirement
router.delete("/:id", auth_1.authMiddleware, lead_controller_1.deleteLead);
exports.default = router;

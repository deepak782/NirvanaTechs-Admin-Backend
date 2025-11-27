import { Router } from "express";
import {
  createLead,           // create new requirement
  getLeads,             // list all requirements (flat)
  getLeadById,          // get a single requirement
  updateLead,           // update requirement
  deleteLead,           // delete requirement
  getLeadByMobile       // fetch client + existing requirements
} from "../controllers/lead.controller";

import { authMiddleware } from "../middleware/auth";


const router = Router();

// ➤ order matters: /by-mobile must come BEFORE /:id
router.get("/by-mobile/:mobile", authMiddleware, getLeadByMobile);

// ➤ create a requirement (or new client + first requirement)
router.post("/", authMiddleware, createLead);

// ➤ list all requirements (flat list)
router.get("/", authMiddleware, getLeads);

// ➤ get requirement by its id
router.get("/:id", authMiddleware, getLeadById);

// ➤ update requirement
router.put("/:id", authMiddleware, updateLead);

// ➤ delete requirement
router.delete("/:id", authMiddleware, deleteLead);


export default router;
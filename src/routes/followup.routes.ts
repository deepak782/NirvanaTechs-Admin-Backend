import { Router } from "express";
import {
  getFollowups,
  getFollowupById,
  createFollowup,
  updateFollowup,
  deleteFollowup,
  markFollowupCompleted,
} from "../controllers/followup.controller";
import { authMiddleware } from  "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", getFollowups);
router.get("/:id", getFollowupById);

router.post("/", createFollowup);
router.put("/:id", updateFollowup);

router.patch("/:id/status", markFollowupCompleted);
router.delete("/:id", deleteFollowup);

export default router;
import { Router } from "express";
import {
  getProjects,
  getProjectById,
  getProjectsByMobile,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { authMiddleware } from  "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.get("/by-mobile/:mobile", getProjectsByMobile);

router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
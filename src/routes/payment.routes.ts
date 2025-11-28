import { Router } from "express";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller";
import { authMiddleware } from  "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", getPayments);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
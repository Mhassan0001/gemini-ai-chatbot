import { Router } from "express";
import { chatController } from "../controller/chat.controller.js";

const router = Router();

router.post("/", chatController);

export default router;

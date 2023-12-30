import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController";

export const router = Router();
//registrar usuario
router.post("/register", createUser);
//login usuario
router.post("/login", loginUser);
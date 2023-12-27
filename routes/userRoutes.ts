import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

export const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);

//Auth*
router.get("/profile", authMiddleware, (req: AuthRequest, res) => {
    const user = req.user;
    return res.status(200).json({ user });
});
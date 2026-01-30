import { loginUser, logoutUser, registerUser} from "../controllers/authController.js";
import isAuthenticated from "../middleware/authMiddleware.js";
import express from 'express';

const router = express.Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Protected routes
router.route("/logout").get(isAuthenticated, logoutUser);

export default router;
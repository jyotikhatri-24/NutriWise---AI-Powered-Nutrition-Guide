import express from 'express';
import isAuthenticated from '../middleware/authMiddleware.js';
import { updateUserProfile, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

router
    .route('/profile')
    .get(isAuthenticated, getUserProfile)
    .put(isAuthenticated, updateUserProfile);

export default router;

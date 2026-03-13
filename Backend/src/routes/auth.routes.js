import express from 'express';
import { loginController, registerController, getUserController, logoutController } from '../controllers/auth.controllers.js';
import identifyUser from '../middlewares/auth.middlewares.js';

const authRouter = express.Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/get-me', identifyUser, getUserController);
authRouter.post('/logout', logoutController)
export default authRouter
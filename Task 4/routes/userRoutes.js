import express from 'express';
import userAuth from '../middelwares/authMiddelware.js';
import { getUserComtroller, updateUserController } from '../controllers/userController.js';


//route object
const router = express.Router();

//routes
router.post('/getUser', userAuth, getUserComtroller)

//update user
router.put("/update-user", userAuth, updateUserController);

export default router;
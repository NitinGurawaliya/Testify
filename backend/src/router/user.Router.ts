import { Router } from "express";
import { signin,signup,fetchAllTests, startTest ,submitTest} from "../controllers/user.Controller";
import { userMiddleware } from "../middleware/authMiddleware";
const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/bulk', userMiddleware,fetchAllTests);
userRouter.get('/test/:id/start',userMiddleware,startTest)
userRouter.post('/test/:id/submit',userMiddleware, submitTest);


export default userRouter;  
import { Router } from "express";
import { adminMiddleware } from "../middleware/authMiddleware";
import { signin ,signup,createTest,getAllTest,testById} from "../controllers/admin.Controller";

const adminRouter = Router();

adminRouter.post("/signup",signup)
adminRouter.post("/signin",signin)
adminRouter.get("/test/:id",adminMiddleware,testById)
adminRouter.get("/bulk",adminMiddleware,getAllTest)
adminRouter.post("/test",adminMiddleware,createTest)
    
export default adminRouter;
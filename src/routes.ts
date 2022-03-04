import { Router } from "express";
import authMiddleware from "./app/middlewares/authMiddleware";

import UserController from "./app/controllers/UserController";
import AuthController from "./app/controllers/AuthController";
import AgedController from "./app/controllers/AgedController";

const router = Router();

//No auth routes
router.post("/users", UserController.store);
router.post("/login", AuthController.authenticate);

//Auth routes
router.get("/users", authMiddleware, UserController.list);
router.post("/aged", authMiddleware, AgedController.store);


export default router;

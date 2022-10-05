import { Router } from "express";
const router = Router();

/* 引入路由 */
import user from "./user";
import auth from "./auth";
import upload from "./upload";

/* 用户api */
router.use("/user", user);

/* 登录api */
router.use("/auth", auth);

/* 上传文件api */
router.use("/upload", upload);

export default router;

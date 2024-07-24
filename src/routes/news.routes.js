import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { deleteNews, fetchNews, getDetailedNews, submitnews } from "../controller/news.controller.js";

const router = Router();
//not secured routes
router.route("/getnews").get(fetchNews)
router.route('/read/:id').get(getDetailedNews)

//secured route
router.route("/submitnews").post(verifyJWT, submitnews);
router.route("/deletenews/:id").delete(verifyJWT, deleteNews)

export default router;

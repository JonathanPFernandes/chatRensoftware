import { Router } from "express";
import * as ReviewsController from "../controllers/ReviewsController";
import isAuth from "../middleware/isAuth";

const reviewRoutes = Router();

// Rota para criar uma avaliação
reviewRoutes.get("/reviews", isAuth, ReviewsController.show);
reviewRoutes.post("/reviews", isAuth, ReviewsController.create);

export default reviewRoutes;
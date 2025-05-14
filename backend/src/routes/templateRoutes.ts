import { Router } from "express";
import * as TemplateReviewController from "../controllers/TemplateReviewController";
import isAuth from "../middleware/isAuth";

const templateRoutes = Router();

// Rota para criar um template de avaliação
templateRoutes.get("/templates", isAuth, TemplateReviewController.show);
templateRoutes.post("/templates", isAuth, TemplateReviewController.create);
templateRoutes.put("/templates/:id", isAuth, TemplateReviewController.update);
templateRoutes.delete("/templates/:id", isAuth, TemplateReviewController.remove);

export default templateRoutes;
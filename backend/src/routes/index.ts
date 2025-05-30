import { Router } from "express";

import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import settingRoutes from "./settingRoutes";
import contactRoutes from "./contactRoutes";
import ticketRoutes from "./ticketRoutes";
import whatsappRoutes from "./whatsappRoutes";
import messageRoutes from "./messageRoutes";
import whatsappSessionRoutes from "./whatsappSessionRoutes";
import queueRoutes from "./queueRoutes";
import quickAnswerRoutes from "./quickAnswerRoutes";
import apiRoutes from "./apiRoutes";
import tagRoutes from "./tagRoutes";
import integrationRoutes from "./integrationRoutes";
// import companyRoutes from "./companyRoutes";
import systemRoutes from "./systemRoutes";
import reportRoutes from "./reportRoutes";
import reviewRoutes from "./reviewsRoutes";
import templateRoutes from "./templateRoutes";

const routes = Router();

routes.use(userRoutes);
routes.use("/auth", authRoutes);
routes.use(settingRoutes);
routes.use(contactRoutes);
routes.use(ticketRoutes);
routes.use(whatsappRoutes);
routes.use(messageRoutes);
routes.use(whatsappSessionRoutes);
routes.use(queueRoutes);
routes.use(quickAnswerRoutes);
routes.use("/api/messages", apiRoutes);
routes.use(tagRoutes);
routes.use(integrationRoutes);
// routes.use(companyRoutes);
routes.use(systemRoutes);
routes.use(reportRoutes);
routes.use(reviewRoutes);
routes.use(templateRoutes);

export default routes;

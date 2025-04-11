import express from 'express';
import isAuth from '../middleware/isAuth';

import * as ReportController from '../controllers/ReportController';

const reportRoutes = express.Router();

reportRoutes.get('/reports', isAuth, ReportController.index);

export default reportRoutes;

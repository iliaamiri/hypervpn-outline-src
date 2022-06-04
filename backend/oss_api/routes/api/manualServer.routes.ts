import express from 'express';
const manualServerRoutes = express.Router();

import ManualServerController from "../../app/controllers/ManualServerController";

manualServerRoutes.get('/all', ManualServerController.getAll);
manualServerRoutes.post('/add', ManualServerController.addServers);

export default manualServerRoutes;
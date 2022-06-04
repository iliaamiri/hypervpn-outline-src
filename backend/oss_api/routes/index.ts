import express, {Response, Request, NextFunction} from 'express';
import cors from 'cors';
import { corsOptions } from '../config/cors';

const router = express.Router(); // general router
const apiRouter = express.Router();

router.use(cors(corsOptions));
router.use(express.json());

const apiPrefix = '/api';

router.use(apiPrefix, apiRouter);

import accessKeyRoutes from "./api/accessKey.routes";
apiRouter.use('/keys', accessKeyRoutes);

import manualServerRoutes from "./api/manualServer.routes";
apiRouter.use('/manualServers', manualServerRoutes);

import swaggerUi from "swagger-ui-express";
const { default: swaggerDocument } = await import('../swagger.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

/*
* ///////////// Importing Exceptions /////////////
* */
import RouteExceptions from '../core/exceptions/RouteException';
import * as apiError from "../core/apiError";

// Route doesn't exist (404)
router.use((req: Request, res: Response, next: NextFunction) => {
    throw RouteExceptions.ROUTE_DOES_NOT_EXIST;
});

// centralized error handling via middleware.
router.use((err: apiError.ApiError, req: Request, res: Response, next: NextFunction) => {
    console.log("Exception: ", err);

    res.status(err.httpCustomStatusCode || 500);

    delete err.httpCustomStatusCode;

    res.json({
        status: false,
        error: err
    });

});

export default router;
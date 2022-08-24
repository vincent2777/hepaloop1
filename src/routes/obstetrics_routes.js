'use strict';

import { Router } from "express";
import ObstetricsController from "../controllers/obstetrics_controller";
import TokenVerification from "../utils/token_verification";

//  Setup Express Router.
const obstetricsRouter = Router();


//  Create a single blood pressure.
obstetricsRouter.post(
    "/create_obstetrics",
    TokenVerification.userTokenValidation,
    ObstetricsController.createObstetrics
);

//  Get All Blood Glucose For a Specific User.
obstetricsRouter.get(
    "/all_obstetrics_for_specific_user/:userId",
    ObstetricsController.getAllObstetricsForSpecificUser
);

//  Get a single Blood Pressure.
obstetricsRouter.get(
    "/single_obstetrics/:id",
    ObstetricsController.getSingleObstetrics
);

//  Update a Blood Pressure.
obstetricsRouter.put(
    "/update_obstetrics/:id",
    TokenVerification.userTokenValidation,
    ObstetricsController.updateObstetrics
);

//  Delete a Blood Pressure.
obstetricsRouter.delete(
    "/delete_obstetrics/:id",
    TokenVerification.userTokenValidation,
    ObstetricsController.deleteObstetrics
);

export default obstetricsRouter;
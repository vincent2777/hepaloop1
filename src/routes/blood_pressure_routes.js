'use strict';

import { Router } from "express";
import BloodPressureController from "../controllers/blood_pressure_controller";
import TokenVerification from "../utils/token_verification";

//  Setup Express Router.
const bloodPressureRouter = Router();


//  Create a single blood pressure.
bloodPressureRouter.post(
    "/create_blood_pressure",
    TokenVerification.userTokenValidation,
    BloodPressureController.createBloodPressure
);

//  Get All Blood Glucose For a Specific User.
bloodPressureRouter.get(
    "/all_blood_pressure_for_specific_user/:userId",
    BloodPressureController.getAllBloodPressureForSpecificUser
);

//  Get a single Blood Pressure.
bloodPressureRouter.get(
    "/single_blood_pressure/:id",
    BloodPressureController.getSingleBloodPressure
);

//  Update a Blood Pressure.
bloodPressureRouter.put(
    "/update_blood_pressure/:id",
    TokenVerification.userTokenValidation,
    BloodPressureController.updateBloodPressure
);

//  Delete a Blood Pressure.
bloodPressureRouter.delete(
    "/delete_blood_pressure/:id",
    TokenVerification.userTokenValidation,
    BloodPressureController.deleteBloodPressure
);

export default bloodPressureRouter;
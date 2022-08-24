'use strict';

import { Router } from "express";
import BloodGlucoseController from "../controllers/blood_glucose_controller";
import TokenVerification from "../utils/token_verification";

//  Setup Express Router.
const bloodGlucoseRouter = Router();


//  Create a single blood glucose.
bloodGlucoseRouter.post(
    "/create_blood_glucose",
    TokenVerification.userTokenValidation,
    BloodGlucoseController.createBloodGlucose
);

//  Get All Blood Glucose For a Specific User.
bloodGlucoseRouter.get(
    "/all_blood_glucose_for_specific_user/:userId",
    BloodGlucoseController.getAllBloodGlucoseForSpecificUser
);

//  Get a single Blood Glucose.
bloodGlucoseRouter.get(
    "/single_blood_glucose/:id",
    BloodGlucoseController.getSingleBloodGlucose
);

//  Update a Blood Glucose.
bloodGlucoseRouter.put(
    "/update_blood_glucose/:id",
    TokenVerification.userTokenValidation,
    BloodGlucoseController.updateBloodGlucose
);

//  Delete a Blood Glucose.
bloodGlucoseRouter.delete(
    "/delete_blood_glucose/:id",
    TokenVerification.userTokenValidation,
    BloodGlucoseController.deleteBloodGlucose
);

export default bloodGlucoseRouter;
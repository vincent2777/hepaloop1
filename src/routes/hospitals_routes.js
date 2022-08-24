'use strict';

import { Router } from 'express';
import TokenVerification from '../utils/token_verification';
import HospitalsController from "../controllers/hospital_controller";
import userAvatarUpload from "../controllers/user_picture_upload_controller";

//  Set up Express Router.
const hospitalsRouter = Router();



//  Hospitals SignUp.
hospitalsRouter.post(
    '/signup',
    HospitalsController.signUpHospital
);

//  Hospitals Login.
hospitalsRouter.post(
    '/login',
    HospitalsController.loginHospital
);

//  Create a single hospital.
hospitalsRouter.post(
    '/create_hospital',
    TokenVerification.hospitalsTokenVerification,
    HospitalsController.createHospital
);

//  Get all Hospitals.
hospitalsRouter.get(
    '/all_hospitals',
    HospitalsController.getAllHospitals
);

//  Get a single Hospital.
hospitalsRouter.get(
    '/single_hospital/:id',
    HospitalsController.getSingleHospital
);

//  Update a Staff.
hospitalsRouter.put(
    '/update_hospital/:id',
    TokenVerification.hospitalsTokenVerification,
    HospitalsController.updateHospital
);

//  Delete a Hospital.
hospitalsRouter.delete(
    '/delete_hospital/:id',
    TokenVerification.hospitalsTokenVerification,
    HospitalsController.deleteHospital
);



//  Uploading Users Profile Avatar.
hospitalsRouter.put(
    '/update_avatar',
    TokenVerification.hospitalsTokenVerification,
    userAvatarUpload,
    HospitalsController.updateHospitalsAvatar
);

export default hospitalsRouter;
'use strict';

import { Router } from 'express';
import TokenVerification from '../utils/token_verification';
import DoctorsController from '../controllers/doctor_controller';
import userAvatarUpload from "../controllers/user_picture_upload_controller";

//  Set up Express Router.
const doctorsRouter = Router();


//  Create a single doctor.
doctorsRouter.post(
    '/create_doctor',
    TokenVerification.userTokenValidation,
    DoctorsController.createDoctor
);

//  Get all Doctors.
doctorsRouter.get(
    '/all_doctors',
    DoctorsController.getAllDoctors
);

//  Get all nearBy Doctors.
doctorsRouter.get(
    '/all_nearBy_doctors/:location',
    TokenVerification.userTokenValidation,
    DoctorsController.getAllNearByDoctors
);

//  Get a single Doctor.
doctorsRouter.get(
    '/single_doctor/:id',
    DoctorsController.getSingleDoctor
);

//  Update a Staff.
doctorsRouter.put(
    '/update_doctor/:id',
    TokenVerification.doctorsTokenVerification,
    DoctorsController.updateDoctor
);

//  Delete a Doctor.
doctorsRouter.delete(
    '/delete_doctor/:id',
    TokenVerification.doctorsTokenVerification,
    DoctorsController.deleteDoctor
);


export default doctorsRouter;

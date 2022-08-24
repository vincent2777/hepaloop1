'use strict';

import { Router } from 'express';
import TokenVerification from "../utils/token_verification";
import DoctorPatientController from "../controllers/doctor_patient_controller";

//  Set up Express Router.
const doctorPatientRouter = Router();


//  Get All Doctors Patients.
doctorPatientRouter.get(
    '/all_doctor_patients',
    TokenVerification.userTokenValidation,
    DoctorPatientController.getAllDoctorPatients
);


//  Get All Doctors Patients.
doctorPatientRouter.get(
    '/all_individual_doctors',
    TokenVerification.userTokenValidation,
    DoctorPatientController.getAllIndividualDoctors
);

export default doctorPatientRouter;
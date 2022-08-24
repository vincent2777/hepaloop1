'use strict';

import { Router } from 'express';

//  Import all the required routes.
import userRouter from "./user_routes";
import doctorsRouter from './doctors_routes';
import individualsRouter from './individuals_routes';
import hospitalsRouter from "./hospitals_routes";
import pharmacyRouter from "./pharmacy_routes";
import notificationsRouter from "./notifications_routes";
import consultationsRouter from "./consultations_routes";
import appointmentsRouter from "./appointments_routes";
import consultationRequestRouter from "./consultation_request_routes";
import doctorPatientRouter from "./doctor_patient_routes";
import bloodGlucoseRouter from "./blood_glucose_routes";
import bloodPressureRouter from "./blood_pressure_routes";
import obstetricsRouter from "./obstetrics_routes";


//  Initialize Express Router.
const router = Router();

router.use('/users', userRouter);
router.use('/doctors', doctorsRouter);
router.use('/individuals', individualsRouter);
router.use('/hospitals', hospitalsRouter);
router.use('/pharmacy', pharmacyRouter);
router.use('/notifications', notificationsRouter);
router.use('/consultations', consultationsRouter);
router.use('/appointments', appointmentsRouter);
router.use('/consultation_request', consultationRequestRouter);
router.use('/doctor_patient', doctorPatientRouter)
router.use('/blood_glucose', bloodGlucoseRouter)
router.use('/blood_pressure', bloodPressureRouter)
router.use('/obstetrics', obstetricsRouter)

export default router;

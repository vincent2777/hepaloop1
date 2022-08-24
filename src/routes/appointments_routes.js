'use strict';

import { Router } from "express";
import AppointmentsController from "../controllers/appointment_controller";

//  Setup Express Router.
const appointmentsRouter = Router();


//  Create a single appointment.
appointmentsRouter.post(
    "/create_appointment",
    AppointmentsController.createAppointment
);

//  Get All appointments.
appointmentsRouter.get(
    "/all_appointments",
    AppointmentsController.getAllAppointments
);

//  Get all appointments by sender.
appointmentsRouter.get(
    "/all_appointments_by_sender/:senderId",
    AppointmentsController.getAllAppointmentsBySender
);

//  Get all appointments by receiver.
appointmentsRouter.get(
    "/all_appointments_by_receiver/:receiverId",
    AppointmentsController.getAllAppointmentsByReceiver
);

//  Create a single appointments.
appointmentsRouter.get(
    "/single_appointment/:id",
    AppointmentsController.getSingleAppointment
);

//  Update a single appointments.
appointmentsRouter.put(
    "/update_appointment/:id",
    AppointmentsController.updateAppointment
);

//  Delete a single appointments.
appointmentsRouter.delete(
    "/delete_appointment/:id",
    AppointmentsController.deleteAppointment
);

export default appointmentsRouter;
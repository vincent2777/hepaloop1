'use strict';

import db from '../database/models';
import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";

const { Appointments } = db;

class AppointmentsController {
    //  Create a single Appointment.
    static createAppointment = async (req, res) => {
        try {
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.appointmentSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${ error.message }`
                )
                return res.status(response.code).json(response);
            }

            //  Create a new notification.
            const appointment = await Appointments.create({ ...value });
            if (!appointment) {
                const response = new Response(
                    false,
                    409,
                    'Failed to create appointment.'
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                'Appointment created successfully.',
                { appointment }
            );
            return res.status(response.code).json(response);
        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    }

    //  Get all Appointments.
    static getAllAppointments = async (req, res) => {
        try {
            const appointments = await Appointments.findAll();
            if (!appointments) {
                const response = new Response(
                    false,
                    404,
                    "No appointment found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Successfully retrieved all appointments.',
                { appointments, length: appointments.length }
            );
            return res.status(response.code).json(response);
        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get a single Appointment By a Specific Sender.
    static getAllAppointmentsBySender = async (req, res) => {
        try {
            const { senderId } = req.params;
            console.log(senderId)

            const appointments = await Appointments.findAll({
                where: { senderId }
            });
            if (!appointments.length) {
                const response = new Response(
                    false,
                    404,
                    "No appointment found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Appointments retrieved successfully.',
                { appointments, length: appointments.length }
            );
            return res.status(response.code).json(response);
        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get a single Appointment By a Specific Receiver.
    static getAllAppointmentsByReceiver = async (req, res) => {
        try {
            const { receiverId } = req.params;

            const appointments = await Appointments.findAll({
                where: { receiverId }
            });
            if (!appointments.length) {
                const response = new Response(
                    false,
                    404,
                    "No appointment found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Appointments retrieved successfully.',
                { appointments, length: appointments.length }
            );
            return res.status(response.code).json(response);
        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get a single Appointment.
    static getSingleAppointment = async (req, res) => {
        try {
            const { id } = req.params;
            const appointment = await Appointments.findOne({
                where: { id }
            });
            if (!appointment) {
                const response = new Response(
                    false,
                    404,
                    "No appointment found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Appointment retrieved successfully.',
                { appointment }
            );
            return res.status(response.code).json(response);
        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Update a Appointment.
    static updateAppointment = async (req, res) => {
        try {
            const { id: appointmentId } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.appointmentUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  If No record found with the same doctors email, then update.
            const appointment = await Appointments.update({ ...value }, {
                where: { id: appointmentId }
            });
            if (appointment[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update appointment."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Appointment updated successfully."
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Delete a Appointment.
    static deleteAppointment = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await Appointments.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No appointments found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Appointment deleted successfully."
            );
            return res.status(response.code).json(response);
        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    static sampleOption = async (req, res) => {
        try {
            const requestBody = req.body;

            const response = new Response(
                true,
                200,
                'Successfully created a doctor.'
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${error}`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };
}

export default AppointmentsController;
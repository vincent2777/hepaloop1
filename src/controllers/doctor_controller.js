'use strict';

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

import models from '../database/models';
import Response from '../utils/response';
import JoiValidator from "../utils/joi_validator";
import {Op} from "sequelize";


const { Doctors, Users, Notifications, Appointments, ConsultationRequest } = models;

class DoctorsController {
    //  Create a single doctor.
    static createDoctor = async (req, res) => {
        try {
            const { id } = req.requestPayload;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.doctorsSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Check if Doctor already exist and create a new Doctor using the "value" gotten from the validated object.
            const [doctor, created] = await Doctors.findOrCreate({
                where: { userId: id },
                defaults: { userId: id, ...value }
            });
            if (!created) {
                const response = new Response(
                    false,
                    409,
                    "Doctor already exist."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                "Successfully created a doctor.",
                { ...doctor.dataValues }
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

    //  Get all Doctors.
    static getAllDoctors = async (req, res) => {
        try {
            const doctors = await Doctors.findAll({
                include: [{ model: Users, as: "user",
                    attributes: {
                        exclude: ["password"]
                    }
                }]
            });
            if (!doctors.length) {
                const response = new Response(
                    false,
                    404,
                    "No doctor found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Successfully retrieved all doctors.',
                [ ...doctors ]
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

    //  Get all nearBy Doctors.
    static getAllNearByDoctors = async (req, res) => {
        const { location } = req.params;
        // console.log("GGGGGGG::: ", location);

        try {
            const users = await Users.findAll({
                where: { role: "Doctor", city: location },
                attributes: {
                    exclude: ['password']
                }
            });
            if (!users.length) {
                const response = new Response(
                    false,
                    404,
                    "No doctor found."
                );
                return res.status(response.code).json(response);
            }

            let doctors = [];
            let doctorDetails;
            for (const user of users) {
                const id = user.dataValues["id"];

                doctorDetails = await Doctors.findOne({
                    where: {userId: id},
                    attributes: {exclude: ['id', 'userId', 'createdAt', 'updatedAt']}
                });
                if (doctorDetails) {
                    doctors.push({ ...user.dataValues, ...doctorDetails.dataValues });
                }
            }

            const response = new Response(
                true,
                200,
                'Successfully retrieved all doctors.',
                doctors
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

    //  Get a single Doctor.
    static getSingleDoctor = async (req, res) => {
        try {
            const { id } = req.params;

            const doctor = await Doctors.findOne({
                where: { id },
                include: [{ model: Users, as: "user",
                    attributes: {
                        exclude: ["password"]
                    }
                }],
                // raw: true
            });
            if (!doctor) {
                const response = new Response(
                    false,
                    404,
                    "No doctor found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Doctor retrieved successfully.',
                { ...doctor.dataValues }
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

    //  Update a Doctor.
    static updateDoctor = async (req, res) => {
        try {
            const payload = req.requestPayload;
            const { id } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.doctorsUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  First check if a record has the staff_email existing.
            if (value.doctors_email) {
                const foundItem = await Doctors.findOne({
                    where: { doctors_email: value.doctors_email }
                });
                if (foundItem) {
                    const response = new Response(
                        false,
                        409,
                        "This email address already exist. Kindly use another email address."
                    );
                    return res.status(response.code).json(response);
                }

                //  If No record found with the same doctors email, then update.
                const updatedDoctor = await Doctors.update({ ...value }, { where: { id } });
                if (updatedDoctor[0] === 0) {
                    const response = new Response(
                        false,
                        400,
                        "Failed to update doctor."
                    );
                    return res.status(response.code).json(response);
                }

                const response = new Response(
                    true,
                    200,
                    "Doctor updated successfully."
                );
                return res.status(response.code).json(response);
            }

            //  If No record found with the same doctors email, then update.
            const updatedDoctor = await Doctors.update({ ...value }, { where: { id } });
            if (updatedDoctor[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update doctor."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Doctor updated successfully."
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

    //  Delete a Doctor.
    static deleteDoctor = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await Doctors.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No doctor found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Doctor deleted successfully."
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

export default DoctorsController;

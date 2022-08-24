'use strict';

import db from '../database/models';
import Response from "../utils/response";
import { Op } from "sequelize";
import JoiValidator from "../utils/joi_validator";

const { BloodPressure } = db;

class BloodPressureController {
    //  Create a single Blood Pressure.
    static createBloodPressure = async (req, res) => {
        try {
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.bloodPressureSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${ error.message }`
                )
                return res.status(response.code).json(response);
            }

            //  Create a new blood pressure.
            const bloodPressure = await BloodPressure.create({ ...value });
            if (!bloodPressure) {
                const response = new Response(
                    false,
                    409,
                    'Failed to create blood pressure.'
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                'Blood pressure created successfully.',
                { bloodPressure }
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


    //  Get All Blood Glucose For a Specific User.
    static getAllBloodPressureForSpecificUser = async (req, res) => {
        try {
            const { userId } = req.params;

            const bloodPressure = await BloodPressure.findAll({
                where: {
                    [Op.or]: [
                        { doctorId: userId }, { patientId: userId }
                    ],
                }
            });
            if (!bloodPressure.length) {
                const response = new Response(
                    false,
                    404,
                    "No blood pressure found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Blood pressure retrieved successfully.',
                bloodPressure
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


    //  Get a single Blood Pressure.
    static getSingleBloodPressure = async (req, res) => {
        try {
            const { id } = req.params;
            const bloodPressure = await BloodPressure.findOne({
                where: { id }
            });
            if (!bloodPressure) {
                const response = new Response(
                    false,
                    404,
                    "No blood pressure found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Blood pressure retrieved successfully.',
                { bloodPressure }
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


    //  Update a Blood Pressure.
    static updateBloodPressure = async (req, res) => {
        try {
            const { id: bloodPressureId } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.bloodPressureUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  If No record found with the same doctors email, then update.
            const bloodPressure = await BloodPressure.update({ ...value }, {
                where: { id: bloodPressureId }
            });
            if (bloodPressure[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update blood pressure."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Blood pressure updated successfully."
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

    
    //  Delete a Blood Pressure.
    static deleteBloodPressure = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await BloodPressure.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No blood pressures found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Blood pressure deleted successfully."
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

export default BloodPressureController;
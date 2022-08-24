'use strict';

import db from '../database/models';
import Response from "../utils/response";
import { Op } from "sequelize";
import JoiValidator from "../utils/joi_validator";

const { BloodGlucose, Users } = db;

class BloodGlucoseController {
    //  Create a single Blood Glucose.
    static createBloodGlucose = async (req, res) => {
        try {
            const requestBody = req.body;
            console.log(`BOOODY::: ${requestBody}`);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.bloodGlucoseSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${ error.message }`
                )
                return res.status(response.code).json(response);
            }

            //  Create a new blood glucose.
            const bloodGlucose = await BloodGlucose.create({ ...value });
            if (!bloodGlucose) {
                const response = new Response(
                    false,
                    409,
                    'Failed to create blood glucose.'
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                'Blood glucose created successfully.',
                { bloodGlucose }
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
    static getAllBloodGlucoseForSpecificUser = async (req, res) => {
        try {
            const { userId } = req.params;

            const bloodGlucose = await BloodGlucose.findAll({
                where: {
                    [Op.or]: [
                        { doctorId: userId }, { patientId: userId }
                    ],
                },
                include: [
                    { model: Users, as: "patient",
                        attributes: ["id", "name", "picture"]
                    },
                    { model: Users, as: "doctor",
                        attributes: ["id", "name", "picture"]
                    }
                ],
            });
            if (!bloodGlucose.length) {
                const response = new Response(
                    false,
                    404,
                    "No blood glucose found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Blood glucose retrieved successfully.',
                bloodGlucose 
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


    //  Get a single Blood Glucose.
    static getSingleBloodGlucose = async (req, res) => {
        try {
            const { id } = req.params;
            const bloodGlucose = await BloodGlucose.findOne({
                where: { id },
                include: [
                    { model: Users, as: "patient",
                        attributes: ["id", "name", "picture"]
                    },
                    { model: Users, as: "doctor",
                        attributes: ["id", "name", "picture"]
                    }
                ],
            });
            if (!bloodGlucose) {
                const response = new Response(
                    false,
                    404,
                    "No blood glucose found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Blood glucose retrieved successfully.',
                bloodGlucose
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


    //  Update a Blood Glucose.
    static updateBloodGlucose = async (req, res) => {
        try {
            const { id: bloodGlucoseId } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.bloodGlucoseUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  If No record found with the same doctors email, then update.
            const bloodGlucose = await BloodGlucose.update({ ...value }, {
                where: { id: bloodGlucoseId }
            });
            if (bloodGlucose[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update blood glucose."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Blood glucose updated successfully."
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

    
    //  Delete a Blood Glucose.
    static deleteBloodGlucose = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await BloodGlucose.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No blood glucose found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Blood glucose deleted successfully."
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

export default BloodGlucoseController;
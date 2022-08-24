'use strict';

import db from '../database/models';
import Response from "../utils/response";
import { Op } from "sequelize";
import JoiValidator from "../utils/joi_validator";

const { Obstetrics } = db;

class ObstetricsController {
    //  Create a single Obstetrics.
    static createObstetrics = async (req, res) => {
        try {
            const requestBody = req.body;
            console.log(`BOOODY::: ${requestBody}`);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.obstetricsSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${ error.message }`
                )
                return res.status(response.code).json(response);
            }

            //  Create a new Obstetrics.
            const obstetrics = await Obstetrics.create({ ...value });
            if (!obstetrics) {
                const response = new Response(
                    false,
                    409,
                    'Failed to create Obstetrics.'
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                'Obstetrics created successfully.',
                { obstetrics }
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


    //  Get All Obstetrics For a Specific User.
    static getAllObstetricsForSpecificUser = async (req, res) => {
        try {
            const { userId } = req.params;

            const obstetrics = await Obstetrics.findAll({
                where: {
                    [Op.or]: [
                        { doctorId: userId }, { patientId: userId }
                    ],
                }
            });
            if (!obstetrics.length) {
                const response = new Response(
                    false,
                    404,
                    "No Obstetrics found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Obstetrics retrieved successfully.',
                obstetrics 
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


    //  Get a single Obstetrics.
    static getSingleObstetrics = async (req, res) => {
        try {
            const { id } = req.params;
            const obstetrics = await Obstetrics.findOne({
                where: { id }
            });
            if (!obstetrics) {
                const response = new Response(
                    false,
                    404,
                    "No Obstetrics found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Obstetrics retrieved successfully.',
                { obstetrics }
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


    //  Update a Obstetrics.
    static updateObstetrics = async (req, res) => {
        try {
            const { id: obstetricsId } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.obstetricsUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  If No record found with the same doctors email, then update.
            const obstetrics = await Obstetrics.update({ ...value }, {
                where: { id: obstetricsId }
            });
            if (obstetrics[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update Obstetrics."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Obstetrics updated successfully."
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

    
    //  Delete a Obstetrics.
    static deleteObstetrics = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await Obstetrics.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No Obstetrics found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Obstetrics deleted successfully."
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

export default ObstetricsController;
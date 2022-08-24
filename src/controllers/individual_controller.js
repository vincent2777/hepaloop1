'use strict';

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

import models from '../database/models';
import Response from '../utils/response';
import JoiValidator from "../utils/joi_validator";
import {Op} from "sequelize";


const { Individuals, Users } = models;

class IndividualsController {

    //  Create a single individual.
    static createIndividual = async (req, res) => {
        try {
            const { id } = req.requestPayload;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.individualsSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Check if Individual already exist and create a new Individual using the "value" gotten from the validated object.
            const [individual, created] = await Individuals.findOrCreate({
                where: { userId: id },
                defaults: { userId: id, ...value }
            });
            if (!created) {
                const response = new Response(
                    false,
                    409,
                    'Individual already exist.'
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                'Successfully created a individual.',
                { ...individual.dataValues }
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${ error }`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get all Individuals.
    static getAllIndividuals = async (req, res) => {
        try {
            const individuals = await Individuals.findAll({
                include: [{ model: Users, as: "user",
                    attributes: {
                        exclude: ["password"]
                    }
                }]
            });
            if (!individuals) {
                const response = new Response(
                    false,
                    404,
                    "No individual found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Successfully retrieved individuals.',
                [...individuals]
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${ error }`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Get a single Individual.
    static getSingleIndividual = async (req, res) => {
        try {
            const { id } = req.params;

            const individual = await Individuals.findOne({
                where: { id },
                include: [{ model: Users, as: "user",
                    attributes: {
                        exclude: ["password"]
                    }
                }]
            });
            if (!individual) {
                const response = new Response(
                    false,
                    404,
                    "No individual found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Individual retrieved successfully.',
                { ...individual.dataValues }
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${ error }`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Update a Individual.
    static updateIndividual = async (req, res) => {
        try {
            const payload = req.requestPayload;
            const { id } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.individualsUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            if (value.individuals_email) {
                //  First check if a record has the staff_email existing.
                const foundItem = await Individuals.findOne({
                    where: { individuals_email: value.individuals_email }
                });
                if (foundItem) {
                    const response =  new Response(
                        false,
                        409,
                        "This email address already exist. Kindly use another email address."
                    );
                    return res.status(response.code).json(response);
                }

                //  If No record found with the same individuals email, then update.
                const updatedIndividual = await Individuals.update({ ...value }, { where: { id } });
                if (updatedIndividual[0] === 0) {
                    const response =  new Response(
                        false,
                        400,
                        "Failed to update individual."
                    );
                    return res.status(response.code).json(response);
                }

                const response =  new Response(
                    true,
                    200,
                    "Individual updated successfully."
                );
                return res.status(response.code).json(response);
            }

            //  If No record found with the same individuals email, then update.
            const updatedIndividual = await Individuals.update({ ...value }, { where: { id } });
            if (updatedIndividual[0] === 0) {
                const response =  new Response(
                    false,
                    400,
                    "Failed to update individual."
                );
                return res.status(response.code).json(response);
            }

            const response =  new Response(
                true,
                200,
                "Individual updated successfully."
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${ error }`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

    //  Delete a Individual.
    static deleteIndividual = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await Individuals.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No individual found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Individual deleted successfully."
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${ error }`);

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
                'Successfully created a individual.'
            );
            return res.status(response.code).json(response);

        } catch (error) {
            console.log(`ERROR::: ${ error }`);

            const response = new Response(
                false,
                500,
                'Server error, please try again later.'
            );
            return res.status(response.code).json(response);
        }
    };

}

export default IndividualsController;

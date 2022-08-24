'use strict';

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

import db from '../database/models';
import Response from '../utils/response';
import JoiValidator from "../utils/joi_validator";


const { Hospitals, Notifications } = db;

class HospitalsController {
    //  Hospitals SignUp.
    static signUpHospital = async (req, res) => {
        try {
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.hospitalsSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Check if Hospital already exist and create a new Hospital using the "value" gotten from the validated object.
            const [hospital, created] = await Hospitals.findOrCreate({
                where: { hospitals_email: value.hospitals_email },
                defaults: { ...value }
            });
            if (!created) {
                const response = new Response(
                    false,
                    409,
                    "Hospital already exist."
                );
                return res.status(response.code).json(response);
            }

            const { id, hospitals_name, hospitals_email, hospitals_phone, user_type } = hospital;

            //  Create a Token that will be passed to the response.
            const token = await jwt.sign(
                { id, hospitals_name, hospitals_email, hospitals_phone, user_type },
                `${ process.env.JWT_SECRET_KEY }`,
                // { expiresIn: "1d" }
            );

            const formattedResponse = {
                ...hospital.dataValues,
                token
            }

            const response = new Response(
                true,
                201,
                "Successfully created a hospital.",
                { hospital: formattedResponse }
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

    //  Hospitals Login.
    static loginHospital = async (req, res) => {
        try {
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.hospitalsLoginSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            const hospital = await Hospitals.findOne({
                where: { hospitals_email: value.hospitals_email },
            });
            if (!hospital) {
                const response = new Response(
                    false,
                    404,
                    "Email or Password is not correct."
                );
                return res.status(response.code).json(response);
            }

            //  Compare the encrypted hospitals_password.
            const isPasswordMatched = await bcrypt.compareSync(value.hospitals_password, hospital.hospitals_password );
            if (!isPasswordMatched) {
                const response = new Response(
                    false,
                    401,
                    "Incorrect password. Please check your password and try again."
                );
                return res.status(response.code).json(response);
            }

            const { id, hospitals_name, hospitals_email, hospitals_phone, user_type } = hospital;

            //  Create a Token that will be passed to the response.
            const token = await jwt.sign(
                { id, hospitals_name, hospitals_email, hospitals_phone, user_type },
                `${ process.env.JWT_SECRET_KEY }`,
                // { expiresIn: "1d" }
            );

            //  Get all the notifications associated with this Hospital.
            const notifications = await Notifications.findAll({
                where: { receiverId: id },
                attributes: ["id"]
            });
            if (!notifications) {
                const response = new Response(
                    false,
                    404,
                    "No notification found.",
                );
                return res.status(response.code).json(response);
            }

            //  Now remove the "hospitals_password" before returning the Doctor.
            const hospitalDataValues = {...hospital.dataValues};
            delete hospitalDataValues.hospitals_password;

            const formattedResponse = {
                ...hospitalDataValues,
                notifications,
                token
            }

            const response = new Response(
                true,
                200,
                "You're logged in successfully.",
                { hospital: formattedResponse }
            );
            res.status(response.code).json(response);

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

    //  Create a single hospital.
    static createHospital = async (req, res) => {
        try {
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.hospitalsSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Check if Hospital already exist and create a new Hospital using the "value" gotten from the validated object.
            const [hospital, created] = await Hospitals.findOrCreate({
                where: { hospitals_email: requestBody.hospitals_email },
                defaults: { ...value },
            });
            if (!created) {
                const response = new Response(
                    false,
                    409,
                    'Hospital already exist.'
                );
                return res.status(response.code).json(response);
            }

            //  Get all the notifications associated with this Hospital.
            const notifications = await Notifications.findAll({
                where: { receiverId: hospital.id },
                attributes: ["id"]
            });
            if (!notifications) {
                const response = new Response(
                    false,
                    404,
                    "No notification found.",
                );
                return res.status(response.code).json(response);
            }

            const formattedResponse = {
                ...hospital.dataValues,
                notifications
            }


            const response = new Response(
                true,
                201,
                'Successfully created a hospital.',
                { hospital }
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

    //  Get all Hospitals.
    static getAllHospitals = async (req, res) => {
        try {
            const hospitals = await Hospitals.findAll({
                attributes: {
                    exclude: ['hospitals_password']
                }
            });
            if (!hospitals.length) {
                const response = new Response(
                    false,
                    404,
                    "No hospital found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Successfully retrieved all hospital.',
                { hospitals }
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

    //  Get a single Hospital.
    static getSingleHospital = async (req, res) => {
        try {
            const { id } = req.params;
            const hospital = await Hospitals.findOne({
                where: { id },
                attributes: {
                    exclude: ['hospitals_password']
                }
            });
            if (!hospital) {
                const response = new Response(
                    false,
                    404,
                    "No hospital found.",
                );
                return res.status(response.code).json(response);
            }

            //  Get all the notifications associated with this Hospital.
            const notifications = await Notifications.findAll({
                where: { receiverId: id },
                attributes: ["id"]
            });
            if (!notifications) {
                const response = new Response(
                    false,
                    404,
                    "No notification found.",
                );
                return res.status(response.code).json(response);
            }

            const formattedResponse = {
                ...hospital.dataValues,
                notifications
            }

            const response = new Response(
                true,
                200,
                'Hospital retrieved successfully.',
                { hospital: formattedResponse }
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

    //  Update a Hospital.
    static updateHospital = async (req, res) => {
        try {
            const { id } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.hospitalsUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            if (value.hospitals_email) {
                //  First check if a record has the hospitals_email existing.
                const foundItem = await Hospitals.findOne({
                    where: { hospitals_email: value.hospitals_email }
                });
                if (foundItem) {
                    const response =  new Response(
                        false,
                        409,
                        "This email address already exist. Kindly use another email address."
                    );
                    return res.status(response.code).json(response);
                }

                //  If No record found with the same pharmacy email, then update.
                const updatedHospital = await Hospitals.update({ ...value }, { where: { id } });
                if (updatedHospital[0] === 0) {
                    const response =  new Response(
                        false,
                        400,
                        "Failed to update hospital."
                    );
                    return res.status(response.code).json(response);
                }

                const response =  new Response(
                    true,
                    200,
                    "Hospital updated successfully."
                );
                return res.status(response.code).json(response);

            }

            //  If No record found with the same hospitals email, then update.
            const updatedHospital = await Hospitals.update({ ...value }, { where: { id } });
            if (updatedHospital[0] === 0) {
                const response =  new Response(
                    false,
                    400,
                    "Failed to update hospital."
                );
                return res.status(response.code).json(response);
            }

            const response =  new Response(
                true,
                200,
                "Hospital updated successfully."
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

    //  Delete a Hospital.
    static deleteHospital = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await Hospitals.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No hospital found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Hospital deleted successfully."
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
                'Successfully created a hospital.'
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


    //  Uploading Users Profile Avatar.
    static updateHospitalsAvatar = async (req, res) => {
        try {
            const payload = req.requestPayload;
            const filename = req.file.filename;
            const id = payload.id;
            const avatarURL = `http://${req.headers.host}/uploads/${filename}`;
            console.log(id);

            //  Update the Hospitals Profile Logo..
            const updatedHospital = await Hospitals.update(
                { hospitals_logo: avatarURL },
                { where: { id } }
            );
            if (updatedHospital[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update profile photo."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Hospital back.
            const hospital = await Hospitals.findOne({
                where: { id },
                attributes: {
                    exclude: ['hospitals_password']
                }
            });
            if (!hospital) {
                const response = new Response(
                    false,
                    404,
                    "No hospital found."
                );
                return res.status(response.code).json(response);
            }

            const { hospitals_name, hospitals_email, hospitals_phone, hospitals_avatar, user_type } = hospital;

            //  Create a Token that will be passed to the response.
            const token = await jwt.sign(
                { id, hospitals_name, hospitals_email, hospitals_phone, user_type },
                `${process.env.JWT_SECRET_KEY}`,
                // { expiresIn: "1d" }
            );

            //  Get all the notifications associated with this Hospital.
            const notifications = await Notifications.findAll({
                where: { receiverId: id },
                attributes: ["id"]
            });
            if (!notifications) {
                const response = new Response(
                    false,
                    404,
                    "No notification found.",
                );
                return res.status(response.code).json(response);
            }

            const formattedResponse = {
                ...hospital.dataValues,
                notifications,
                token
            }

            const response = new Response(
                true,
                200,
                'Successfully updated profile photo.',
                { hospital: formattedResponse }
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

export default HospitalsController;

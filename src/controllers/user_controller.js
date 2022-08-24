'use strict';

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import models from "../database/models";
import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";

const { Users, Doctors, Individuals, Hospitals, Pharmacies, Notifications } = models;

class UsersController {

    //  Users Signup.
    static signupUser = async (req, res) => {
        try {
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.usersSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }
            console.log("VALUE:::: ", value);

            //  Delete "confirmPassword" before creating user.
            delete value.confirmPassword;

            //  Check if User already exist and create a new Users.
            const [user, created] = await Users.findOrCreate({
                where: { email: value.email },
                defaults: { ...value }
            });
            if (!created) {
                const response = new Response(
                    false,
                    409,
                    "User already exist."
                );
                return res.status(response.code).json(response);
            }
            const { id, name, email, phone, role } = user;
            console.log("USER:::: ", user);

            //  Create a Token that will be passed to the response.
            const token = await jwt.sign(
                { id, name, email, phone, role },
                `${process.env.JWT_SECRET_KEY}`,
                { expiresIn: "1d" }
            );

            const response = new Response(
                true,
                201,
                "Successfully created a doctor.",
                { ...user.dataValues, token }
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

    //  User Login.
    static loginUser = async (req, res) => {
        try {
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.usersLoginSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            const user = await Users.findOne({
                where: { email: value.email },
            });
            if (!user) {
                const response = new Response(
                    false,
                    404,
                    "User does not exist."
                );
                return res.status(response.code).json(response);
            }
            const { id, name, email, phone, role } = user;

            //  Get User depending on the "role".
            let userDetails = (user.role === "Doctor") ? (
                await Doctors.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            ) : (user.role === "Individual") ? (
                await Individuals.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            ) : (user.role === "Hospital") ? (
                await Hospitals.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            ) : (
                await Pharmacies.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            )
            if (!userDetails) {
                const response = new Response(
                    false,
                    404,
                    "No user found.",
                );
                return res.status(response.code).json(response);
            }


            //  Compare the encrypted password.
            const isPasswordMatched = await bcrypt.compareSync(value.password, user.password);
            if (!isPasswordMatched) {
                const response = new Response(
                    false,
                    401,
                    "Incorrect password. Please check your password and try again."
                );
                return res.status(response.code).json(response);
            }

            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone, role },
                `${process.env.JWT_SECRET_KEY}`,
            );

            //  Now remove the "password" before returning the User.
            const userDataValues = user.dataValues;
            delete userDataValues.password;

            const response = new Response(
                true,
                200,
                "You're logged in successfully.",
                { ...userDataValues, ...userDetails.dataValues, token }
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

    //  Get all Users.
    static getAllUsers = async (req, res) => {
        try {
            const users = await Users.findAll({
                attributes: {
                    exclude: ['password']
                }
            });
            if (!users.length) {
                const response = new Response(
                    false,
                    404,
                    "No user found."
                );
                return res.status(response.code).json(response);
            }

            let newUsers = [];
            let userDetails;
            for (const user of users) {
                const role = user.dataValues["role"];
                const id = user.dataValues["id"];

                //  Get User depending on the "role".
                if (role === "Doctor") {
                    userDetails = await Doctors.findOne({
                        where: {userId: id},
                        attributes: {exclude: ['id', 'userId', 'createdAt', 'updatedAt']}
                    });
                    if (userDetails) {
                        newUsers.push({ ...user.dataValues, ...userDetails.dataValues });
                    }
                } else if (role === "Individual") {
                    userDetails = await Individuals.findOne({
                        where: {userId: id},
                        attributes: {exclude: ['id', 'userId', 'createdAt', 'updatedAt']}
                    });
                    if (userDetails) {
                        newUsers.push({ ...user.dataValues, ...userDetails.dataValues });
                    }
                } else if (role === "Hospital") {
                    userDetails = await Hospitals.findOne({
                        where: {userId: id},
                        attributes: {exclude: ['id', 'userId', 'createdAt', 'updatedAt']}
                    });
                    if (userDetails) {
                        newUsers.push({ ...user.dataValues, ...userDetails.dataValues });
                    }
                } else {
                    userDetails = await Pharmacies.findOne({
                        where: {userId: id},
                        attributes: {exclude: ['id', 'userId', 'createdAt', 'updatedAt']}
                    });
                    if (userDetails) {
                        newUsers.push({ ...user.dataValues, ...userDetails.dataValues });
                    }
                }
            }

            const response = new Response(
                true,
                200,
                'User retrieved successfully.',
                newUsers
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

    //  Get a single User.
    static getSingleUser = async (req, res) => {
        try {
            const { id } = req.params;

            const user = await Users.findOne({
                where: { id },
                attributes: {
                    exclude: ["password"]
                }
            });
            if (!user) {
                const response = new Response(
                    false,
                    404,
                    "User does not exist."
                );
                return res.status(response.code).json(response);
            }

            //  Get User depending on the "role".
            let userDetails = (user.role === "Doctor") ? (
                await Doctors.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            ) : (user.role === "Individual") ? (
                await Individuals.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            ) : (user.role === "Hospital") ? (
                await Hospitals.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            ) : (
                await Pharmacies.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            )
            if (!userDetails) {
                const response = new Response(
                    false,
                    404,
                    "No user found.",
                );
                return res.status(response.code).json(response);
            }

            //  Get Users notifications.
            /*const notifications = await Notifications.findAll({
                where: {
                    receiverId: user.id,
                    isDelivered: false
                },
                include: [{ model: Users, as: "sender",
                    attributes: ["id", "name", "email", "address", "picture"]
                }]
            });*/

            const response = new Response(
                true,
                200,
                'User retrieved successfully.',
                { ...user.dataValues, ...userDetails.dataValues }
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

    //  Update a User.
    static updateUser = async (req, res) => {
        try {
            const payload = req.requestPayload;
            const { id } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.usersUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  First check if a record has the email existing.
            if (value.email) {
                const foundItem = await Users.findOne({
                    where: { email: value.email }
                });
                if (foundItem) {
                    const response = new Response(
                        false,
                        400,
                        "Existing email can not be changed."
                    );
                    return res.status(response.code).json(response);
                }
            }

            //  If No record found with the same email, then update.
            const updatedUser = await Users.update({ ...value }, { where: { id } });
            if (updatedUser[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update user."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "User updated successfully."
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

    //  Delete a User.
    static deleteUser = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await Users.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No user found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "User deleted successfully."
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

    //  Uploading Users Profile Picture.
    static uploadUserPicture = async (req, res) => {
        try {
            const { id } = req.requestPayload;
            const filename = req.file.filename;
            const avatarURL = `http://${req.headers.host}/uploads/${filename}`;
            console.log(req.file);

            //  Update the Users Profile Picture..
            const updatedUser = await Users.update(
                { picture: avatarURL },
                { where: { id } }
            );
            if (updatedUser[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update profile picture."
                );
                return res.status(response.code).json(response);
            }

            //  Get the user back.
            const user = await Users.findOne({
                where: { id },
                attributes: {
                    exclude: ["password"]
                }
            });
            if (!user) {
                const response = new Response(
                    false,
                    404,
                    "User does not exist."
                );
                return res.status(response.code).json(response);
            }
            const { name, email, phone, role } = user;

            //  Get User depending on the "role".
            let userDetails = (user.role === "Doctor") ? (
                await Doctors.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            ) : (user.role === "Individual") ? (
                await Individuals.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            ) : (user.role === "Hospitals") ? (
                await Hospitals.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            ) : (
                await Pharmacies.findOne({where: { userId: user.id }, attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }})
            )
            if (!userDetails) {
                const response = new Response(
                    false,
                    404,
                    "No user found.",
                );
                return res.status(response.code).json(response);
            }

            //  Create a Token that will be passed to the response.
            const token = jwt.sign(
                { id, name, email, phone, role },
                `${process.env.JWT_SECRET_KEY}`,
            );

            //  Now remove the "password" before returning the User.
            const userDataValues = user.dataValues;
            delete userDataValues.password;

            const response = new Response(
                true,
                200,
                'Successfully created a doctor.',
                { ...userDataValues, ...userDetails.dataValues, token }
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

export default UsersController;
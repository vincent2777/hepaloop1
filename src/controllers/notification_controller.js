'use strict';

import models from '../database/models';
import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";
import {Op} from "sequelize";

const { Notifications, Users } = models;

class NotificationController {
    //  Create a Single Notification.
    static createNotification = async (notificationData) => {
        try {
            //  Validate the Request Body.
            const { error, value } = await JoiValidator.notificationSchema.validate(notificationData);
            if (error) {
                return new Response(
                    false,
                    400,
                    `${ error.message }`
                )
            }

            //  Create a new notification.
            const notification = await Notifications.create({ ...value });
            if (!notification) {
                return new Response(
                    false,
                    409,
                    'Notification was not created.'
                );
            }

            return new Response(
                true,
                201,
                'Notification was created successfully.',
                { ...notification.dataValues }
            );
        } catch (error) {
            console.log(`ERROR::: ${error}`);

            return  new Response(
                false,
                500,
                'Server error, please try again later.'
            );
        }
    };

    //  Get All User's Notifications.
    static getAllUsersNotifications = async (req, res) => {
        try {
            const { id } = req.params;

            const notifications = await Notifications.findAll({
                where: {
                    receiverId: id,
                    isDelivered: false
                }
            });
            if (!notifications.length) {
                const response = new Response(
                    false,
                    404,
                    "No notification found."
                );
                return res.status(response.code).json(response);
            }

            let newNotifications = [];
            for (const notification of notifications) {
                const senderId = notification.dataValues["senderId"];  // 39a7ece4-a537-41bd-bb84-10036d08226b

                //Get Notification depending on the "id";
                const { name, picture } = await Users.findOne({ where: { id: senderId } });
                newNotifications.push({
                    ...notification.dataValues,
                    senderFullName: name,
                    senderImage: picture
                });
            }

            const response = new Response(
                true,
                200,
                'Notifications retrieved successfully.',
                newNotifications
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

    //  Update a single Notification.
    static updateSingleNotification = async (req, res) => {
        try {
            const { id } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.notificationUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            const updatedNotification = await Notifications.update({ ...value }, { where: { id } });
            if (updatedNotification[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update notifications."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Notifications updated successfully."
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

    //  Delete a single Notification.
    static deleteSingleNotification = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await Notifications.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No notification found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Notification deleted successfully."
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

export default NotificationController;
'use strict';

import models from '../database/models';
import Response from '../utils/response';
import JoiValidator from '../utils/joi_validator';
import SocketIOController from "./socketIO_controller";
import { Op } from "sequelize";
import NotificationController from "./notification_controller";

const { ConsultationRequest, DoctorPatientRelation, Individuals } = models;

class ConsultationRequestController {

    //  Create a Consultation Request.
    static createConsultationRequest = async (req, res) => {
        try {
            const requestBody = req.body;
            // console.log("REQUEST BODY::::: ", requestBody);

            //  Validate the Request Body.
            const { error, value } = JoiValidator.consultationRequestSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }
            const { doctorId, individualId } = value;

            //  First check the DoctorPatientRelation table and see if both are already acquainted.
            const doctorPatientRelated = await DoctorPatientRelation.findOne({
                where: { doctorId, individualId }
            });
            if (doctorPatientRelated) {
                const response = new Response(
                    false,
                    409,
                    "You already have this doctor."
                );
                SocketIOController.socketIOEmitter(
                    "notification",
                    individualId,
                    {
                        success: response.success,
                        code: response.code,
                        message: response.message
                    },
                );
                return res.status(response.code).json(response);
            }

            //  Secondly, check if consultation request has been existing else create a new consultation request.
            const [consultationRequest, created] = await ConsultationRequest.findOrCreate({
                where: { doctorId, individualId },
                defaults: { ...value }
            });
            if (!created) {
                const response = new Response(
                    false,
                    409,
                    "You already have a pending request."
                );
                SocketIOController.socketIOEmitter(
                    "notification",
                    individualId,
                    {
                        success: response.success,
                        code: response.code,
                        message: response.message
                    },
                );
                return res.status(response.code).json(response);
            }

            //  Get the Individuals name.
            const { individuals_fName, individuals_lName, individuals_avatar } = await Individuals.findOne({
                where: { id: individualId },
                attributes: {
                    exclude: ['individuals_password']
                }
            });

            //  Save to Notification Table.
            const notificationBody = {
                userId: doctorId,
                type: "Consultation",
                title: "Consultation Request.",
                refId: consultationRequest.id,
                senderId: individualId,
                receiverId: doctorId,
                content: `${ individuals_fName } ${ individuals_lName } sent you consultation request.`,
            };
            const notificationResponse = await NotificationController.createNotification(notificationBody);
            if (notificationResponse.success) {
                //  Call the SocketIO Emitter
                SocketIOController.socketIOEmitter(
                    "notification",
                    doctorId,
                    {
                        success: true,
                        code: 201,
                        ...notificationResponse.data,
                        senderFullName: `${ individuals_fName } ${ individuals_lName }`,
                        senderImage: individuals_avatar
                    },
                );
            }

            const response = new Response(
                true,
                200,
                'Consultation request sent successfully.',
                { ...consultationRequest.dataValues }
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


    //  Get All Pending Consultation Requests.
    static getAllPendingConsultationRequest = async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id);
            const consultationRequests = await ConsultationRequest.findAll({
                where: {
                    [Op.or]: [
                        { doctorId: id }, { individualId: id }
                    ],
                    status: "pending",
                }
            });
            if (!consultationRequests.length) {
                const response = new Response(
                    false,
                    404,
                    "No consultation request found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Consultation request retrieved successfully.',
                [ ...consultationRequests ]
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


    //  Get a Single Consultation Request
    static getSingleConsultationRequest = async (req, res) => {
        try {
            const { id } = req.params;

            const consultationRequest = await ConsultationRequest.findOne({
                where: { id }
            });
            if (!consultationRequest) {
                const response = new Response(
                    false,
                    404,
                    "No consultation request found.",
                );
                return res.status(response.code).json(response);
            }

            //  Get the Individuals name.
            const individual = await Individuals.findOne({
                where: { id: consultationRequest.individualId },
                attributes: {
                    exclude: ['individuals_password', 'createdAt', 'updatedAt']
                }
            });

            const formattedResponse = {
                ...consultationRequest.dataValues,
                individual
            };

            const response = new Response(
                true,
                200,
                'Consultation request retrieved successfully.',
                { ...formattedResponse }
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


    //  Update Consultation Request
    static updateConsultationRequest = async (req, res) => {
        try {
            const { id } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.consultationRequestSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Update Consultation Request.
            const updatedConsultationRequest = await ConsultationRequest.update(
                { ...value },
                { where: { id, status: "pending" } }
            );
            if (updatedConsultationRequest[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update consultation request."
                );
                return res.status(response.code).json(response);
            }
            const { status } = value;

            //  Get the doctorId and individualId using the conversation ID from the request params.
            const consultation = await ConsultationRequest.findOne({
                where: { id },
            });
            if (!consultation) {
                const response = new Response(
                    false,
                    404,
                    "No consultation found.",
                );
                return res.status(response.code).json(response);
            }

            if (status === "accepted") {
                //  Create DoctorPatientRelation Record.
                await DoctorPatientRelation.create({
                    doctorId: consultation.doctorId,
                    individualId: consultation.individualId
                });

                const response = new Response(
                    true,
                    200,
                    "Consultation request accepted successfully.",
                );
                return res.status(response.code).json(response);
            }

            if (status === "rejected") {
                const response = new Response(
                    true,
                    200,
                    "Consultation request rejected successfully."
                );
                return res.status(response.code).json(response);
            }

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


    //  Delete a Single Consultation Request
    static deleteConsultationRequest = async (req, res) => {
        try {
            const { id } = req.params;

            const isDeleted = await ConsultationRequest.destroy({
                where: { id }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "Fail to delete consultation."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Consultation deleted successfully.'
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

export default ConsultationRequestController;
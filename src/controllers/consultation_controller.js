'use strict';

import models from '../database/models';
import Response from "../utils/response";
import JoiValidator from "../utils/joi_validator";
import SocketIOController from "./socketIO_controller";
import NotificationController from "./notification_controller";
import {re} from "@babel/core/lib/vendor/import-meta-resolve";

const { Consultations, DoctorsPatients, Users } = models;

class ConsultationsController {
    //  Create a Consultation Request.
    static createConsultation = async (req, res) => {
        try {
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = await JoiValidator.consultationSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${ error.message }`
                )
                return res.status(response.code).json(response);
            }
            const {userId, senderId, receiverId } = value;

            //  First check the DoctorPatientRelation table and see if both are already acquainted.
            const doctorPatientRelated = await DoctorsPatients.findOne({
                where: { individualId: senderId, doctorId: receiverId }
            });
            if (doctorPatientRelated) {
                const response = new Response(
                    false,
                    409,
                    "You already have this doctor."
                );
                SocketIOController.socketIOEmitter(
                    "notification",
                    senderId,
                    {
                        success: response.success,
                        code: response.code,
                        message: response.message
                    },
                );
                return res.status(response.code).json(response);
            }

            //  Secondly, check if consultation request has been existing else create a new consultation request.
            const [consultationRequest, created] = await Consultations.findOrCreate({
                where: { senderId, receiverId },
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
                    senderId,
                    {
                        success: response.success,
                        code: response.code,
                        message: response.message
                    },
                );
                return res.status(response.code).json(response);
            }

            //  Get the senders details.
            const  { name, picture } = await Users.findOne({ where: { id: senderId } });


            //  Save to Notification Table.
            const notificationBody = {
                userId,
                senderId,
                receiverId,
                type: "Consultation",
                title: "Consultation Request.",
                refId: consultationRequest.id,
                content: `${name} requests a consultation.`,
                isDelivered: false
            };
            const notificationResponse = await NotificationController.createNotification(notificationBody);
            if (!notificationResponse.success) {
                const response = new Response(
                    notificationResponse.success,
                    notificationResponse.code,
                    notificationResponse.message,
                );
                //  Call the SocketIO Emitter
                SocketIOController.socketIOEmitter(
                    "notification",
                    senderId,
                    {
                        success: response.success,
                        code: response.code,
                        message: response.message
                    },
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                201,
                'Consultation request and notification sent successfully.',
                { ...consultationRequest.dataValues }
            );
            //  Call the SocketIO Emitter
            SocketIOController.socketIOEmitter(
                "notification",
                receiverId,
                {
                    success: response.success,
                    code: response.code,
                    ...notificationResponse.data,
                    senderFullName: name,
                    senderImage: picture
                },
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

    //  Get all Consultations.
    static getAllConsultations = async (req, res) => {
        try {
            const consultations = await Consultations.findAll();
            if (!consultations) {
                const response = new Response(
                    false,
                    404,
                    "No consultation found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Consultations retrieved successfully.',
                { consultations, length: consultations.length }
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

    //  Get a single Consultation By a Specific Sender.
    static getAllPendingConsultationsBySender = async (req, res) => {
        try {
            const { senderId } = req.params;

            const consultations = await Consultations.findAll({
                where: { senderId,  status: "pending" }
            });
            if (!consultations.length) {
                const response = new Response(
                    false,
                    404,
                    "No consultation found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Consultations retrieved successfully.',
                { consultations, length: consultations.length }
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

    //  Get a single Consultation By a Specific Receiver.
    static getAllPendingConsultationsForReceiver = async (req, res) => {
        try {
            const { receiverId } = req.params;

            const consultations = await Consultations.findAll({
                where: { receiverId, status: "pending" }
            });
            if (!consultations.length) {
                const response = new Response(
                    false,
                    404,
                    "No consultation found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Consultations retrieved successfully.',
                { consultations, length: consultations.length }
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

    //  Get a single Consultation.
    static getSingleConsultation = async (req, res) => {
        try {
            const { id } = req.params;
            const consultation = await Consultations.findOne({
                where: { id }
            });
            if (!consultation) {
                const response = new Response(
                    false,
                    404,
                    "No consultation found.",
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                'Consultation retrieved successfully.',
                { ...consultation.dataValues }
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

    //  Update a Consultation.
    static updateConsultation = async (req, res) => {
        try {
            const { id } = req.params;
            const requestBody = req.body;

            //  Validate the Request Body.
            const { error, value } = JoiValidator.consultationUpdateSchema.validate(requestBody);
            if (error) {
                const response = new Response(
                    false,
                    400,
                    `${error.message}`
                );
                return res.status(response.code).json(response);
            }

            //  Update Consultation.
            const updatedConsultation = await Consultations.update(
                { ...value },
                { where: { id, status: "pending" } }
            );
            console.log("UPDTED::: ", updatedConsultation);
            if (updatedConsultation[0] === 0) {
                const response = new Response(
                    false,
                    400,
                    "Failed to update consultation."
                );
                return res.status(response.code).json(response);
            }

            const consultation = await Consultations.findOne({
                where: { id }
            });
            const { senderId, receiverId, status } = consultation;
            console.log("UPDTED::: ", senderId, receiverId, status);

            if (status === "rejected") {

                const response = new Response(
                    true,
                    200,
                    "Consultation request rejected successfully."
                );
                return res.status(response.code).json(response);
            }

            //  If status is NOT "rejected" , then create DoctorPatients Record.
            await DoctorsPatients.create({
                userId: [senderId, receiverId],
                doctorId: receiverId,
                individualId: senderId
            });

            const response = new Response(
                true,
                200,
                "Consultation request accepted successfully.",
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

    //  Delete a Consultation.
    static deleteConsultation = async (req, res) => {
        try {
            const { id } = req.params;
            const { id: senderId } = req.requestPayload
            console.log("ID::: ", id);
            console.log("SENDER_ID::: ", senderId);

            const isDeleted = await Consultations.destroy({
                where: { id, senderId }
            });
            if (isDeleted !== 1) {
                const response = new Response(
                    false,
                    404,
                    "No consultations found."
                );
                return res.status(response.code).json(response);
            }

            const response = new Response(
                true,
                200,
                "Consultation deleted successfully."
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

export default ConsultationsController;
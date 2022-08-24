'use strict';

import { Router } from "express";
import ConsultationsController from "../controllers/consultation_controller";
import TokenVerification from "../utils/token_verification";

//  Setup Express Router.
const consultationsRouter = Router();


//  Create a single notification.
consultationsRouter.post(
    "/create_consultation",
    TokenVerification.userTokenValidation,
    ConsultationsController.createConsultation
);

//  Create a single notification.
consultationsRouter.get(
    "/all_consultations",
    ConsultationsController.getAllConsultations
);

//  Get all consultations by sender.
consultationsRouter.get(
    "/all_pending_consultations_by_sender/:senderId",
    TokenVerification.userTokenValidation,
    ConsultationsController.getAllPendingConsultationsBySender
);

//  Get all consultations by receiver.
consultationsRouter.get(
    "/all_pending_consultations_for_receiver/:receiverId",
    TokenVerification.userTokenValidation,
    ConsultationsController.getAllPendingConsultationsForReceiver
);

//  Create a single consultations.
consultationsRouter.get(
    "/single_consultation/:id",
    TokenVerification.userTokenValidation,
    ConsultationsController.getSingleConsultation
);

//  Update a single consultations.
consultationsRouter.put(
    "/update_consultation/:id",
    TokenVerification.userTokenValidation,
    ConsultationsController.updateConsultation
);

//  Delete a single consultations.
consultationsRouter.delete(
    "/delete_consultation/:id",
    TokenVerification.userTokenValidation,
    ConsultationsController.deleteConsultation
);

export default consultationsRouter;
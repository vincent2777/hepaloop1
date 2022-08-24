'use strict';

import { Router } from 'express';
import TokenVerification from "../utils/token_verification";
import ConsultationRequestController from "../controllers/consultation_request_controller";


//  Set up Express Router.
const consultationRequestRouter = Router();

//  Create Consultation Request.
consultationRequestRouter.post(
    '/create_consultation_request',
    // TokenVerification.individualsTokenVerification,
    ConsultationRequestController.createConsultationRequest
);

//  Get All Consultation Request.
consultationRequestRouter.get(
    '/all_pending_consultation_requests/:id',
    ConsultationRequestController.getAllPendingConsultationRequest
);

//  Get Single Consultation Request.
consultationRequestRouter.get(
    '/single_consultation_request/:id',
    TokenVerification.doctorsTokenVerification,
    ConsultationRequestController.getSingleConsultationRequest
);

//  Update Consultation Request.
consultationRequestRouter.put(
    '/update_consultation_request/:id',
    TokenVerification.userTokenValidation,
    ConsultationRequestController.updateConsultationRequest
);

//  Delete a Single Consultation Request
consultationRequestRouter.delete(
    '/delete_consultation_request/:id',
    ConsultationRequestController.deleteConsultationRequest
);

export default consultationRequestRouter;
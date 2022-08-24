'use strict';

import { Router } from 'express';
import TokenVerification from '../utils/token_verification';
import IndividualsController from "../controllers/individual_controller";
import userAvatarUpload from "../controllers/user_picture_upload_controller";

//  Set up Express Router.
const individualsRouter = Router();


//  Create a single individual.
individualsRouter.post(
    '/create_individual',
    TokenVerification.userTokenValidation,
    IndividualsController.createIndividual
);

//  Get all Individuals.
individualsRouter.get(
    '/all_individuals',
    IndividualsController.getAllIndividuals
);

//  Get a single Individual.
individualsRouter.get(
    '/single_individual/:id',
    IndividualsController.getSingleIndividual
);

//  Update a Staff.
individualsRouter.put(
    '/update_individual/:id',
    TokenVerification.individualsTokenVerification,
    IndividualsController.updateIndividual
);

//  Delete a Individual.
individualsRouter.delete(
    '/delete_individual/:id',
    TokenVerification.individualsTokenVerification,
    IndividualsController.deleteIndividual
);

export default individualsRouter;

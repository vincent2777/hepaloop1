'use strict';

import { Router } from 'express';
import TokenVerification from '../utils/token_verification';
import PharmacyController from "../controllers/pharmacy_controller";
import userAvatarUpload from "../controllers/user_picture_upload_controller";

//  Set up Express Router.
const pharmacyRouter = Router();



//  Pharmacy SignUp.
pharmacyRouter.post(
    '/signup',
    PharmacyController.signUpPharmacy
);

//  Pharmacy Login.
pharmacyRouter.post(
    '/login',
    PharmacyController.loginPharmacy
);

//  Create a single pharmacy.
pharmacyRouter.post(
    '/create_pharmacy',
    TokenVerification.pharmacyTokenVerification,
    PharmacyController.createPharmacy
);

//  Get all Pharmacy.
pharmacyRouter.get(
    '/all_pharmacy',
    PharmacyController.getAllPharmacy
);

//  Get a single Pharmacy.
pharmacyRouter.get(
    '/single_pharmacy/:id',
    PharmacyController.getSinglePharmacy
);

//  Update a Staff.
pharmacyRouter.put(
    '/update_pharmacy/:id',
    TokenVerification.pharmacyTokenVerification,
    PharmacyController.updatePharmacy
);

//  Delete a Pharmacy.
pharmacyRouter.delete(
    '/delete_pharmacy/:id',
    TokenVerification.pharmacyTokenVerification,
    PharmacyController.deletePharmacy
);



//  Uploading Users Profile Avatar.
pharmacyRouter.put(
    '/update_avatar',
    TokenVerification.pharmacyTokenVerification,
    userAvatarUpload,
    PharmacyController.updatePharmacyAvatar
);

export default pharmacyRouter;

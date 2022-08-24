'use strict';

import { Router } from 'express';
import UsersController from "../controllers/user_controller";
import TokenVerification from "../utils/token_verification";
import userAvatarUpload from "../controllers/user_picture_upload_controller";

//  Set up Express Router.
const userRouter = Router();

//  Users Signup.
userRouter.post(
    "/signup",
    UsersController.signupUser
);

//  User Login.
userRouter.post(
    "/login",
    UsersController.loginUser
);

//  Get all Users.
userRouter.get(
    "/all_users",
    UsersController.getAllUsers
);

//  Get a single User.
userRouter.get(
    "/single_user/:id",
    UsersController.getSingleUser
);

//  Update a User.
userRouter.put(
    "/update_user/:id",
    TokenVerification.userTokenValidation,
    UsersController.updateUser
);

//  Delete a User.
userRouter.delete(
    "/delete_user/:id",
    TokenVerification.userTokenValidation,
    UsersController.deleteUser
);

//  Uploading Users Profile Picture.
userRouter.put(
    "/upload_user_picture",
    TokenVerification.userTokenValidation,
    userAvatarUpload,
    UsersController.uploadUserPicture
);

export default userRouter;
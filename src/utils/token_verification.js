'use strict';

import jwt from 'jsonwebtoken';

import Response from './response';
import models from "../database/models";

const { Users, Doctors, Individuals, Hospitals, Pharmacy, Consultations } = models;

class TokenVerification {

    //  User Token Verification.
    static userTokenValidation = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;
            if (!token) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you did not provide any token."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Users "id".
            const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  Make sure that the respective User exists in the DB.
            const user = await Users.findOne({
                where: { id }
            });
            if (!user) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, this user does not exist.",
                );
                return res.status(response.code).json(response);
            }

            //  Now append the decoded token to the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return next();

        } catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    };

    //  Doctors Token Verification.
    static doctorsTokenVerification = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;
            if (!token) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you did not provide any token."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Doctors "id".
            const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  If Token exist, then make sure that the respective Doctor exists in the DB.
            const doctor = await Doctors.findOne({
                where: { id }
            });
            if (!doctor) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, this doctor does not exist.",
                );
                return res.status(response.code).json(response);
            }

            //  Now append the decoded token to the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return next();
        } catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    };


    //  Individuals Token Verification.
    static individualsTokenVerification = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;
            if (!token) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you did not provide any token."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Individual "id".
            const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  If Token exist, then make sure that the respective Individual exists in the DB.
            const individual = await Individuals.findOne({
                where: { id }
            });
            if (!individual) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, this individual does not exist.",
                );
                return res.status(response.code).json(response);
            }

            //  Now append the decoded token to the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return next();
        } catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    }


    //  Pharmacy Token Verification.
    static pharmacyTokenVerification = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;
            if (!token) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you did not provide any token."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Pharmacy "id".
            const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  If Token exist, then make sure that the respective Pharmacy exists in the DB.
            const pharmacy = await Pharmacy.findOne({
                where: { id },
            });
            if (!pharmacy) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, this pharmacy does not exist.",
                );
                return res.status(response.code).json(response);
            }

            //  Now append the decoded token to the the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);

            return next();
        }catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    };


    //  Hospitals Token Verification.
    static hospitalsTokenVerification = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;

            if (!token) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, you did not provide any token."
                );
                return res.status(response.code).json(response);
            }

            //  Get the Pharmacy "id".
            const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            //  If Token exist, then make sure that the respective Hospital exists in the DB.
            const hospital = await Hospitals.findOne({
                where: { id },
            });
            if (!hospital) {
                const response = new Response(
                    false,
                    401,
                    "Unauthorized, this hospital does not exist."
                );
                return res.status(response.code).json(response);
            }

            //  Now append the decoded token to the the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);

            return next();
        }catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    };


    //  Other Token Verification.
    static others = async (req, res, next) => {
        try {
            //  Get the token from the "Header, Query or Body" if available.
            const token = req.headers.authorization ||
                req.headers['x-access-token'] ||
                req.query.token ||
                req.body.token;

            //  TODO 1
            //  Get the User "id".

            //  TODO 2
            //  If Token exist, then make sure that the respective User exists in the DB.

            //  Now append the decoded token to the the request body.
            req.requestPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);

            return next();
        }catch (error) {
            const response = new Response(
                false,
                401,
                "Unauthorized, you have an invalid token."
            );
            return res.status(response.code).json(response);
        }
    };
}

export default TokenVerification;

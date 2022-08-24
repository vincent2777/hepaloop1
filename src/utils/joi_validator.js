'use strict';

import Joi from 'joi';

const role = ['Admin', 'Doctor', 'Hospital', 'Individual', 'Pharmacy'];
const channel = ['Audio call', 'Video call', 'Physical Visit'];
const status = ['Accepted', 'Declined'];
const unit = ['mmol/L', 'mg/dL'];

class JoiValidator {

    /*=====================================================================================*/
    /*=================================== FOR USERS =====================================*/
    //  Users Validation Schema.
    static usersSchema = Joi.object({
        name: Joi.string().required().min(6),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        picture: Joi.string(),
        role: Joi.string().required().valid(...role),
        password: Joi.string().required()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    });

    //  Users Update Validation Schema.
    static usersUpdateSchema = Joi.object({
        name: Joi.string().min(6),
        email: Joi.string().email(),
        phone: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        picture: Joi.string(),
        role: Joi.string().valid(...role),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
        confirmPassword: Joi.string().valid(Joi.ref('password')),
    });

    //  User Login Validation Schema.
    static usersLoginSchema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    /*=====================================================================================*/
    /*=================================== FOR DOCTORS =====================================*/

    //  Doctors Validation Schema.
    static doctorsSchema = Joi.object({
        gender: Joi.string().required(),
        specialty: Joi.string().required(),
        hospital: Joi.string().required(),
        syop: Joi.string().required(),
        bioInfo: Joi.string(),
        rating: Joi.string(),
    });

    //  Doctors Update Validation Schema.
    static doctorsUpdateSchema = Joi.object({
        gender: Joi.string(),
        specialty: Joi.string(),
        hospital: Joi.string(),
        syop: Joi.string(),
        bioInfo: Joi.string(),
        rating: Joi.string(),
    });


    /*=====================================================================================*/
    /*=================================== FOR PATIENTS ====================================*/

    //  Individuals Validation Schema.
    static individualsSchema = Joi.object({
        gender: Joi.string().required(),
        dob: Joi.string().required(),
        age: Joi.number().required(),
        height: Joi.number().required(),
        weight: Joi.number().required(),
    });

    //  Individuals Update Validation Schema.
    static individualsUpdateSchema = Joi.object({
        gender: Joi.string(),
        dob: Joi.string(),
        age: Joi.number(),
        height: Joi.number(),
        weight: Joi.number()
    });


    /*=====================================================================================*/
    /*=================================== FOR HOSPITALS ====================================*/

    //  Hospitals Validation Schema.
    static hospitalsSchema = Joi.object({
        hospitals_name: Joi.string().required().min(3),
        hospitals_email: Joi.string().required().email(),
        hospitals_phone: Joi.string().required(),
        hospitals_address: Joi.string(),
        hospitals_city: Joi.string(),
        hospitals_state: Joi.string(),
        hospitals_country: Joi.string(),
        hospitals_DOR: Joi.string(),
        hospitals_profileInfo: Joi.string(),
        hospitals_logo: Joi.string(),
        hospitals_password: Joi.string().required()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
        hospitals_confirmPassword: Joi.string().required().valid(Joi.ref('hospitals_password')),
        user_type: Joi.string().required(),
    });

    //  Hospitals Update Validation Schema.
    static hospitalsUpdateSchema = Joi.object({
        hospitals_name: Joi.string().min(3),
        hospitals_email: Joi.string().email(),
        hospitals_phone: Joi.string(),
        hospitals_address: Joi.string(),
        hospitals_city: Joi.string(),
        hospitals_state: Joi.string(),
        hospitals_country: Joi.string(),
        hospitals_DOR: Joi.string(),
        hospitals_profileInfo: Joi.string(),
        hospitals_logo: Joi.string(),
        hospitals_password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
        // hospitals_password: Joi.string().valid(Joi.ref('individuals_password')),
    });

    //  Hospitals Login Validation Schema.
    static hospitalsLoginSchema = Joi.object({
        hospitals_email: Joi.string().email(),
        hospitals_password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
        user_type: Joi.string().required()
    });


    /*=====================================================================================*/
    /*=================================== FOR PHARMACY ====================================*/

    //  Pharmacy Validation Schema.
    static pharmacySchema = Joi.object({
        pharmacy_name: Joi.string().required().min(3),
        pharmacy_email: Joi.string().required().email(),
        pharmacy_phone: Joi.string().required(),
        pharmacy_address: Joi.string(),
        pharmacy_city: Joi.string(),
        pharmacy_state: Joi.string(),
        pharmacy_country: Joi.string(),
        pharmacy_DOR: Joi.string(),
        pharmacy_profileInfo: Joi.string(),
        pharmacy_logo: Joi.string(),
        pharmacy_password: Joi.string().required()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
        pharmacy_confirmPassword: Joi.string().required().valid(Joi.ref('pharmacy_password')),
        user_type: Joi.string().required()
    });

    //  Pharmacy Update Validation Schema.
    static pharmacyUpdateSchema = Joi.object({
        pharmacy_name: Joi.string().min(3),
        pharmacy_email: Joi.string().email(),
        pharmacy_phone: Joi.string(),
        pharmacy_address: Joi.string(),
        pharmacy_city: Joi.string(),
        pharmacy_state: Joi.string(),
        pharmacy_country: Joi.string(),
        pharmacy_DOR: Joi.string(),
        pharmacy_profileInfo: Joi.string(),
        pharmacy_logo: Joi.string(),
        pharmacy_password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
        // pharmacy_confirmPassword: Joi.string().valid(Joi.ref('pharmacy_password')),
    });

    //  Pharmacy Login Validation Schema.
    static pharmacyLoginSchema = Joi.object({
        pharmacy_email: Joi.string().email(),
        pharmacy_password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .error(new Error("Password must be at least 6 characters and alphanumeric.")),
        user_type: Joi.string().required()
    });


    /*=====================================================================================*/
    /*================================== FOR NOTIFICATION =================================*/

    //  Notification Validation Schema.
    static notificationSchema = Joi.object({
        userId: Joi.string().required(),
        senderId: Joi.string().required(),
        receiverId: Joi.string().required(),
        type: Joi.string().required(),
        title: Joi.string().required(),
        refId: Joi.string().required(),
        content: Joi.string().required(),
        isDelivered: Joi.boolean(),
    });

    //  Pharmacy Update Validation Schema.
    static notificationUpdateSchema = Joi.object({
        isDelivered: Joi.boolean(),
    });


    /*=====================================================================================*/
    /*================================== FOR CONSULTATIONS =================================*/

    //  Notification Validation Schema.
    static consultationSchema = Joi.object({
        userId: Joi.string().required(),
        senderId: Joi.string().required(),
        receiverId: Joi.string().required(),
        status: Joi.string(),
    });

    //  Notification Validation Schema.
    static consultationUpdateSchema = Joi.object({
        status: Joi.string().required(),
    });


    /*=====================================================================================*/
    /*================================== FOR APPOINTMENT =================================*/

    //  Notification Validation Schema.
    static appointmentSchema = Joi.object({
        userId: Joi.string().required(),
        senderId: Joi.string().required(),
        senderName: Joi.string().required(),
        receiverId: Joi.string().required(),
        receiverName: Joi.string().required(),
        severity: Joi.string().required(),
        channel: Joi.string().required().valid(...channel),
        date: Joi.string().required(),
        time: Joi.string().required(),
        venue: Joi.string().required(),
        purpose: Joi.string().required(),
        status: Joi.string().required().valid(...status),
        doctorId: Joi.string(),
        individualId: Joi.string()
    });

    //  Notification Validation Schema.
    static appointmentUpdateSchema = Joi.object({
        userId: Joi.string(),
        senderId: Joi.string(),
        senderName: Joi.string(),
        receiverId: Joi.string(),
        receiverName: Joi.string(),
        severity: Joi.string(),
        channel: Joi.string().valid(...channel),
        date: Joi.string(),
        time: Joi.string(),
        venue: Joi.string(),
        purpose: Joi.string(),
        status: Joi.string().valid(...status),
        doctorId: Joi.string(),
        individualId: Joi.string()
    });


    /*=====================================================================================*/
    /*================================= FOR CONSULTATION REQUEST =================================*/
    //  Consultation Validation Schema
    static consultationRequestSchema = Joi.object({
        doctorId: Joi.string().required(),
        individualId: Joi.string().required(),
        status: Joi.string(),
    });


    /*=====================================================================================*/
    /*================================== FOR BLOOD GLUCOSE =================================*/

    //  Blood Glucose Validation Schema.
    static bloodGlucoseSchema = Joi.object({
        patientId: Joi.string().required(),
        doctorId: Joi.string().required(),
        fasting: Joi.number().required(),
        random: Joi.number().required(),
        twoHours: Joi.number().required(),
        unit: Joi.string().required().valid(...unit),
        outOfRange: Joi.boolean().required()
    });

    //  Blood Glucose Validation Schema.
    static bloodGlucoseUpdateSchema = Joi.object({
        patientId: Joi.string(),
        doctorId: Joi.string(),
        fasting: Joi.number(),
        random: Joi.number(),
        twoHours: Joi.number(),
        unit: Joi.string().valid(...unit),
        outOfRange: Joi.boolean()
    });


    /*=====================================================================================*/
    /*================================== FOR BLOOD PRESSURE =================================*/

    //  Blood Pressure Validation Schema.
    static bloodPressureSchema = Joi.object({
        patientId: Joi.string().required(),
        doctorId: Joi.string().required(),
        sys: Joi.number().required(),
        dia: Joi.number().required(),
        pulse: Joi.number().required(),
        outOfRange: Joi.boolean().required()
    });

    //  Blood Pressure Validation Schema.
    static bloodPressureUpdateSchema = Joi.object({
        patientId: Joi.string(),
        doctorId: Joi.string(),
        sys: Joi.number(),
        dia: Joi.number(),
        pulse: Joi.number(),
        outOfRange: Joi.boolean()
    });

}
export default JoiValidator;

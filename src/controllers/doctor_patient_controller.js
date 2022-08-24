'use strict';

import models from '../database/models';
import Response from '../utils/response';

const { DoctorsPatients, Doctors, Users, Individuals } = models;

class DoctorPatientController {

    //  Get All Doctors Patients.
    static getAllDoctorPatients = async (req, res) => {
        try {
            const { id } = req.requestPayload;

            const doctorsPatients = await DoctorsPatients.findAll({
                where: { doctorId: id },
            });
            if (!doctorsPatients.length) {
                const response = new Response(
                    false,
                    404,
                    "No patient found."
                );
                return res.status(response.code).json(response);
            }

            let patientList = [];
            for (const patient of doctorsPatients) {
                const userId = patient.individualId;

                //  Get the User alongside with Individuals details.
                const userDetail = await Users.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
                const individualDetail = await Individuals.findOne({
                    where: { userId },
                    attributes: {exclude: ['id', 'userId', 'createdAt', 'updatedAt']}
                });

                const patientDetail = {...userDetail.dataValues, ...individualDetail.dataValues};
                if (patientDetail) {
                    patientList.push(patientDetail);
                }
            }

            const response = new Response(
                true,
                200,
                'Patients retrieved successfully.',
                patientList
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

    //  Get All Individuals Doctors.
    static getAllIndividualDoctors = async (req, res) => {
        try {
            const { id } = req.requestPayload;

            const doctorsPatients = await DoctorsPatients.findAll({
                where: { individualId: id },
            });
            if (!doctorsPatients.length) {
                const response = new Response(
                    false,
                    404,
                    "No doctor found."
                );
                return res.status(response.code).json(response);
            }

            let doctorList = [];
            for (const doctor of doctorsPatients) {
                const userId = doctor.doctorId;

                //  Get the User alongside with Doctors details.
                const userDetail = await Users.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
                const doctorDetail = await Doctors.findOne({
                    where: { userId },
                    attributes: {exclude: ['id', 'userId', 'createdAt', 'updatedAt']}
                });

                const myDoctorDetail = {...userDetail.dataValues, ...doctorDetail.dataValues};
                if (myDoctorDetail) {
                    doctorList.push(myDoctorDetail);
                }
            }

            const response = new Response(
                true,
                200,
                'Doctors retrieved successfully.',
                doctorList
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

export default DoctorPatientController;
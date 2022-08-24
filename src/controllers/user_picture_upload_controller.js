'use strict';

import multer from 'multer';
import path from "path";
import Response from '../utils/response';

// Multer Storage Method.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '_' + Date.now() + '_' + 'profile_photo' + path.extname(file.originalname));
    }
});

// Multer File Filter.
const fileFilter = (req, file, callback) => {
    //  Get the File Extension name.
    let extName = path.extname(file.originalname).toLowerCase();

    //  Allowed Extensions.
    //  if(file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    //      return callback(null, true);
    //  }
    
    // OR

    if (extName === ".jpg" || extName === ".jpeg" || extName === ".png") {
        return callback(null, true);
    }
    return callback({ message: 'Error; Please select images only.' }, false);
} ;

// Multer Object.
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 100000},
}).single('avatar');

//  Uploading Image Function
const userAvatarUpload = (req, res, next) => {
    upload(req, res, (error) => {
        if(error) {
            const response = new Response(
                false,
                600,
                (error.message) ? `Error: ${error.message}` : error
            );
            return res.status(response.code).json(response);
        }
        return next();
    });
};

export default userAvatarUpload;


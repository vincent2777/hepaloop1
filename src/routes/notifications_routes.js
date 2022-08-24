'use strict';

import { Router } from "express";
import NotificationController from "../controllers/notification_controller";

//  Setup Express Router.
const notificationsRouter = Router();


//  Create a single notification.
notificationsRouter.get(
    "/all_notifications/:id",
    NotificationController.getAllUsersNotifications
);

//  Update a single Notification.
notificationsRouter.put(
    "/update_notification/:id",
    NotificationController.updateSingleNotification
);

//  Delete a single Notification.
notificationsRouter.delete(
    "/delete_notification/:id",
    NotificationController.deleteSingleNotification
);

export default notificationsRouter
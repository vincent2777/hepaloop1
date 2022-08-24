'use strict';

import {RtmTokenBuilder} from "../utils/RtmTokenBuilder";
import rtmRole from "../utils/RtmTokenBuilder";
import privileges from "../utils/AccessToken";
const appID = "90e5f4798ffe421dbe68c8a6e52622a7";
const appCertificate = "6d2efd2adebb4528b55f16a521a4aa57";
const account = "test_user_id";
const RtmRole = rtmRole.Role;

const expirationTimeInSeconds = 3600
const currentTimestamp = Math.floor(Date.now() / 1000)

const privilegeExpiredTS = currentTimestamp + expirationTimeInSeconds;

const token = RtmTokenBuilder.buildToken(appID, appCertificate, account, RtmRole, privilegeExpiredTS);

console.log("Rtm Token: " + token);

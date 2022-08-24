'use strict'

//  Set up socket.io
import socketIO from "socket.io";
import { server } from './expressSetup';

const io = socketIO(server, {
    cors: {
        origin: '*',
    },
});

export { io };
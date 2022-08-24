// socket.emit(@eventName, @args);     // To only the user joining
// socket.broadcast.emit(@eventName, @args);  // To all other users except the user joining.
// io.emit(@eventName, @args);   // To all users in general.
// io.to(roomName).emit(@eventName, @args);   // To all users inside a specific room including the sender.
// socket.broadcast.to(roomName).emit(@eventName, @args);   // To all users in a specific room excluding the sender.


import jwt from "jsonwebtoken";
import { io } from "../config/socketIOSetup";

class SocketIOController {

    //  Create Socket.IO Connection.
    static socketConnection = (io) => {
        io.on("connection", (socket) => {
            const { token } = socket.handshake.auth;
            // console.log("TOKEN:::", socket.handshake);

            //  Decode the Token.
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decodedToken["id"];
            const userName = decodedToken[`${ Object.keys(decodedToken)[1] }`];

            //  Create a room using the users "id".
            socket.join(userId);

            //   When User connects.
            socket.emit("connectionMessage", {
                userId,
                userName,
                message: `Welcome ${ userName } to the App.`,
            });
            socket.broadcast.emit("connectionMessage", {
                userId,
                userName,
                message: `${ userName } is online.`,
            });
            /*io.to(userId).emit("connectionMessage", {
                userId,
                userName,
                message: `${ userName } joined the room ${ userId }`,
            });*/
            console.log(`${ userName } with UserId =  ${ userId } and SocketId = ${socket.id} is connected...`);

            //   When User disconnects.
            socket.on("disconnect", () => {
                socket.leave(userId);
                socket.broadcast.emit("leave", {
                    userId,
                    userName,
                    message: `${ userName } just disconnected.`
                });
                console.log(`${ userName } just disconnected and left room ${ userId }.`);
            });
        });
    };


    //  Socket Emitter.
    static socketIOEmitter = ( eventName, userId, data ) => {
        // console.log("CONSULTATION DATA::: ", data);
        io.to(userId).emit(eventName, data);
    };
}

export default SocketIOController;
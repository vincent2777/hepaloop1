'use strict'

//  Set Up Express App.
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

export { app, server };
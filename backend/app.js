import express from "express"
import dotenv from  "dotenv"
import {MongoDb} from "./src/config/mongodb.js"
import routing from "./src/routes/routing.js"
import { errorHandling } from "./src/middlewares/errorHandling-middleware.js"
import cookieParser from "cookie-parser"

/* Express */
const app = express()

/* Dotenv */
dotenv.config()

/* Default body parser */
app.use(express.json())

/* Cookie Parser */
app.use(cookieParser())

/* MONGODB */
MongoDb()

/* Routing */
app.use("/api/v1", routing)

/* Error handling middleware */
app.use(errorHandling)

export default app
import mongoose from "mongoose";

/* Mongodb connection */
export const MongoDb = () => {
    mongoose.connect(process.env.MONGO_DB, {autoCreate: true, autoIndex: true})
        .then(() => {console.log(`Database connection established`)})
}

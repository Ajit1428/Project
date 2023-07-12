import jwt from "jsonwebtoken";
import userSer from "../services/user-service.js";

export const tokenAuth = async (req, res, next) => {
    try {
        /* Fetching token stored in the cookies */
        let { token } = req.cookies;
        if (!token) {
            next({ status: 404, msg: "User not logged in" });
        }
         /* Verfying the fetched token with the existing token */
        let data = jwt.verify(token, process.env.JWT_SECRET);
        if (!data) {
            next({ status: 404, msg: "Token does not exist" });
        } else {
            /* Fetching the user using the id passed while generating the token */
            let dataId = data._id;
            let userDetails = await userSer.getUserById(dataId);

            if (!userDetails) {
                next({ status: 404, msg: "Token does not exist" });
            } else {
                /* Storing the fetched userdetails in tokenUser */
                req.tokenUser = userDetails;
                next();
            }
        }
    } catch (error) {
        next({ status: 400, msg: error });
    }
};

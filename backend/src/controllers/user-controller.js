import userSer from "../services/user-service.js";
import { decryptPass, encryptPass } from "../utils/bcrypt-utils.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendMail-utils.js";

class UserController {
    register = async (req, res, next) => {
        try {
            let data = req.body;

            /* Encrypting the password */
            let decode = await encryptPass(data.password);
            data.password = decode;

            /* Checking for existing users if any using email */
            let existsEmail = await userSer.getUserByEmail(data.email);
            if (existsEmail) {
                next({ stauts: 400, msg: "Email already exists" });
            } else {
                /* Registering the user */
                let response = await userSer.saveUser(data);
                res.json({
                    result: response,
                    msg: "Registerd the user successfully",
                    status: true,
                    meta: null,
                });
            }
        } catch (error) {
            console.log(`Registration Error: ${error.message}`);
            next({ status: 400, msg: `Registration Error: ${error.message}` });
        }
    };

    login = async (req, res, next) => {
        try {
            let data = req.body;
            /* Checking for existing users if any using email */
            let existUser = await userSer.getUserByEmail(data.email);
            /* Decrypting the password to login */
            if (await decryptPass(data.password, existUser.password)) {
                /* Generating the token */
                let token = jwt.sign(
                    { _id: existUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );
                /* Cookie to store the token */
                res.cookie("token", token, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                }).json({
                    result: {
                        accessToken: token,
                        Logged_in_as: existUser.name,
                    },
                    msg: "Logged in successfully",
                    status: true,
                    meta: null,
                });
            } else {
                next({
                    status: 401,
                    msg: "Your email or password does not match",
                });
            }
        } catch (error) {
            console.log(`Login Error: ${error.message}`);
            next({ status: 401, msg: `Login Error: ${error.message}` });
        }
    };

    logout = async (req, res, next) => {
        try {
            /* Setting cookies to null for logout functionality */
            res.cookie("token", null, {
                httpOnly: true,
                expires: new Date(Date.now()),
            }).json({
                msg: "Logged out successfully",
                status: true,
                meta: null,
            });
        } catch (error) {
            console.log(`Logout Error: ${error.message}`);
            next({ status: 401, msg: `Logout Error: ${error.message}` });
        }
    };

    forgetPassword = async (req, res, next) => {
        try {
            /* Verifying the user */
            const user = await userSer.getUserByEmail(req.body.email);
            if (!user) {
                next({ status: 404, msg: "User not found" });
            } else {
                /* Generating the token */
                let forgetPassToken = jwt.sign(
                    { email: user.email },
                    process.env.JWT_SECRET_PASSWORD,
                    { expiresIn: "14m" }
                );
                /* Generating reset password url */
                const resetPasswordUrl = `${req.protocol}://${req.get(
                    "host"
                )}/api/v1/user/password/reset/${forgetPassToken}`;
                /* Setting up the message */
                const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\nIf your have not requested this email than ignore it`;
                /* Sending mail options */
                await sendEmail({
                    email: user.email,
                    subject: "Ecommerce password recovery",
                    message: message,
                });
                res.json({
                    msg: `Email sent successfully to ${user.email}`,
                    status: true,
                });
            }
        } catch (error) {
            next({
                status: 401,
                msg: "Cannot send the reset token to change the password",
            });
        }
    };

    resetPassword = async (req, res, next) => {
        try {
            /* Fetching the token */
            const resetToken = req.params.token;
            /* Comparing and verifying the fetched token */
            const resetUserToken = jwt.verify(
                resetToken,
                process.env.JWT_SECRET_PASSWORD
            );
            /* Fetching the user from the payload email*/
            const resetUser = await userSer.getUserByEmail(
                resetUserToken.email
            );
            if (req.body.password !== req.body.confirmPassword) {
                next({ status: 401, msg: "Your password doesn't match" });
            } else {
                /* Encrypting the password */
                const bcryptResetUser = await encryptPass(req.body.password);
                resetUser.password = bcryptResetUser;
                /* Saving the user */
                const savedResetUser = await userSer.resetUserPassword(
                    resetUser
                );
                res.json({
                    result: savedResetUser,
                    msg: "Your password has been reset successfully",
                    status: true,
                });
            }
        } catch (error) {
            /* JWT error condtions */
            if (error.message === "jwt expired" || "invalid signature") {
                next({
                    status: 401,
                    msg: `Your reset token has expired or is invalid, please check and try again later`,
                });
            } else {
                next({
                    status: 401,
                    msg: `Cannot reset the password`,
                });
            }
        }
    };

    getUserDetails = async (req, res, next) => {
        try {
            /* Fetching the user details from the token payload id */
            const userDetails = await userSer.getUserById(req.tokenUser._id);
            res.json({
                result: userDetails,
                msg: "The user details",
            });
        } catch (error) {
            next({ status: 401, msg: error });
        }
    };

    updateUserPassword = async (req, res, next) => {
        try {
            /* Fetching the user details from the token payload id */
            const user = await userSer.getUserByIdForUpdate(req.tokenUser._id);
            /* Comparing and then decrypting the password */
            const decryptedPass = await decryptPass(
                req.body.oldPassword,
                user.password
            );
            if (!decryptedPass) {
                next({ status: 401, msg: "Old password doesn't match" });
            }
            if (req.body.newPassword !== req.body.confirmPassword) {
                next({
                    status: 401,
                    msg: "The new and confirm password doesn't match",
                });
            } else {
                /* Encrypting the password */
                const bcryptResetUser = await encryptPass(req.body.newPassword);
                user.password = bcryptResetUser;
                /* Saving the user */
                await userSer.saveUser(user);
                res.json({
                    msg: "Your have successfully updated your password",
                    status: true,
                });
            }
        } catch (error) {
            next({ status: 401, msg: "Cannot update the password" });
        }
    };

    updateUserProfile = async (req, res, next) => {
        try {
            /* Object values ought to be updated */
            const newUser = {
                name: req.body.name,
                email: req.body.email,
            };
            if (newUser.name === undefined || newUser.email === undefined) {
                throw error;
            }
            /* Updating the values in DB */
            const updateDetails = await userSer.updateProfile(
                req.tokenUser._id,
                newUser
            );
            res.json({
                result: updateDetails,
                msg: "Profile updated successfully",
            });
        } catch (error) {
            /* Duplicate key value error */
            if ((error.code = 11000)) {
                next({
                    status: 401,
                    msg: `Duplicate ${Object.keys(error.keyValue)} Entered`,
                });
            } else {
                next({
                    status: 401,
                    msg: `Cannot update the profile, ${error.message}`,
                });
            }
        }
    };

    getAllUsersDetails = async (req, res, next) => {
        try {
            /* Fetching all the available users */
            const allUsers = await userSer.getAllUsers();
            res.json({
                result: allUsers,
                msg: "All available users",
            });
        } catch (error) {
            next({ status: 401, msg: "Cannot fetch the list of the users" });
        }
    };

    getUserDetailsById = async (req, res, next) => {
        try {
            /* Fetching particular user by id */
            const userById = await userSer.getUserById(req.params.id);
            if (!userById) {
                next({ status: 404, msg: "User not found" });
            } else {
                res.json({
                    result: userById,
                    msg: "Details of requested user",
                });
            }
        } catch (error) {
            next({
                status: 401,
                msg: `Cannot fetch the details with the requested user ${error.path}`,
            });
        }
    };

    roleUpdate = async (req, res, next) => {
        try {
            /* Object value that is ought to be updated */
            const role = req.body.role
            /* Updating the role */
            const userRole = await userSer.getRoleAndUpdate(
                req.params.id,
                role
            );
            res.json({
                result: userRole,
                status: true,
                msg: `Role updated as ${req.body.role}`,
            });
        } catch (error) {
            next({ status: 401, msg: "Only admins can update the role" });
        }
    };

    deleteUser = async (req,res, next) => {
        try {
            /* Deleting the user by id */
            const userDetails = await userSer.deleteUserDetails(req.params.id)
            if(!userDetails){
                next({status: 404, msg: "User doesn't exist"})
            }
            else { 
                res.json({
                    status: true,
                    msg : "User deleted successfully"
                })
            }
        } catch (error) {
            next({stauts: 401, msg: "Cannot delete the user"})
        }
    }
}

let userCon = new UserController();
export default userCon;

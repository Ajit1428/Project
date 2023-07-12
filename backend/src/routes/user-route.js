/* Routes for the user */
import express from "express"
import userCon from "../controllers/user-controller.js"
import { pageNotFound } from "../middlewares/PageNotFound-middleware.js"
import { tokenAuth } from "../middlewares/accessToken-middleware.js"
import { isAdmin } from "../middlewares/rbac-middleware.js"

const router = express.Router()

router
    .post("/register", userCon.register)
    .post("/login", userCon.login)
    .get("/logout", userCon.logout)
    .post("/password/forget", userCon.forgetPassword)
    .post("/password/reset/:token", userCon.resetPassword)
    .get("/me", tokenAuth, userCon.getUserDetails)
    .patch("/password/update", tokenAuth, userCon.updateUserPassword)
    .patch("/me/update", tokenAuth, userCon.updateUserProfile)
    .get("/admin/all/users", tokenAuth, isAdmin, userCon.getAllUsersDetails)
    .get("/admin/all/:id", tokenAuth, isAdmin, userCon.getUserDetailsById)
    .patch("/admin/role/:id", tokenAuth, isAdmin, userCon.roleUpdate)
    .delete("/admin/all/:id", tokenAuth, isAdmin, userCon.deleteUser)
    .all("*", pageNotFound)

export {router as userRoutes}
/* Routes for the orders */
import express from "express";
import orderCon from "../controllers/order-controller.js";
import { tokenAuth } from "../middlewares/accessToken-middleware.js";
import { isAdmin } from "../middlewares/rbac-middleware.js";
import { pageNotFound } from "../middlewares/PageNotFound-middleware.js";

const router = express.Router();

router
    .post("/new", tokenAuth, orderCon.createOrder)
    .get("/new/admin/:id", tokenAuth, orderCon.fetchOrder)
    .get("/myOrders", tokenAuth, orderCon.userOrders)
    .get("/lists/admin", tokenAuth, isAdmin, orderCon.adminOrders)
    .patch("/lists/admin/update/:id", tokenAuth, isAdmin, orderCon.updateOrder)
    .delete("/lists/admin/delete/:id", tokenAuth, isAdmin, orderCon.deletOrder)
    .all("*", pageNotFound);

export { router as orderRoutes };

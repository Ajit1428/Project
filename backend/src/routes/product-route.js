/* Routes for the products */
import express from "express";
import productCon from "../controllers/product-controller.js";
import { pageNotFound } from "../middlewares/PageNotFound-middleware.js";
import { tokenAuth } from "../middlewares/accessToken-middleware.js";
import { isAdmin } from "../middlewares/rbac-middleware.js";

const router = express.Router();

router
    .post("/admin/new", tokenAuth, isAdmin, productCon.create)
    .get("/lists", productCon.getProducts)
    .get("/lists/:id", productCon.getProductId)
    .patch("/lists/admin/update/:id", tokenAuth, isAdmin, productCon.update)
    .delete("/lists/admin/delete/:id", tokenAuth,isAdmin, productCon.delete)
    .patch("/lists/reviews", tokenAuth, productCon.createReview)
    .get("/lists/all/admin/reviews", tokenAuth, isAdmin, productCon.allReviews)
    .delete("/lists/all/reviews/delete", tokenAuth, productCon.deleteReviews)
    .all("*", pageNotFound);
export { router as productRoutes };

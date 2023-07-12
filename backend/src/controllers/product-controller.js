import productSer from "../services/product-service.js";

class ProductController {
    create = async (req, res, next) => {
        try {
            /* Get id through user model */
            req.body.user = req.tokenUser._id;

            /*Create Product */
            let data = req.body;
            let result = await productSer.createProduct(data);

            res.json({
                result: result,
                msg: "Product created successfully",
                status: true,
                meta: null,
            });
        } catch (error) {
            console.log(`Product Create: ${error.message}`);
            next({
                status: 400,
                msg: `Unable to create the product: ${error.message}`,
            });
        }
    };

    getProducts = async (req, res, next) => {
        try {
            /* Fetching keyword through json query */
            let query = req.query;

            /* Get total no of documents */
            let noOfDoc = await productSer.countDocuments();

            /* Filter, search, pagination usage to get all products */
            let result = await productSer.getAllProducts(query);

            /* Fetch the current page*/
            let currenPage = Number(req.query.page) || 1;
            res.json({
                result: result,
                msg: "List of all the products",
                status: true,
                noOfProducts: noOfDoc,
                currentPage: currenPage,
            });
        } catch (error) {
            console.log(`Fetching products: ${error.message}`);
            next({
                status: 400,
                msg: `Unable to fetch the products: ${error.message}`,
            });
        }
    };

    getProductId = async (req, res, next) => {
        try {
            /* Fetch product by id */
            let result = await productSer.getProductById(req.params.id);

            res.json({
                result: result,
                msg: "The fetched product",
                status: true,
                meta: null,
            });
        } catch (error) {
            console.log(`Fetching product by id: ${error.message}`);
            next({
                status: 400,
                msg: `Unable to fetch the product by id: ${error.message}`,
            });
        }
    };

    update = async (req, res, next) => {
        try {
            /* Updating the product details using the id */
            let data = req.body;
            let result = await productSer.updateProductById(
                req.params.id,
                data
            );

            res.json({
                result: result,
                msg: "Product updated successfully",
                status: true,
                meta: null,
            });
        } catch (error) {
            console.log(`Update Product: ${error.message}`);
            next({
                status: 400,
                msg: `Unable to update the product: ${error.message}`,
            });
        }
    };

    delete = async (req, res, next) => {
        try {
            /* Delete product using the id */
            let result = await productSer.deleteProductById(req.params.id);

            if (!result) {
                next({ status: 404, msg: "Product not found" });
            } else {
                res.json({
                    result: result,
                    msg: "Deleted successfully",
                    status: true,
                    meta: null,
                });
            }
        } catch (error) {
            console.log(`Delete Product: ${error.message}`);
            next({
                status: 400,
                msg: `Unable to delete the product: ${error.message}`,
            });
        }
    };

    createReview = async (req, res, next) => {
        try {
            /* Destructuring the required data */
            const { rating, comment, productId } = req.body;
            /* Storing the data in their individual key */
            const review = {
                user: req.tokenUser._id,
                name: req.tokenUser.name,
                rating: Number(rating),
                comment,
            };
            /* Fetching the product by ID */
            const product = await productSer.getProductById(productId);
            /* using the find prototype to get the exact match */
            const isReviewed = product.reviews.find(
                (rev) => rev.user.toString() === req.tokenUser._id.toString()
            );
            if (isReviewed) {
                product.reviews.forEach((rev) => {
                    if (rev.user.toString() === req.tokenUser._id.toString()) {
                        (rev.rating = rating), (rev.comment = comment);
                    }
                });
            } else {
                /* Inserting the review in the array */
                product.reviews.push(review);
                product.numOfReviews = product.reviews.length;
            }
            /* Finding the average ratings */
            let avg = 0;
            product.reviews.forEach((rev) => {
                avg += rev.rating;
            });
            product.ratings = avg / product.reviews.length;
            /* Final result */
            const final = await productSer.createReviewsandUpdate(
                productId,
                product
            );
            res.json({
                result: final,
                msg: "Reviews",
            });
        } catch (error) {
            console.log(error);
            next({
                status: 401,
                msg: "Cannot create or update the review for the product",
            });
        }
    };

    allReviews = async (req, res, next) => {
        try {
            /* Fetching the product by id */
            const product = await productSer.getProductById(req.query.id);
            if (!product) {
                next({ status: 404, msg: "Product not found" });
            }
            res.json({
                reviews: product.reviews,
                msg: "All the reviews",
                status: true,
            });
        } catch (error) {
            next({ status: 401, msg: "Cannot fetch the reviews" });
        }
    };

    deleteReviews = async (req, res, next) => {
        try {
            /* Fetching the product by id */
            const product = await productSer.getProductById(
                req.query.productId
            );
            if (!product) {
                next({ status: 404, msg: "Product not found" });
            }
            const reviewData = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString()
            );
            let avg = 0;
            reviewData.forEach((rev) => {
                avg += rev.rating;
            });
            const ratings = (avg / reviewData.length) ? avg / reviewData.length : 0
            console.log(ratings)
            const numOfReviews = reviewData.length;
            console.log()
            await productSer.deleteReviewsById(
                req.query.productId,
                reviewData,
                ratings,
                numOfReviews
            );
            res.json({
                msg: "Review deleted successfully",
                status: true,
            });
        } catch (error) {
            console.log(error)
            next({ status: 401, msg: "Cannot delete the reviews" });
        }
    };
}

let productCon = new ProductController();
export default productCon;

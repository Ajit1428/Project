/* Communicates between product controller and database */
import ApiFeatures from "../utils/ApiFeatures-utils.js";
import ProductModel from "../models/product-model.js";

class ProductService {
    createProduct = async (data) => {
        try {
            let response = await ProductModel(data).save();
            return response;
        } catch (error) {
            throw error;
        }
    };

    getAllProducts = async (query) => {
        try {
            let resultPerPage = 5;
            const apiFeatures = new ApiFeatures(ProductModel.find(), query)
                .search()
                .filter()
                .pagination(resultPerPage);
            let response = await apiFeatures.query;
            return response;
        } catch (error) {
            throw error;
        }
    };

    getProductById = async (id) => {
        try {
            let response = await ProductModel.findById(id);
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateProductById = async (id, data) => {
        try {
            let response = await ProductModel.findByIdAndUpdate(id, {
                $set: data,
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    deleteProductById = async (id) => {
        try {
            let response = await ProductModel.findByIdAndDelete(id);
            return response;
        } catch (error) {
            throw error;
        }
    };

    countDocuments = async () => {
        try {
            let response = await ProductModel.countDocuments();
            return response;
        } catch (error) {
            throw error;
        }
    };

    createReviewsandUpdate = async (id, data) => {
        try {
            let response = await ProductModel.findByIdAndUpdate(id, {
                $set: data,
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    deleteReviewsById = async (id, reviewData,ratings,numOfReviews) => {
        try {
            let response = await ProductModel.findByIdAndUpdate(
                id,
                {reviews: reviewData, ratings, numOfReviews},
                {new: true, runValidators: true}
            );
            console.log(response)
            return response;
        } catch (error) {
            throw error;
        }
    };

    saveProduct = async(data) => {
        try {
            let response = await ProductModel(data).save({validateBeforeSave: false})
            return response
        } catch (error) {
            throw error
        }
    }
}

let productSer = new ProductService();
export default productSer;

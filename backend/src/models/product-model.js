/* Creating the product model */
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your product name"],
        trim: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    description: {
        type: String,
        required: [true, "Please enter your product description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter your product price"],
        maxLength: [8, "Price must be less than 8 figures"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please selete the category"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter the number of stocks"],
        maxLength: [4, "Stock cannot exceed more than 4 figures"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "Users",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const ProductModel = mongoose.model("Products", ProductSchema);
export default ProductModel;

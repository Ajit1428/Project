/* Creating user model */
import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your full name"],
        maxLength: [30, "Name cannot be more than of 30 characters"],
        minLength: [4, "Name cannot be less than of 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email address"],
        unique: true,
        validate: [validator.isEmail,"Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength : [8, "Password cannot be less than 8 characters"],
        select : false
    },
    avatar : {
        public_id : {
            type : String,
            required : true
        },
        url : {
            type : String,
            required : true
        }
    },
    role : {
        type : String,
        default : "user"
    },

});

let UserModel = mongoose.model("Users", UserSchema);
export default UserModel;

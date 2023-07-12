/* Communicates between user controller and database */
import UserModel from "../models/user-model.js";

class UserService {
    saveUser = async (data) => {
        try {
            let result = await UserModel(data).save();
            return result;
        } catch (error) {
            throw error;
        }
    };

    getUserByEmail = async (email) => {
        try {
            let result = await UserModel.findOne({ email }).select("+password");
            return result;
        } catch (error) {
            throw error;
        }
    };

    getUserById = async (id) => {
        try {
            let result = await UserModel.findById(id);
            return result;
        } catch (error) {
            throw error;
        }
    };

    getUserByIdForUpdate = async (id) => {
        try {
            let result = await UserModel.findById(id).select("+password");
            return result;
        } catch (error) {
            throw error;
        }
    };

    updateProfile = async (id, data) => {
        try {
            let result = await UserModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });
            return result;
        } catch (error) {
            throw error;
        }
    };

    getAllUsers = async () => {
        try {
            let result = await UserModel.find();
            return result;
        } catch (error) {
            throw error;
        }
    };

    getRoleAndUpdate = async (id, role) => {
        try {
            let result = await UserModel.findByIdAndUpdate(id, {role}, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            });
            return result;
        } catch (error) {
            throw error;
        }
    };

    deleteUserDetails = async (id) => {
        try {
            let result = await UserModel.findByIdAndDelete(id)
            return result
        } catch (error) {
            throw error
        }
    }
}

let userSer = new UserService();
export default userSer;

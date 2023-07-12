import OrderModel from "../models/order-model.js"

class OrderService {
    createNewOrder = async (data) => {
        try {
            let response = await OrderModel(data).save()
            return response
        } catch (error) {
            throw error
        }
    }

    getOrderById = async (id) => {
        try {
            let response = await OrderModel.findById(id).populate("user", "name email")
            return response
        } catch (error) {
            throw error
        }
    }

    userOrderById = async (id) => {
        try {
            let response = await OrderModel.find({user: id})
            return response
        } catch (error) {
            throw error
        }
    }

    adminOrderLists = async () => {
        try {
            let response = await OrderModel.find()
            return response
        } catch (error) {
            throw error
        }
    }


    orderLists = async (id) => {
        try {
            let response = await OrderModel.findById(id)
            return response
        } catch (error) {
            throw error
        }
    }

    updateOrder = async (data) => {
        try {
            let response = await OrderModel(data).save({validateBeforeSave: false})
            return response
        } catch (error) {
            throw error
        }
    }

    deleteOrderById = async (id) => {
        try {
            let response = await OrderModel.findByIdAndDelete(id)
            return response
        } catch (error) {
            throw error
        }
    }

}

const orderSer = new OrderService()
export default orderSer
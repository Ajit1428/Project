import orderSer from "../services/order-service.js";
import productSer from "../services/product-service.js";

class OrderController {
    createOrder = async (req, res, next) => {
        try {
            const {
                shippingInfo,
                orderItems,
                paymentInfo,
                itemPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            } = req.body;
            const data = {
                shippingInfo,
                orderItems,
                paymentInfo,
                itemPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paidAt: Date.now(),
                user: req.tokenUser._id,
            };
            let result = await orderSer.createNewOrder(data);
            res.json({
                result: result,
                status: true,
                msg: "Order placed successfully",
            });
        } catch (error) {
            next({ status: 401, msg: "Cannot place the order" });
        }
    };

    fetchOrder = async (req, res, next) => {
        try {
            let orderList = await orderSer.getOrderById(req.params.id);
            if (!orderList) {
                next({ status: 404, msg: "Order not found" });
            } else {
                res.json({
                    result: orderList,
                    msg: "The requested order",
                    status: true,
                });
            }
        } catch (error) {
            next({ status: 401, msg: "Cannot fetch the order" });
        }
    };

    userOrders = async (req, res, next) => {
        try {
            let myOrders = await orderSer.userOrderById(req.tokenUser._id);
            if (!myOrders) {
                next({ status: 404, msg: "There is no order to show" });
            }
            res.json({
                result: myOrders,
                msg: "My orders",
                status: true,
            });
        } catch (error) {
            next({ status: 401, msg: "Cannot fetch the order" });
        }
    };

    adminOrders = async (req, res, next) => {
        try {
            let order = await orderSer.adminOrderLists();
            if (!order) {
                next({ status: 404, msg: "There is no order to show" });
            }

            let totalAmount = 0;
            order.forEach((key) => (totalAmount += key.totalPrice));

            res.json({
                result: order,
                msg: "All the placed orders",
                totalAmount: totalAmount,
                status: true,
            });
        } catch (error) {
            next({ status: 401, msg: "Cannot fetch the order" });
        }
    };

    updateOrder = async (req, res, next) => {
        try {
            const order = await orderSer.orderLists(req.params.id);

            if (order.orderStatus === "Delivered") {
                next({
                    status: 400,
                    msg: "The order has been delivered already",
                });
            } else {
                order.orderItems.forEach(async (key) => {
                    await this.updateStock(key.product, key.quantity);
                });

                order.orderStatus = req.body.status;

                if (req.body.status === "Delivered") {
                    order.deliveredAt = Date.now();
                }

                await orderSer.updateOrder(order);
                res.json({
                    status: true,
                    msg: "Product updated successfully",
                    result: order,
                });
            }
        } catch (error) {
            console.log(error);
            next({ status: 401, msg: "Cannot update the order" });
        }
    };

    updateStock = async (id, quantity) => {
        try {
            const product = await productSer.getProductById(id);
            product.stock -= quantity;
            await productSer.saveProduct(product);
        } catch (error) {
            throw error;
        }
    };

    deletOrder = async (req, res, next) => {
        try {
            const deleteOd = await orderSer.deleteOrderById(req.params.id);
            if (!deleteOd) {
                next({ status: 404, msg: "Order not found" });
            }
            res.json({
                status: true,
                msg: "Order deleted successfully",
            });
        } catch (error) {
            if (error.path === "_id") {
                next({
                    status: 401,
                    msg: `Order cannot be deleted, invalid order id`,
                });
            } else {
                next({ status: 401, msg: "Cannot delete the order" });
            }
        }
    };
}

const orderCon = new OrderController();
export default orderCon;

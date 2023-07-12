import orderSer from "../services/order-service.js";
import productSer from "../services/product-service.js";

class OrderController {
    createOrder = async (req, res, next) => {
        try {
            /* Destructuring the body to get only required data */
            const {
                shippingInfo,
                orderItems,
                paymentInfo,
                itemPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            } = req.body;
            /* Storing the data in constant variable */
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
            /* Saving the data in database */
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
            /* Fetching the order by id */
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
            /* Fetching the order by logged in user id stored in the token */
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
            /* Fetching all the orders */
            let order = await orderSer.adminOrderLists();
            if (!order) {
                next({ status: 404, msg: "There is no order to show" });
            }
             /* Calculating the total amount of all the products */
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
            /* Fetching the order list by id */
            const order = await orderSer.orderLists(req.params.id);

            if (order.orderStatus === "Delivered") {
                next({
                    status: 400,
                    msg: "The order has been delivered already",
                });
            } else {
                /* Logic for the stock decrement */
                order.orderItems.forEach(async (key) => {
                    await this.updateStock(key.product, key.quantity);
                });
                /* Setting the order status */
                order.orderStatus = req.body.status;

                if (req.body.status === "Delivered") {
                    order.deliveredAt = Date.now();
                }
                /* Saving the data to the DB */
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
            /* Fetching the product by id */
            const product = await productSer.getProductById(id);
            product.stock -= quantity;
            /* Saving the product */
            await productSer.saveProduct(product);
        } catch (error) {
            throw error;
        }
    };

    deletOrder = async (req, res, next) => {
        try {
            /* Deleting the order by id */
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

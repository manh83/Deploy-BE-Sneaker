import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrdersById,
    getUserOrders,
    removeOrder,
    updateOrder
} from "../controller/order.js"
import { checkPermissionOrder } from "../middleware/checkPermissionOrder.js";

const router = express.Router();

router.get("/order/view", checkPermissionOrder,getUserOrders);
router.get("/order",getAllOrders);
// router.get("/order/:id/user",checkPermissionOrder, getOneOrderUser);
router.get("/order/:id", getOrdersById);
router.post("/order",checkPermissionOrder, createOrder);
router.delete("/order/:id", removeOrder);
router.patch("/order/:id/update", updateOrder);

export default router
import express from "express";
import { addToCart, deleteToCart, getCart, updateIncrease, updateMinus } from "../controller/cart.js";
import {checkPermissionCart} from "../middleware/checkPermissionCart.js"
const router = express.Router()

router.get("/cart",checkPermissionCart,getCart)
router.delete("/cart/:id",checkPermissionCart,deleteToCart)
router.post("/cart",checkPermissionCart,addToCart)
router.post('/cart/update-minus',checkPermissionCart, updateMinus);
router.post('/cart/update-increase',checkPermissionCart, updateIncrease);


export default router
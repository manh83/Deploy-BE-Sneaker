import express  from "express";
import { searchProduct } from "../controller/searchProduct.js";

const router = express.Router()
router.get("/search-product",searchProduct)

export default router
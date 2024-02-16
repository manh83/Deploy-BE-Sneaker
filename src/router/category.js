import express from "express";
import { create, get, getAll, remove, update,getProductsByCategory } from "../controller/category.js";

const router = express.Router();

router.get("/category", getAll);
router.get("/category/:id", get);
router.post("/category", create);
router.delete("/category/:id", remove);
router.put("/category/:id/update", update);
router.get("/category/:id/products", getProductsByCategory);


export default router
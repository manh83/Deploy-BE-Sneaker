import express from "express";
import { create, get, getAll, getProductsBysize, remove, update } from "../controller/size.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.get("/size", getAll);
router.get("/size/:id", get);
router.post("/size", create);
router.delete("/size/:id", remove);
router.patch("/size/:id", update);
router.get("/size/:id/products", getProductsBysize);

export default router
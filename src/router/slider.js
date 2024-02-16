import express from "express"
import { createSlider, getAllSlider, getOneSlider, removeSlider, updateSlider } from "../controller/slider.js";


const router = express.Router();

router.get("/slider", getAllSlider);
router.delete("/slider/:id", removeSlider);
router.post("/slider", createSlider);
router.put("/slider/:id", updateSlider);
router.patch("/slider/:id", updateSlider);
router.get("/slider/:id", getOneSlider);


export default router
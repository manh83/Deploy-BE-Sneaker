import express from "express"
import {
  getAllDiscountCodes,
  getDiscountCode,
  createDiscountCode,
  removeDiscountCode,
  updateDiscountCode,
} from "../controller/discountCode.js"

const router = express.Router()

router.get("/discount", getAllDiscountCodes)
router.get("/discount/:id", getDiscountCode)
router.post("/discount", createDiscountCode)
router.delete("/discount/:id", removeDiscountCode)
router.patch("/discount/:id", updateDiscountCode)

export default router

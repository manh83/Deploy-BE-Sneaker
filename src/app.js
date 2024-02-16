import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import userRouter from "./router/user.js"
import sizeRouter from "./router/size.js"
import colorRouter from "./router/color.js"
import categoryRouter from "./router/category.js"
import productRouter from "./router/product.js"
import uploadRouter from "./router/upload.js"
import connectDB from "../config/database.js"
import cartRouter from "./router/cart.js"
import newSletterRouter from "./router/newSletter.js"
import slideRouter from "./router/slider.js"
import blogRouter from "./router/blog.js"
import orderRouter from "./router/order.js"
import discountRouter from "./router/discountCode.js"
import statisticRouter from "./router/statistic.js"
import vnpRouter from "./router/vnp.js"
import commentRouter from "./router/comment.js"
import searchProductRouter from "./router/searchProduct.js"



dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

// kết nối database
connectDB()

app.use(cors())
app.use(express.json())
app.use("/api", userRouter)
app.use("/api", sizeRouter)
app.use("/api", colorRouter)
app.use("/api", categoryRouter)
app.use("/api", productRouter)
app.use("/api", uploadRouter)
app.use("/api", cartRouter)
app.use("/api", newSletterRouter)
app.use("/api", slideRouter)
app.use("/api", blogRouter)
app.use("/api", orderRouter)
app.use("/api", discountRouter)
app.use("/api",vnpRouter)
app.use("/api", commentRouter)
app.use("/api", statisticRouter)
app.use("/api", searchProductRouter)






app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})

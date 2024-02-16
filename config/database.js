import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const { URL_MONGODB } = process.env
const connectDB = async () => {
    try {
        await mongoose.connect(URL_MONGODB);
        console.log("Kết nối db thành công");
    } catch (error) {
        console.log("Kết nối thất bại");
    }
}

export default connectDB
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    imgUrl: [{
        type: String
    }],
    description: {
        type: String
    },
    author: {
        type: String
    }

}, { timestamps: true, versionKey: false });

export default mongoose.model("Blog", blogSchema);
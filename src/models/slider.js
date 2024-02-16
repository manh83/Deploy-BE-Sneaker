import mongoose from "mongoose"

const sliderSchema = new mongoose.Schema({
    imgSlider:{
        type:String,
        require:true,
    },
    titleSlider:{
        type:String,
        require:true,
    },
    contentSlider:{
        type:String,
        require:true,
    },
    status:Boolean
}, { timestamps: true, versionKey: false });

export default mongoose.model("Slider", sliderSchema);
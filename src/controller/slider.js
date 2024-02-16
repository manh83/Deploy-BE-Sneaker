import SliderSchema from "../models/slider.js"
import { JoiSlide } from "../schema/slider.js"

export const getAllSlider = async (req, res) => {
    try {
        const slider = await SliderSchema.find();

        if (!slider.length) {
            return res.status(400).json("Chưa có bất kì slide nào !");
        };

        return res.status(200).json({
            message: "Tất cả thông tin về Slider",
            slider
        });
    } catch (error) {
        return res.status(404).json({ mesage: "lỗi lấy tất cả slide !", error })
    }
};

export const getOneSlider = async (req, res) => {
    try {
        const slider = await SliderSchema.findOne({ _id: req.params.id });

        if (!slider) {
            return res.status(400).json("Không thấy 1 slide cần tìm !");
        };

        return res.status(200).json({
            message: "Thấy 1 Slide",
            slider
        });
    } catch (error) {
        return res.status(404).json({ mesage: "lỗi lấy 1 slide !", error })
    }
};

export const createSlider = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json("Hãy thêm thông tin slide cần tạo !");
        };

        const { error } = JoiSlide.validate(req.body, { abortEarly: false });
        if (error) {
            const err = error.details[0].message;
            return res.status(400).json({
                message: "Lỗi joi ==> ",
                err
            });
        };

        const slider = await SliderSchema.create({...req.body,status:false});

        return res.status(200).json({
            message: "Đã thêm 1 slide",
            slider
        });
    } catch (error) {
        return res.status(404).json({ mesage: "lỗi thêm 1 slide !", error })
    }
};

export const updateSlider = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json("Không tìm thấy slide cần update !");
        };

        // const { error } = JoiSlide.validate(req.body, { abortEarly: false });
        // if (error) {
        //     const err = error.details[0].message;
        //     return res.status(400).json({
        //         message: "Lỗi joi ==> ",
        //         err
        //     });
        // };

        const slider = await SliderSchema.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });

        return res.status(200).json({
            message: "Đã cập nhật xong slide",
            slider
        });
    } catch (error) {
        return res.status(404).json({ mesage: "lỗi update slide !", error })
    }
};

export const removeSlider = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json("Hãy thêm thông tin slide cần tạo !");
        };

        const slider = await SliderSchema.findByIdAndDelete({ _id: req.params.id });

        return res.status(200).json({
            message: "Đã xóa 1 slide",
            slider
        });
    } catch (error) {
        return res.status(404).json({ mesage: "lỗi xóa 1 slide !", error })
    }
};
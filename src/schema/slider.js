import joi from "joi"

export const JoiSlide=joi.object({
    imgSlider:joi.string(),
    titleSlider:joi.string(),
    contentSlider:joi.string(),
    status:joi.boolean(),
    _id:joi.any()
})
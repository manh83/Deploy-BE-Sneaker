import joi from "joi"

export const JoiOrder=joi.object({
    nameUser:joi.string().required(),
    phone:joi.string().required(),
    note:joi.string(),
    status:joi.string().required(),
    // discount:joi.string().required(),
    quantity:joi.number().required(),
    totalPrice:joi.number().required(),
    address:joi.object({
        city:joi.string().required(),
        location:joi.string().required(),
        district:joi.string().required()
    }).required(),
    userId:joi.string().required(),
    codeID:joi.string().required()
})
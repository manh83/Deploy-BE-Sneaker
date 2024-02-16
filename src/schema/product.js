import joi from "joi"

export const productSchema = joi.object({
  name: joi.string().required().messages({
    "string.empty": "Tên sản phẩm không được để trống",
    "any.required": "Trường tên sản phẩm là bắt buộc",
  }),
  imgUrl: joi.array().items(joi.string()),
  description: joi.string(),
  categoryId: joi.string().required().messages({
    "string.empty": "Danh mục không được để trống",
    "any.required": "Trường categoryId là bắt buộc",
  }),
  view: joi.number(),
  arrayColor: joi.array(),
})

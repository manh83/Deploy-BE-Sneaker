import joi from "joi"

export const signupSchema = joi.object({
  username: joi.string().min(3).max(255).required().messages({
    "string.empty": "Username không được để trống",
    "string.min": "Username tối thiểu {#limit} ký tự",
    "any.required": "Trường username là bắt buộc",
  }),
  email: joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "any.required": "Trường email là bắt buộc",
    "string.email": "Email không đúng định dạng",
  }),
  password: joi.string().min(6).required().messages({
    "string.empty": "Password không được để trống",
    "any.required": "Trường password là bắt buộc",
    "string.min": "Password tối thiểu {#limit} ký tự",
  }),
  confirmPassword: joi.string().min(6).valid(joi.ref("password")).messages({
    "any.only": "Mật khẩu không khớp nhau",
    "string.empty": "ConfirmPassword không để trống",
    "any.required": "Trường confirmPassword là bắt buộc",
    "string.min": "ConfirmPassword tối thiểu {#limit} ký tự",
  }),
  role: joi.string(),
  _id: joi.string(),
})

export const signinSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "any.required": "Trường email là bắt buộc",
    "string.email": "Email không đúng định dạng",
  }),
  password: joi.string().min(6).required().messages({
    "string.empty": "Password không được để trống",
    "any.required": "Trường password là bắt buộc",
    "string.min": "Password tối thiểu {#limit} ký tự",
  }),
})

export const userSchema = joi.object({
  username: joi.string().min(3).max(255).required().messages({
    "string.empty": "Username không được để trống",
    "string.min": "Username tối thiểu {#limit} ký tự",
    "any.required": "Trường username là bắt buộc",
  }),
  email: joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "any.required": "Trường email là bắt buộc",
    "string.email": "Email không đúng định dạng",
  }),
  password: joi.string().min(6).required().messages({
    "string.empty": "Password không được để trống",
    "any.required": "Trường password là bắt buộc",
    "string.min": "Password tối thiểu {#limit} ký tự",
  }),
  role: joi.string(),
  phone: joi.string(),
  address: joi.string(),
  gender: joi.string(),
  imgUrl: joi.string(),
  discountUsed: joi.array(),
  _id: joi.string(),
})

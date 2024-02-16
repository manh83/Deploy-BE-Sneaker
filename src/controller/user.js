import bcrypt from "bcryptjs"
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { signupSchema, signinSchema, userSchema } from "../schema/user.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const { EMAIL } = process.env
const { PASSWORD_EMAIL } = process.env

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { error } = signupSchema.validate(req.body, { abortEarly: false })
    if (error) {
      const errDetails = error.details.map((err) => err.message)
      return res.status(400).json({
        message: errDetails
      })
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      imgUrl: "https://picsum.photos/300",
      role: "client"
    });
    if (!newUser) {
      return res.status(400).json({
        message: "Đăng ký không thành công",
      });
    }
    newUser.password = undefined;
    return res.status(200).json({
      message: "Đăng ký thành công",
      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// Đăng nhập
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body
    const { error } = signinSchema.validate(req.body, { abortEarly: false })
    if (error) {
      const errDetails = error.details.map((err) => err.message)
      return res.status(400).json({
        message: errDetails
      })
    }
    const checkUser = await User.findOne({ email })
    if (!checkUser) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại"
      })
    }
    const checkPass = await bcrypt.compare(password, checkUser.password)
    if (!checkPass) {
      return res.status(400).json({
        message: "Mật khẩu không chính xác"
      })
    }
    const token = jwt.sign({ _id: checkUser._id }, "sneakers", { expiresIn: 86400 })
    checkUser.password = undefined
    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken: token,
      user: checkUser
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}

// Hàm random password 
export const randomPassword = () => {
  const length = 6
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let newPass = ""
  for (let i = 0; i < length; i++) {
    const randomPass = Math.floor(Math.random() * charset.length)
    newPass += charset.charAt(randomPass)
  }
  return newPass
}

// Phương thức gửi đi
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${EMAIL}`,
    pass: `${PASSWORD_EMAIL}`
  },
  //rejectUnauthorized = false để bỏ qua thao tác SSL của gmail
  tls: {
    rejectUnauthorized: false,
  },
})



// lấy mật khẩu bằng email
const confirmationCodes = {};   // confirmationCodes lưu mã xác thực tạm thời
export const forgotPassword = async (req, res) => {

  try {
    const { email } = req.body;
    const checkUser = await User.findOne({ email })
    if (!checkUser) {
      return res.status(400).json({
        message: "Tài khoản của bạn không tồn tại"
      })
    }

    // tạo mã xác thực gồm 6 số ngẫu nhiên
    const verificationCodes = Math.floor(100000 + Math.random() * 900000);

    // thực hiện gửi email
    try {
      await transporter.sendMail({
        from: 'traidepvietnam2000@gmail.com',
        to: `${email}`,
        subject: 'Mã xác thực',
        text: `Mã xác nhận của bạn là: ${verificationCodes}`,
      });


      const timestamp = Date.now(); // tạo thời gian thực cho mã xác thực tính từ khi tạo thành công
      confirmationCodes[email] = { code: verificationCodes, timestamp };
      return res.status(201).json({
        message: "Bạn vui lòng kiểm tra email để lấy mã xác thực"
      })
    } catch (error) {
      return res.status(400).json({
        message: `Lỗi khi gửi email: ${error.message}`
      })
    }

  } catch (error) {
    return res.status(500).json({
      message: error.message
    })
  }
}


// Lấy mã xác minh bằng email
export const verifyConfirmationCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const storedCode = confirmationCodes[email];
    const user = await User.findOne({ email })

    if(!user){
      return res.status(400).json({
        message: "Email không tồn tại vui lòng nhập lại email"
      })
    }

    // Chuyển đổi mã xác minh và mã đã lưu thành số để so sánh
    const numericCode = parseInt(code, 10);    // parseInt chuyển từ chuỗi sang số
    const storedNumericCode = storedCode ? parseInt(storedCode.code, 10) : null;

    if (!storedCode || storedNumericCode !== numericCode) {
      return res.status(400).json({
        message: "Mã xác nhận không hợp lệ",
      });
    }

    // Check if the code has expired (e.g., 2 minutes)
    const currentTime = Date.now();
    const codeTimestamp = storedCode.timestamp;
    const codeExpiration = 2 * 60 * 1000; // 2 minutes in milliseconds

    if (currentTime - codeTimestamp > codeExpiration) {
      return res.status(400).json({
        message: "Mã xác nhận đã hết hạn vui lòng thử lại",
      });
    }

    // Generate a new random password, hash it, and update the user's password
    const newPassword = randomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;


    // Send the new password to the user's email
    await transporter.sendMail({
      from: "traidepvietnam2000@gmail.com",
      to: `${email}`,
      subject: "Password Reset",
      text: `Mật khẩu mới của bạn là: ${newPassword}`,
    });

    delete confirmationCodes[email];
    await user.save();
    return res.status(200).json({
      message: "Bạn vui lòng kiểm tra email để nhận lại mật khẩu",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {

    const { email, password, newPassword } = req.body;
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại"
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mật khẩu hiện tại không chính xác' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}


// lấy tất cả user
export const getAllUser = async (req, res) => {
  try {
    const data = await User.find();
    if (data.length < 1) return res.status(400).json({ message: "không có user nào !" });
    return res.status(200).json({ message: "Tất cả user: ", data });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

//  lấy 1 user
export const getOneUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    if ({ data }.data == null) return res.status(400).json({ message: "không thấy user muốn tìm !" });
    return res.status(200).json({ message: "1 user:", data });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

// xóa 1 user
export const removeUser = async (req, res) => {
  try {
    const data = await User.findByIdAndDelete(req.params.id);
    if ({ data }.data == null) return res.status(400).json({ message: "không thấy user muốn xóa !" });
    return res.status(200).json({ message: "Đã xóa user:", data });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

// thêm 1 user
export const addUser = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body, { abortEarly: false })
    if (error) {
      const errDetails = error.details.map((err) => err.message)
      return res.status(400).json({
        message: errDetails
      })
    };
    let password = await bcrypt.hash(req.body.password, 10);
    const data = await User.create({
      email: req.body.email,
      username: req.body.username,
      password,
      imgUrl: "https://picsum.photos/300",
      role: req.body.role,
    });
    return res.status(200).json({ message: "Đã thêm 1 user:", data });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

// cập nhật 1 user
export const updateUser = async (req, res) => {
  try {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errDetails = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errDetails,
      });
    }

    // Lấy dữ liệu người dùng hiện tại từ cơ sở dữ liệu
    const currentUser = await User.findById(req.params.id);

    // Kiểm tra từng trường và chỉ cập nhật nếu giá trị đã thay đổi
    Object.keys(req.body).forEach((key) => {
      if (currentUser[key] !== req.body[key]) {
        // Nếu là trường password và có thay đổi, thì mã hóa mới
        if (key === 'password') {
          req.body[key] = bcrypt.hashSync(req.body[key], 10);
        }
        // Cập nhật giá trị mới
        currentUser[key] = req.body[key];
      }
    });

    // Lưu trạng thái mới của người dùng
    const updatedUser = await currentUser.save();

    return res.status(200).json({ message: "Đã updated user:", data: updatedUser });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
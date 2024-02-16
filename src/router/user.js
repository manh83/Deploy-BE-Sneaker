import express  from "express";
import {changePassword, forgotPassword, updateUser, removeUser, addUser, getAllUser, getOneUser, signin, signup, verifyConfirmationCode} from "../controller/user.js"
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verification-codes", verifyConfirmationCode); // api lấy mã xác thực để lấy mật khẩu
router.post("/forgot-password", forgotPassword); // api lấy lại mật khẩu
router.post("/change-password", changePassword); 
// quản lí account
router.get("/allUser",getAllUser);
router.get("/oneUser/:id",getOneUser);
router.delete("/removeUser/:id",removeUser);
router.post("/addUser",addUser);
router.patch("/updateUser/:id",updateUser);



export default router
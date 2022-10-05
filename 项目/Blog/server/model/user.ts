import mongoose from "mongoose";

/* 定义user模型结构 */
const userSchema = new mongoose.Schema({
  // 昵称
  nickname: {
    type: String,
    require: true,
    maxLength: 20,
  },
  // 电话号码
  phoneNumber: {
    type: String,
    require: true,
    unique: true,
    maxLength: 11,
    minLength: 11,
  },
  // 密码
  password: {
    type: String,
    require: true,
    minLength: 6,
    select: false,
  },
  // 头像地址
  avatarUrl: {
    type: String,
  },
  // 性别
  gender: {
    type: String,
    enum: ["male", "female", "unknown"],
    default: "unknown",
  },
  // 自我介绍
  introduction: {
    type: String,
  },
  // 隐藏__v版本信息
  __v: {
    type: Number,
    select: false,
  },
});

/* 创建user模型 */
export default mongoose.model("User", userSchema);

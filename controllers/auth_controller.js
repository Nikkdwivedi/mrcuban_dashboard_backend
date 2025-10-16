import { User } from "../models/user.js";
import { ForgetmailHTML, WelcomeHTMLWithOTP } from "../templates/templates.js";
import { ErrorMsg } from "../utils/Error.js";
import JWT from "jsonwebtoken";
import { senBrevoMail } from "../utils/SendMails.js";
import { OTP_Generator } from "../utils/util.js";
import { CustomerOrder } from "../models/order.js";

export const User_Register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existuser = await User.findOne({
      $or: [{ phone: phone }, { email: email.toLowerCase() }],
    });

    if (existuser) {
      const checkOrder = await CustomerOrder.find(
        { customerId: existuser?._id },
        "_id"
      );
      if (checkOrder?.length === 0) {
        await User?.findOneAndDelete({ email: email.toLowerCase() });

        return res
          .status(400)
          .json({ msg: "User already exist please retry after 2 min" });
      } else {
        return res.status(400).json({ msg: "User already exist" });
      }
    }

    // OTP Generate
    const otp = await OTP_Generator();

   const otpv = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // User Register
    const data = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      accountOtp: String(otp),
      otp: otpv,
      otpExpiary: expiry,
    });

    // User Mail send

    const subject = "Welcome to MR Cuban! Your Journey Starts Here 🚗";
    const message = WelcomeHTMLWithOTP(otpv);

    await senBrevoMail(data?.email, subject, message);

    res
      .status(201)
      .json({ msg: "OTP Send to your register mail address", data: data });
  } catch (error) {
    ErrorMsg(res, error);
  }
};

export const Verify_Account = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      $and: [{ email: email.toLowerCase() }],
    });

    if (!user) return res.status(400).json({ msg: "Account Not Exist" });
    if (user?.otp === null) {
      return res.status(400).jaon({ msg: "OTP is Expired or Reset" });
    }

    const currentDateTime = new Date();
    if (currentDateTime > user?.otpExpiary) {
      await User.findByIdAndUpdate(
        { _id: user?._id },
        { otp: null, otpExpiary: null }
      );
      return res.status(400).json({ msg: "OTP is Expired!" });
    }

    if (String(otp) !== user?.otp)
      return res.status(400).json({ msg: "OTP is Invalid!" });

    const data = await User.findByIdAndUpdate(
      { _id: user?._id },
      { otp: null, otpExpiary: null, verify: true }
    );
    // token generate
    const token = JWT.sign(
      { id: data?._id, email: data?.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({ msg: "Registration Successfully", data, token });
  } catch (error) {
    console.log(error);
    Error(res, error);
  }
};

export const User_Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existuser = await User.findOne({
      $and: [
        {
          email: email.toLowerCase(),
        },
        { verify: true },
      ],
    });

    if (!existuser) return res.status(400).json({ msg: "Invalid Credintials" });

    const checkPassword = existuser.password === password;

    if (!checkPassword)
      return res.status(400).json({ msg: "Invalid Credintials" });

    const token = JWT.sign(
      { id: existuser?._id, email: existuser?.email },
      process.env.JWT_SECRET,
      { expiresIn: "180d" }
    );

    res
      .status(200)
      .json({ msg: "User Login Successfully", data: existuser, token });
  } catch (error) {
    ErrorMsg(res, error);
  }
};

export const LoadUser = async (req, res) => {
  try {
    const data = await User.findOne({ _id: req.id });

    return res.status(200).json({ msg: "User Fetch", data });
  } catch (error) {
    ErrorMsg(res, error);
  }
};

export const User_Update = async (req, res) => {
  try {
    const { name, password, phone, id } = req.body;

    const data = await User.findOneAndUpdate(
      { _id: id },
      { name, password, phone },
      { new: true }
    );
    res.status(201).json({ msg: "User Update Successfully", data: data });
  } catch (error) {
    ErrorMsg(res, error);
  }
};

export const Forget_Password_for_user = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "User does not exist!" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    const data = await User.findByIdAndUpdate(
      { _id: user?._id },
      { otp: otp, otpExpiary: expiry }
    );

    const subject = "Password Reset - Mr Cuban";
    const message = ForgetmailHTML(otp);

    await senBrevoMail(user?.email, subject, message);
    res.status(200).json({ msg: "OTP Send Successfully", data: [] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const Verify_Password_for_user = async (req, res) => {
  try {
    const { email, password, otp } = req.query;

    const user = await User.findOne({
      $and: [{ email: email.toLowerCase() }],
    });

    if (!user) return res.status(400).json({ msg: "Account Not Exist" });
    if (user?.otp === null) {
      return res.status(400).jaon({ msg: "OTP is Expired or Reset" });
    }

    const currentDateTime = new Date();
    if (currentDateTime > user?.otpExpiary) {
      await User.findByIdAndUpdate(
        { _id: user?._id },
        { otp: null, otpExpiary: null }
      );
      return res.status(400).json({ msg: "OTP is Expired!" });
    }

    if (String(otp) !== user?.otp)
      return res.status(400).json({ msg: "OTP is Invalid!" });

    const data = await User.findByIdAndUpdate(
      { _id: user?._id },
      { password: password, otp: null, otpExpiary: null }
    );

    res.status(200).json({ msg: "Your Password Change Successfully", data });
  } catch (error) {
    console.log(error);
    Error(res, error);
  }
};

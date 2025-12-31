import {
  ActivationHTML,
  ForgetDrivermailHTML,
  WelcomeDriverHTML,
} from "../templates/templates.js";
import { ErrorMsg } from "../utils/Error.js";
import JWT from "jsonwebtoken";
import { senBrevoMail, sendMails } from "../utils/SendMails.js";
import { Driver } from "../models/driver.js";

import cloudinary from "cloudinary";
import { DriverOrder } from "../models/driverOrder.js";

export const Driver_Register = async (req, res) => {
  try {
    const { name, email, password, phone, dl } = req.body;

    const existuser = await Driver.findOne({
      $or: [{ phone: phone }, { email: email.toLowerCase() }],
    });

    if (existuser)
      return res.status(400).json({ msg: "Driver already exist!" });

    // Driver Register
    const data = await Driver.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      dl: dl,
    });

    // User Mail send

    const subject =
      "Welcome to MRCUBAN Partner APP – Your Account is Under Verification";
    const message = WelcomeDriverHTML();

    await sendMails(data?.email, subject, message);

    res.status(201).json({ msg: "Driver Register Successfully", data: data });
  } catch (error) {
    ErrorMsg(res, error);
  }
};

export const AccountVerify = async (req, res) => {
  try {
    const { id } = req.query;

    const data = await Driver.findByIdAndUpdate({ _id: id }, { verify: true });

    // User Mail send

    const subject =
      "Congratulations! Your MR Cuban Partners Account is Now Activated";
    const message = ActivationHTML(data?.email, data?.password);

    await sendMails(data?.email, subject, message);

    return res.status(200).json({ msg: "Account Activate Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const UploadDocs = async (req, res) => {
  try {
    const { id } = req.body;
    const { adhar, pan, dl, pic } = req.files;

    const uploadToCloudinary = (file) => {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              resource_type: "image",
              public_id: `backup_${Date.now()}`,
            },
            (error, result) => {
              if (error) {
                console.error(error);
                reject(error);
              } else {
                resolve({
                  public_id: result.public_id,
                  url: result.url,
                });
              }
            }
          )
          .end(file); // Ensure to use file.data for upload_stream
      });
    };
    let docs = [];
    if (adhar) {
      const data = await uploadToCloudinary(adhar?.data);
      docs.push({
        adhar_card: { public_id: data?.public_id, url: data?.secure - url },
      });
    } else {
      return res.status(400).json({ msg: "Adhar Card upload Failed" });
    }

    if (pan) {
      const data = await uploadToCloudinary(pan?.data);
      docs.push({
        pan_card: { public_id: data?.public_id, url: data?.secure - url },
      });
    } else {
      return res.status(400).json({ msg: "Pan Card upload Failed" });
    }

    if (dl) {
      const data = await uploadToCloudinary(dl?.data);
      docs.push({
        driving_license: {
          public_id: data?.public_id,
          url: data?.secure - url,
        },
      });
    } else {
      return res.status(400).json({ msg: "Driving License upload Failed" });
    }

    if (pic) {
      const data = await uploadToCloudinary(pic?.data);
      docs.push({
        pic: { public_id: data?.public_id, url: data?.secure - url },
      });
    } else {
      return res.status(400).json({ msg: "Profile Photo upload Failed" });
    }

    const data = await Driver.findByIdAndUpdate({ _id: id }, { doc: docs });
    return res.status(200).json({ msg: "Documents Upload Successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const Driver_Login = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ msg: "Email or phone is required" });
    }

    const query = {};

    if (email) {
      query.email = email.toLowerCase();
    } else if (phone) {
      query.phone = phone;
    }

    const existuser = await Driver.findOne(query);

    if (!existuser) return res.status(400).json({ msg: "Invalid Credintials" });

    const checkPassword = existuser.password === password;

    if (!checkPassword)
      return res.status(400).json({ msg: "Invalid Credintials" });

    if (existuser.verify === false) {
      return res.status(400).json({ msg: "Your Acoount under verification." });
    }

    const token = JWT.sign(
      { id: existuser?._id, email: existuser?.email },
      process.env.JWT_SECRET,
      { expiresIn: "180d" } 
    );

    res
      .status(200)
      .json({ msg: "Driver Login Successfully", data: existuser, token });
  } catch (error) {
    ErrorMsg(res, error);
  }
};

export const LoadUser = async (req, res) => {
  try {
    const data = await Driver.findOne({ _id: req.id });
    // Get the start and end of the current month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    // Find orders within the current month
    const orders = await DriverOrder.find(
      {
        driverId: req.id,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
      "price"
    );

    // Calculate the total amount using reduce
    const totalAmount = orders.reduce(
      (sum, order) => sum + Number(order.price),
      0
    );

    return res
      .status(200)
      .json({ msg: "Driver Fetch", data, total: totalAmount });
  } catch (error) {
    ErrorMsg(res, error);
  }
};

export const User_Update = async (req, res) => {
  try {
    const { name, password, phone, id } = req.body;

    const data = await Driver.findOneAndUpdate(
      { _id: id },
      { name, password, phone },
      { new: true }
    );
    res.status(200).json({ msg: "Driver Update Successfully", data: data });
  } catch (error) {
    ErrorMsg(res, error);
  }
};

export const Forget_Password_for_user = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await Driver.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: "Driver does not exist!" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    const data = await Driver.findByIdAndUpdate(
      { _id: user?._id },
      { otp: otp, otpExpiary: expiry }
    );

    const subject = "Password Reset - Mr Cuban Partners";
    const message = ForgetDrivermailHTML(otp);

    await senBrevoMail(user?.email, subject, message);
    res.status(200).json({ msg: "OTP Send Successfully", data: data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const Verify_Password_for_user = async (req, res) => {
  try {
    const { email, password, otp } = req.query;

    const user = await Driver.findOne({
      $and: [{ email: email.toLowerCase() }],
    });

    if (!user) return res.status(400).json({ msg: "Account Not Exist" });
    if (user?.otp === null) {
      return res.status(400).jaon({ msg: "OTP is Expired or Reset" });
    }

    const currentDateTime = new Date();
    if (currentDateTime > user?.otpExpiary) {
      await Driver.findByIdAndUpdate(
        { _id: user?._id },
        { otp: null, otpExpiary: null }
      );
      return res.status(400).json({ msg: "OTP is Expired!" });
    }

    if (String(otp) !== user?.otp)
      return res.status(400).json({ msg: "OTP is Invalid!" });

    const data = await Driver.findByIdAndUpdate(
      { _id: user?._id },
      { password: password, otp: null, otpExpiary: null }
    );

    res.status(200).json({ msg: "Your Password Change Successfully", data });
  } catch (error) {
    console.log(error);
    Error(res, error);
  }
};

import { Driver } from "../models/driver.js";
import { User } from "../models/user.js";
import { DriverOrder } from "../models/driverOrder.js";
import { CustomerOrder } from "../models/order.js";
import { ActivationHTML } from "../templates/templates.js";
import { sendMails } from "../utils/SendMails.js";

export const FetchDrivers = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;

    const skip = (pageNo - 1) * pageSize;

    const total = await Driver.countDocuments();
    const data = await Driver.find({})
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: 1 });

    return res.status(200).json({ msg: "success", data, total });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const FetchUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;

    const skip = (pageNo - 1) * pageSize;

    const total = await User.countDocuments();
    const data = await User.find({})
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: 1 });

    return res.status(200).json({ msg: "success", data, total });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const AccountVerify = async (req, res) => {
  try {
    const { id } = req.query;

    const check = await Driver.find({ _id: id }, "verify");

    const data = await Driver.findByIdAndUpdate(
      { _id: id },
      { verify: check[0]?.verify === true ? false : true }
    );

    // User Mail send
    if (check[0]?.verify === false) {
      const subject =
        "Congratulations! Your MR Cuban Partners Account is Now Activated";
      const message = ActivationHTML(data?.email, data?.password);

      await sendMails(data?.email, subject, message);
    }

    return res
      .status(200)
      .json({ msg: "Account Activate Successfully", data: [] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const LoginAPI = async (req, res) => {
  try {
    const { email, password } = req.query;

    if (email === "mrcuban@gmail.com" && password === "zxc123cuban") {
      return res.status(200).json({
        msg: "Login sucess",
        data: [
          {
            email: "mrcuban@gmail.com",
            token:
              "zxcvbnmcuban345cubanjhjfshdfjhdsf77243zssssssxzdfdf24r234q213423x2qwAWEXRXTGEXRGTERTE",
          },
        ],
      });
    } else {
      return res.status(400).json({ msg: "Invalid Credintials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const FetchDriverOrders = async (req, res) => {
  try {
    const { page, limit, id } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;

    const skip = (pageNo - 1) * pageSize;

    const total = await DriverOrder.countDocuments({ driverId: id });
    const data = await DriverOrder.find({ driverId: id })
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: 1 }).lean(true);
    let newData = [];
    for (let i = 0; i < data?.length; i++) {
      const customer = await User.findOne(
        { _id: data[i]?.customerId },
        "name email phone"
      );
      newData.push({ ...data[i], customerDetails: customer });
    }

    return res.status(200).json({ msg: "success", data: newData, total });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const FetchUserOrders = async (req, res) => {
  try {
    const { page, limit, id } = req.query;

    const pageNo = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 20;

    const skip = (pageNo - 1) * pageSize;

    const total = await CustomerOrder.countDocuments({ customerId: id });
    const data = await CustomerOrder.find({ customerId: id })
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: 1 });

    return res.status(200).json({ msg: "success", data, total });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

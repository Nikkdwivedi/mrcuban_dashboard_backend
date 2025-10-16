import { Driver } from "../models/driver.js";
import { DriverOrder } from "../models/driverOrder.js";
import { Lead } from "../models/lead.js";
import { Notification } from "../models/notification.js";
import { CustomerOrder } from "../models/order.js";
import { Rating } from "../models/rating.js";
import { Rides } from "../models/rides.js";
import { User } from "../models/user.js";
import { Vichele } from "../models/vichele.js";


export const countdocs = async (req, res) => {
  try {
    const { id } = req.query;
    if (id !== "syrex") {
      return res.status(400).json({ msg: "Unauthenticarted User" });
    }
    const user = await User.countDocuments();
    const vichele = await Vichele.countDocuments();
    const rides = await Rides.countDocuments();
    const rating = await Rating.countDocuments();
    const order = await CustomerOrder.countDocuments();
    const notification = await Notification.countDocuments();
    const leads = await Lead.countDocuments();
    const driverOrders = await DriverOrder.countDocuments();
    const drivers = await Driver.countDocuments();

    const data = [
      {
        name: "Customers",
        count: user,
      },
      {
        name: "Transport",
        count: vichele,
      },
      {
        name: "Rides",
        count: rides,
      },
      {
        name: "Customer Feedbacks",
        count: rating,
      },
      {
        name: "Customer Orders",
        count: order,
      },
      {
        name: "Notifications",
        count: notification,
      },
      {
        name: "Leads",
        count: leads,
      },
      {
        name: "Driver Orders",
        count: driverOrders,
      },
      {
        name: "Drivers",
        count: drivers,
      },
    ];

    res.status(201).json({ msg: "data fetch successfully", data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};


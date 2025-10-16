import { DriverOrder } from "../models/driverOrder.js";
import { Lead } from "../models/lead.js";
import { CustomerOrder } from "../models/order.js";
import { Driver } from "../models/driver.js";
import { Notification } from "../models/notification.js";
import { User } from "../models/user.js";
import { SendSingularNotification } from "./token_controller.js";
import { sendDevMail } from "../utils/SendMails.js";
import { CreateOrderDevTemplate } from "../templates/templates.js";

export const CreateLead = async (req, res) => {
  try {
    const {
      pickup,
      drop,
      type,
      returnPickup,
      returnDrop,
      pickdate,
      dropdate,
      id,
      otp,
      seat,
      km,
    } = req.body;

    const pickupdate = new Date(pickdate).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const returnDate =
      dropdate !== ""
        ? new Date(dropdate).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })
        : "";

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    await Lead.deleteMany({
      status: "pending",
      createdAt: { $lt: thirtyMinutesAgo },
    });

    const extractKm = extractNumber(km);

    const data = await Lead.create({
      pickup_address: pickup,
      drop_address: drop,
      pickup_date: pickupdate,
      return_pickup_address: returnPickup || "",
      return_drop_address: returnDrop || "",
      return_date: returnDate,
      customer_id: id,
      otp: otp,
      status: "pending",
      trip_type: type,
      seater: seat,
      distance: extractKm,
    });

    const customerDetails = await User.findById(
      { _id: id },
      "name email phone"
    );

    await sendDevMail(
      "mrcubandev@gmail.com",
      "Order Create",
      CreateOrderDevTemplate(
        pickup,
        drop,
        pickdate,
        id,
        type,
        seat,
        extractKm,
        customerDetails?.name,
        customerDetails?.email,
        customerDetails?.phone
      )
    );
    return res.status(200).json({ msg: "Lead Generate Successfully", data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

//Lead display for drivers
export const DisplayOrderLeads = async (req, res) => {
  try {
    const data = await Lead.find({ status: "pending" }).sort({ createdAt: -1 });
    return res.status(200).json({ msg: "Leads Fetch Successfully", data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

// Lead Accept by Driver

export const AcceptOrderLead = async (req, res) => {
  try {
    const { price, id, driverId, driverName, model, rating, orders, phone } =
      req.body;

    const order = await Lead.findById({ _id: id }, "drivers");

    await order.drivers.push({
      id: driverId,
      name: driverName,
      price: price,
      model: model,
      rating: rating,
      orders: orders, // orders length
      phone: phone,
    });

    const data = await Lead.findByIdAndUpdate(
      { _id: id },
      { status: "pending", drivers: order.drivers }
    );

    return res
      .status(200)
      .json({ msg: "Order Accept by driver  Successfully", data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const DisplayCustomerLead = async (req, res) => {
  try {
    const { id } = req.query;

    const data = await Lead.findOne({ customer_id: id });

    return res.status(200).json({ msg: "Lead Get Successfully", data });
  } catch (error) {
    console.log(error);
  }
};

export const DisplayRides = async (req, res) => {
  try {
    const { orderId } = req.query;
    const data = await Lead.findById({ _id: orderId }, "drivers")?.sort({
      createdAt: -1,
    });

    return res.status(200).json({ msg: "Drivers Fetch", data: data });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ msg: error });
  }
};

export const AcceptOrderLeadByCustomer = async (req, res) => {
  try {
    const { orderId, driverId, customerId, name } = req.body;
    const lead = await Lead.findOne({ _id: orderId });
    const driver = lead?.drivers?.find((f) => f?.id === driverId);

    if (!driver)
      return res.status(400).json({ msg: "Driver Not Found or Exist" });

    // Generate order for driver

    const driverOrder = await DriverOrder.create({
      customerId: customerId,
      customerName: name,
      distance1: lead?.pickup_address,
      distance2: lead?.drop_address,
      distance3: lead?.return_pickup_address,
      distance4: lead?.return_drop_address,
      date1: lead?.pickup_date,
      date2: lead?.return_date,
      price: driver?.price,
      driverId: driverId,
      status: "accept",
      paymentStatus: "pending",
      type: lead?.trip_type,
      otp: lead?.otp,
      carDetails: driver[0],
      seater: lead?.seater,
      km: lead?.distance,
    });

    // Generate order for customer

    await CustomerOrder.create({
      customerId: customerId,
      distance1: lead?.pickup_address,
      distance2: lead?.drop_address,
      distance3: lead?.return_pickup_address,
      distance4: lead?.return_drop_address,
      date1: lead?.pickup_date,
      date2: lead?.return_date,
      price: driver?.price,
      status: "accept",
      paymentStatus: "pending",
      type: lead?.trip_type,
      otp: lead?.otp,
      driver: driver,
      driverOrderId: driverOrder?._id,
      seater: lead?.seater,
      km: lead?.distance,
    });
    await Notification.create({
      title: "Ride Confirmation",
      driverId: driverId,
      message: `Your ride scheduled for ${lead?.pickup_date} has been successfully confirmed by the customer.`,
    });
    await Lead.findByIdAndDelete({ _id: orderId });
    const total = await DriverOrder.countDocuments({ _id: driverId });
    await Driver.findByIdAndUpdate({ _id: driverId }, { orders: total });

    const notice = await SendSingularNotification(
      driverId,
      "Ride Accepted by Customer",
      "The customer has successfully accepted the ride. Please proceed with the service."
    );

    return res
      .status(200)
      .json({ msg: "Order Accept by Customer Successfully", data: [] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const CancelRideByUser = async (req, res) => {
  try {
    const { id } = req.query;

    const data = await Lead.findByIdAndDelete({ _id: id });
    return res.status(200).json({ msg: "Order Delete Successfully", data: [] });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const CancelRideByUserAfterAccept = async (req, res) => {
  try {
    const { coi, doi } = req.query;

    const data = await CustomerOrder.findByIdAndUpdate(
      { _id: coi },
      { status: "cancel", paymentStatus: "unpaid" }
    );
    const data2 = await DriverOrder.findByIdAndUpdate(
      { _id: doi },
      { paymentStatus: "unpaid", status: "cancel" }
    );

    await Notification.create({
      title: "Ride Cancellation",
      driverId: data2?.driverId,
      message: `Your ride scheduled for ${data?.date1} has been cancelled by the customer.`,
    });
    const notice = await SendSingularNotification(
      data2?.driverId,
      "Ride Cancelled by Customer",
      "The customer has cancelled the ride. Please check your upcoming rides for updates."
    );

    return res.status(200).json({ msg: "Order Delete Successfully", data: [] });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const StartRide = async (req, res) => {
  try {
    const { id, otp } = req.query;

    const data = await DriverOrder.findById({ _id: id }, "otp customerId");
    const user = await User.findById({ _id: data?.customerId }, "accountOtp");

    if (user?.accountOtp !== String(otp)) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    await DriverOrder.findByIdAndUpdate({ _id: id }, { status: "start" });

    await CustomerOrder.findOneAndUpdate(
      { driverOrderId: id },
      { status: "start" }
    );

    return res.status(200).json({ msg: "Order Start Successfully", data: [] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const FinishRide = async (req, res) => {
  try {
    const { id } = req.query;

    const data = await DriverOrder.findById({ _id: id }, "status");

    await DriverOrder.findByIdAndUpdate(
      { _id: id },
      { status: "complete", paymentStatus: "complete" }
    );

    await CustomerOrder.findOneAndUpdate(
      { driverOrderId: id },
      { status: "complete", paymentStatus: "complete" }
    );

    return res.status(200).json({ msg: "Ride Finsh Successfully", data: [] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const CheckRideStatus = async (req, res) => {
  try {
    const { id } = req.query;

    const LeadOrder = await Lead.findOne({ customer_id: id }, "-otp");
    const user = await User.findOne({ _id: id }, "name email phone");

    if (LeadOrder) {
      const data = {
        customerOrder: LeadOrder,
        customer: user,
      };
      return res
        .status(200)
        .json({ msg: "Ride Status", status: "Lead", data: data });
    } else {
      const customerOrder = await CustomerOrder.findOne(
        { customerId: id },
        "-otp"
      ).sort({ updatedAt: -1 });

      const data = {
        customerOrder,
        customer: user,
      };
      if (customerOrder)
        return res
          .status(200)
          .json({ msg: "Ride Status", status: "Order", data: data });
      else return res.status(200).json({ msg: "Not exist", data: null });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ msg: error?.message || error || "Something went wrong" });
  }
};

function extractNumber(input) {
  const match = input.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

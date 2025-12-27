import { Offer } from "../models/offer.js";
import { Driver } from "../models/driver.js";
import { User } from "../models/user.js";
import { Tokens } from "../models/expo.js";
import { SendSingularNotification } from "./token_controller.js";
import { CustomerOrder } from "../models/order.js";
import { DriverOrder } from "../models/driverOrder.js";

// Create new offer (Driver)
export const createOffer = async (req, res) => {
  try {
    const {
      driverId,
      driverName,
      tripType,
      pickupTimeStart,
      pickupTimeEnd,
      pickupAddress,
      dropAddress,
      distance,
      amount,
    } = req.body;

    // Get driver details
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    // Extract pickup date from pickupTimeStart
    const pickupStartDate = new Date(pickupTimeStart);
    const pickupDate = pickupStartDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Create offer
    const offer = await Offer.create({
      driverId,
      driverName: driverName || driver.name,
      tripType,
      pickupDate,
      pickupTimeStart,
      pickupTimeEnd,
      pickupAddress,
      dropAddress,
      distance,
      amount,
      modelName: driver.model?.model || "N/A",
      modelNumber: driver.model?.modelNumber || "N/A",
      seat: driver.seat || 4,
    });

    // Send notifications to all customers (async, don't block response)
    (async () => {
      try {
        const allCustomers = await User.find({}, "_id");
        for (let customer of allCustomers) {
          await SendSingularNotification(
            customer._id,
            "New Offer Available!",
            `A driver has posted a new ${tripType} offer for ₹${amount}. Check the Offers tab!`
          );
        }
      } catch (error) {
        console.error("Error sending offer notifications:", error);
      }
    })();

    res.status(201).json({
      success: true,
      msg: "Offer created successfully",
      data: offer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get driver's offers
export const getDriverOffers = async (req, res) => {
  try {
    const { driverId, status, page = 1, limit = 10 } = req.query;

    const query = { driverId };
    if (status) {
      const statusArray = status.split(',');
      query.status = { $in: statusArray };
    }

    const offers = await Offer.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Populate additional details from driver orders for accepted offers
    const offersWithDetails = await Promise.all(
      offers.map(async (offer) => {
        const offerObj = offer.toObject();

        if (offer.driverOrderId) {
          const driverOrder = await DriverOrder.findById(offer.driverOrderId, "otp");
          if (driverOrder) {
            offerObj.otp = driverOrder.otp;
          }
        }

        return offerObj;
      })
    );

    res.status(200).json({
      success: true,
      msg: "Offers fetched successfully",
      offers: offersWithDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get all active offers for customers
export const getActiveOffers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offers = await Offer.find({ status: "active" })
      .populate("driverId", "name phone rating image model")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({
      success: true,
      msg: "Active offers fetched successfully",
      offers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Accept offer (Customer) - Creates orders for ride flow
export const acceptOffer = async (req, res) => {
  try {
    const { offerId, customerId, customerName } = req.body;

    const offer = await Offer.findById(offerId).populate("driverId");

    if (!offer) {
      return res.status(404).json({ success: false, msg: "Offer not found" });
    }

    if (offer.status !== "active") {
      return res.status(400).json({ success: false, msg: "This offer has already been accepted by another customer" });
    }

    // Get customer details
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, msg: "Customer not found" });
    }

    const driver = offer.driverId;

    // Generate OTP for ride
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Format dates from offer time range
    const pickupStartDate = new Date(offer.pickupTimeStart);
    const pickupEndDate = new Date(offer.pickupTimeEnd);
    const formattedDate1 = pickupStartDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ', ' + pickupStartDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });

    // Create Customer Order
    const customerOrder = await CustomerOrder.create({
      customerId: customer._id,
      distance1: offer.pickupAddress,
      distance2: offer.dropAddress,
      distance3: offer.tripType === "Round Trip" ? offer.dropAddress : "",
      distance4: offer.tripType === "Round Trip" ? offer.pickupAddress : "",
      date1: formattedDate1,
      date2: "",
      status: "upcoming",
      price: offer.amount.toString(),
      paymentStatus: "pending",
      type: offer.tripType,
      otp: otp,
      driver: [{
        driverId: driver._id,
        driverName: driver.name,
        model: driver.model?.model || "N/A",
        modelNumber: driver.model?.modelNumber || "N/A",
        rating: driver.rating || 0,
        orders: driver.orders || 0,
        phone: driver.phone,
        img: driver.image || "",
        price: offer.amount.toString(),
      }],
      seater: driver.seat || 4,
      km: offer.distance,
      isOffer: true,
      offerId: offer._id,
    });

    // Create Driver Order
    const driverOrder = await DriverOrder.create({
      driverId: driver._id,
      customerId: customer._id,
      customerName: customer.name,
      distance1: offer.pickupAddress,
      distance2: offer.dropAddress,
      distance3: offer.tripType === "Round Trip" ? offer.dropAddress : "",
      distance4: offer.tripType === "Round Trip" ? offer.pickupAddress : "",
      date1: formattedDate1,
      date2: "",
      status: "upcoming",
      price: offer.amount.toString(),
      paymentStatus: "pending",
      type: offer.tripType,
      otp: otp,
      carDetails: {
        model: driver.model?.model || "N/A",
        modelNumber: driver.model?.modelNumber || "N/A",
      },
      seater: driver.seat || 4,
      km: offer.distance,
      isOffer: true,
      offerId: offer._id,
    });

    // Link driver order to customer order
    customerOrder.driverOrderId = driverOrder._id.toString();
    await customerOrder.save();

    // Update offer status and store order IDs
    offer.status = "accepted";
    offer.acceptedBy = {
      customerId: customer._id,
      customerName: customer.name,
      acceptedAt: new Date(),
    };
    offer.customerOrderId = customerOrder._id;
    offer.driverOrderId = driverOrder._id;
    offer.rideStatus = "accepted"; // accepted, started, completed, cancelled
    await offer.save();

    console.log("Offer saved with IDs:", {
      offerId: offer._id,
      customerOrderId: offer.customerOrderId,
      driverOrderId: offer.driverOrderId,
      rideStatus: offer.rideStatus,
      otp: otp
    });

    // Update customer's account OTP for ride verification
    await User.findByIdAndUpdate(customer._id, { accountOtp: otp });

    // Send notification to driver
    await SendSingularNotification(
      driver._id,
      "Offer Accepted!",
      `${customer.name} has accepted your offer for ₹${offer.amount}. OTP: ${otp}`
    );

    // Send notification to customer
    await SendSingularNotification(
      customer._id,
      "Offer Confirmed!",
      `Your ride is confirmed with ${driver.name}. OTP: ${otp}`
    );

    res.status(200).json({
      success: true,
      msg: "Offer accepted successfully! Ride created.",
      data: {
        offer,
        customerOrder,
        driverOrder,
        otp,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get customer's accepted offers
export const getCustomerOffers = async (req, res) => {
  try {
    const { customerId, status, page = 1, limit = 10 } = req.query;

    const query = { "acceptedBy.customerId": customerId };
    if (status) {
      const statusArray = status.split(',');
      query.status = { $in: statusArray };
    }

    const offers = await Offer.find(query)
      .populate("driverId", "name phone rating image model")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Populate OTP and additional details from customer orders
    const offersWithDetails = await Promise.all(
      offers.map(async (offer) => {
        const offerObj = offer.toObject();

        if (offer.customerOrderId) {
          const customerOrder = await CustomerOrder.findById(offer.customerOrderId, "otp");
          if (customerOrder) {
            offerObj.otp = customerOrder.otp;
          }
        }

        console.log("Customer Offer Details:", {
          offerId: offerObj._id,
          customerOrderId: offerObj.customerOrderId,
          driverOrderId: offerObj.driverOrderId,
          rideStatus: offerObj.rideStatus,
          otp: offerObj.otp
        });

        return offerObj;
      })
    );

    res.status(200).json({
      success: true,
      msg: "Customer offers fetched successfully",
      offers: offersWithDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Update offer status
export const updateOfferStatus = async (req, res) => {
  try {
    const { offerId, status } = req.body;

    const offer = await Offer.findByIdAndUpdate(
      offerId,
      { status },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ success: false, msg: "Offer not found" });
    }

    // If offer is completed or cancelled, also update related orders
    if ((status === "completed" || status === "cancelled") && offer.acceptedBy) {
      await CustomerOrder.updateMany(
        { offerId: offer._id },
        { status: status === "completed" ? "finish" : "cancel" }
      );
      await DriverOrder.updateMany(
        { offerId: offer._id },
        { status: status === "completed" ? "finish" : "cancel" }
      );
    }

    res.status(200).json({
      success: true,
      msg: "Offer status updated",
      data: offer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Cancel offer ride (before ride starts)
export const cancelOfferRide = async (req, res) => {
  try {
    const { coi, doi } = req.query;

    const customerOrder = await CustomerOrder.findByIdAndUpdate(
      { _id: coi },
      { status: "cancel", paymentStatus: "unpaid" },
      { new: true }
    );

    const driverOrder = await DriverOrder.findByIdAndUpdate(
      { _id: doi },
      { status: "cancel", paymentStatus: "unpaid" },
      { new: true }
    );

    // Update offer status
    if (customerOrder?.offerId) {
      await Offer.findByIdAndUpdate(
        customerOrder.offerId,
        {
          status: "cancelled",
          rideStatus: "cancelled"
        }
      );
    }

    // Send notification to driver
    await SendSingularNotification(
      driverOrder?.driverId,
      "Offer Ride Cancelled",
      `The customer has cancelled the accepted offer ride scheduled for ${customerOrder?.date1}.`
    );

    return res.status(200).json({
      success: true,
      msg: "Offer ride cancelled successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

// Start offer ride (Driver with OTP validation)
export const startOfferRide = async (req, res) => {
  try {
    const { id, otp } = req.query;

    const driverOrder = await DriverOrder.findById({ _id: id }, "otp customerId offerId");
    const user = await User.findById({ _id: driverOrder?.customerId }, "accountOtp");

    if (user?.accountOtp !== String(otp)) {
      return res.status(400).json({ success: false, msg: "Invalid OTP" });
    }

    // Update driver order
    await DriverOrder.findByIdAndUpdate(
      { _id: id },
      { status: "start" }
    );

    // Update customer order
    await CustomerOrder.findOneAndUpdate(
      { driverOrderId: id },
      { status: "start" }
    );

    // Update offer ride status
    if (driverOrder?.offerId) {
      await Offer.findByIdAndUpdate(
        driverOrder.offerId,
        { rideStatus: "started" }
      );
    }

    // Send notification to customer
    await SendSingularNotification(
      driverOrder?.customerId,
      "Ride Started!",
      "Your driver has started the ride. Have a safe journey!"
    );

    return res.status(200).json({
      success: true,
      msg: "Offer ride started successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Finish offer ride (Driver)
export const finishOfferRide = async (req, res) => {
  try {
    const { id } = req.query;

    const driverOrder = await DriverOrder.findById({ _id: id }, "customerId offerId");

    // Update driver order
    await DriverOrder.findByIdAndUpdate(
      { _id: id },
      { status: "complete", paymentStatus: "complete" }
    );

    // Update customer order
    await CustomerOrder.findOneAndUpdate(
      { driverOrderId: id },
      { status: "complete", paymentStatus: "complete" }
    );

    // Update offer status
    if (driverOrder?.offerId) {
      await Offer.findByIdAndUpdate(
        driverOrder.offerId,
        {
          status: "completed",
          rideStatus: "completed"
        }
      );
    }

    // Send notification to customer
    await SendSingularNotification(
      driverOrder?.customerId,
      "Ride Completed!",
      "Your ride has been completed. Please rate your experience!"
    );

    return res.status(200).json({
      success: true,
      msg: "Offer ride completed successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

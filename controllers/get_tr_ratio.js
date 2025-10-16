import { Driver } from "../models/driver.js";
import { DriverOrder } from "../models/driverOrder.js";
import { CustomerOrder } from "../models/order.js";


export const getTRRatio = async (req, res) => {
  try {
    const driverId = req.params.id;

    // Verify driver exists
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found or invalid role",
      });
    }

    // Find all orders where the driver was assigned
    const driverOrders = await DriverOrder.find({ driverId }).sort({
      createdAt: 1,
    });

    // Get unique customers who booked their first ride with this driver
    const uniqueCustomers = new Set();
    const firstRideMap = new Map(); // Map customerId to their first order date with this driver

    for (const order of driverOrders) {
      if (!uniqueCustomers.has(order.customerId)) {
        uniqueCustomers.add(order.customerId);
        firstRideMap.set(order.customerId, order.createdAt);
      }
    }

    // Count customers who booked another ride after their first ride with this driver
    let returningCustomers = 0;
    for (const customerId of uniqueCustomers) {
      const firstRideDate = firstRideMap.get(customerId);
      // Check if the customer booked any other ride after their first ride
      const subsequentOrders = await CustomerOrder.find({
        customerId,
        createdAt: { $gt: firstRideDate },
      });
      if (subsequentOrders.length > 0) {
        returningCustomers += 1;
      }
    }

    // Calculate TR Ratio
    const totalCustomers = uniqueCustomers.size;
    const trRatio =
      totalCustomers > 0
        ? (returningCustomers / totalCustomers).toFixed(2)
        : "0.00";

    res.status(200).json({
      success: true,
      data: {
        returningCustomers,
        totalCustomers,
        trRatio,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while calculating TR Ratio",
    });
  }
};
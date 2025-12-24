import Call from "../models/call.js";
import CustomerOrder from "../models/order.js";
import DriverOrder from "../models/driverOrder.js";

// Get call history for an order
export const getCallHistory = async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }

    const calls = await Call.find({ orderId })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      calls,
      totalCalls: calls.length
    });
  } catch (error) {
    console.error("Error fetching call history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch call history",
      error: error.message
    });
  }
};

// Get all calls for a user (customer or driver)
export const getUserCalls = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({
        success: false,
        message: "User ID and User Type are required"
      });
    }

    const query = userType === 'customer'
      ? { $or: [{ callerId: userId, callerType: 'customer' }, { receiverId: userId, receiverType: 'customer' }] }
      : { $or: [{ callerId: userId, callerType: 'driver' }, { receiverId: userId, receiverType: 'driver' }] };

    const calls = await Call.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v');

    res.status(200).json({
      success: true,
      calls,
      totalCalls: calls.length
    });
  } catch (error) {
    console.error("Error fetching user calls:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user calls",
      error: error.message
    });
  }
};

// Get call details by ID
export const getCallDetails = async (req, res) => {
  try {
    const { callId } = req.query;

    if (!callId) {
      return res.status(400).json({
        success: false,
        message: "Call ID is required"
      });
    }

    const call = await Call.findById(callId).select('-__v');

    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found"
      });
    }

    res.status(200).json({
      success: true,
      call
    });
  } catch (error) {
    console.error("Error fetching call details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch call details",
      error: error.message
    });
  }
};

// Check if calling is available for an order
export const checkCallAvailability = async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }

    // Get order details
    const customerOrder = await CustomerOrder.findById(orderId);

    if (!customerOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        callAvailable: false
      });
    }

    // Check if order is in valid status
    const validStatuses = ['accept', 'start'];
    if (!validStatuses.includes(customerOrder.status)) {
      return res.status(200).json({
        success: true,
        callAvailable: false,
        reason: 'Order is not active',
        orderStatus: customerOrder.status
      });
    }

    // Check if pickup time is within 1 hour or ride has started
    const now = new Date();
    const pickupDate = new Date(customerOrder.date1);
    const timeDiff = pickupDate - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    const isWithinOneHour = hoursDiff <= 1 && hoursDiff >= 0;
    const hasStarted = customerOrder.status === 'start';

    if (!isWithinOneHour && !hasStarted) {
      return res.status(200).json({
        success: true,
        callAvailable: false,
        reason: 'Calling available 1 hour before pickup or after ride starts',
        pickupTime: pickupDate,
        hoursUntilPickup: Math.max(0, hoursDiff.toFixed(2))
      });
    }

    // Call is available
    res.status(200).json({
      success: true,
      callAvailable: true,
      orderStatus: customerOrder.status,
      driverId: customerOrder.driver?.driverId,
      customerId: customerOrder.customerId,
      pickupTime: pickupDate
    });
  } catch (error) {
    console.error("Error checking call availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check call availability",
      error: error.message,
      callAvailable: false
    });
  }
};

// Get call statistics
export const getCallStats = async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }

    const calls = await Call.find({ orderId });

    const stats = {
      totalCalls: calls.length,
      answeredCalls: calls.filter(c => c.status === 'answered' || c.status === 'ended').length,
      missedCalls: calls.filter(c => c.status === 'missed').length,
      rejectedCalls: calls.filter(c => c.status === 'rejected').length,
      totalDuration: calls.reduce((sum, c) => sum + (c.duration || 0), 0),
      avgDuration: 0
    };

    const answeredCalls = calls.filter(c => (c.status === 'answered' || c.status === 'ended') && c.duration > 0);
    if (answeredCalls.length > 0) {
      stats.avgDuration = Math.round(
        answeredCalls.reduce((sum, c) => sum + c.duration, 0) / answeredCalls.length
      );
    }

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Error fetching call stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch call statistics",
      error: error.message
    });
  }
};

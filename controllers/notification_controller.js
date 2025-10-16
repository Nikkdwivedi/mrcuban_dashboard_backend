import { Notification } from "../models/notification.js";

export const getNotifications = async (req, res) => {
    try {
      const { id } = req.query;
  
      // Calculate the date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 3);
  
      // Delete notifications older than 7 days for the given driverId
      await Notification.deleteMany({
        driverId: id,
        createdAt: { $lte: sevenDaysAgo },
      });
  
      // Fetch all the notifications for the driver
      const data = await Notification.find({ driverId: id }).sort({createdAt:-1});
  
      return res.status(200).json({ msg: "Notifications retrieved successfully", data });
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: error.message });
    }
  };
  

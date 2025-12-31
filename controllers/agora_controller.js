import pkg from "agora-token";
const { RtcTokenBuilder, RtcRole } = pkg;
import { SendSingularNotification } from "./token_controller.js";

/**
 * Generate Agora RTC Token for voice calling
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const generateAgoraToken = async (req, res) => {
  try {
    // Agora Credentials - loaded at runtime from environment variables
    const APP_ID = process.env.AGORA_APP_ID;
    const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

    if (!APP_ID || !APP_CERTIFICATE) {
      console.error("Agora credentials not configured in environment variables");
      return res.status(500).json({
        success: false,
        msg: "Agora credentials not configured on server"
      });
    }

    const { channelName, uid, role } = req.query;

    if (!channelName) {
      return res.status(400).json({
        success: false,
        msg: "Channel name is required"
      });
    }

    // Set user role (publisher or subscriber)
    const userRole = role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

    // UID: 0 means Agora will assign a random UID
    const userId = uid ? parseInt(uid) : 0;

    // Token expiration time (24 hours)
    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build token
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      userId,
      userRole,
      privilegeExpiredTs
    );

    console.log("Agora token generated for channel:", channelName);

    res.status(200).json({
      success: true,
      msg: "Token generated successfully",
      data: {
        token,
        appId: APP_ID,
        channelName,
        uid: userId,
        expiresIn: expirationTimeInSeconds,
      },
    });
  } catch (error) {
    console.error("Error generating Agora token:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to generate token",
      error: error.message
    });
  }
};

/**
 * Send call notification to the other user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendCallNotification = async (req, res) => {
  try {
    const { receiverId, callerName, channelName, isDriver } = req.body;

    if (!receiverId || !callerName || !channelName) {
      return res.status(400).json({
        success: false,
        msg: "Missing required fields",
      });
    }

    // Send push notification to receiver
    const notificationTitle = `Incoming Call`;
    const notificationBody = `${callerName} is calling you...`;

    await SendSingularNotification(
      receiverId,
      notificationTitle,
      notificationBody
    );

    console.log(`Call notification sent to ${receiverId} from ${callerName} for channel: ${channelName}`);

    res.status(200).json({
      success: true,
      msg: "Call notification sent successfully",
      data: {
        channelName,
        callerName,
      },
    });
  } catch (error) {
    console.error("Error sending call notification:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to send call notification",
      error: error.message,
    });
  }
};

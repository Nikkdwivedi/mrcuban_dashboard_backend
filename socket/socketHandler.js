import Call from "../models/call.js";
import { SendSingularNotification } from "../controllers/token_controller.js";

// Store active socket connections
const connectedUsers = new Map(); // userId -> socketId
const activeRooms = new Map(); // orderId -> { customerId, driverId, customerSocketId, driverSocketId }

export const setupSocketIO = (io) => {

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // User joins the system with their ID
    socket.on("user:join", ({ userId, userType }) => {
      console.log(`User joined - ID: ${userId}, Type: ${userType}, Socket: ${socket.id}`);
      connectedUsers.set(userId, {
        socketId: socket.id,
        userType: userType, // 'customer' or 'driver'
        userId: userId
      });

      // Join a personal room based on userId
      socket.join(`user:${userId}`);
    });

    // User joins a specific order/ride room
    socket.on("order:join", ({ orderId, userId, userType }) => {
      console.log(`User ${userId} joining order room: ${orderId}`);
      socket.join(`order:${orderId}`);

      // Track active order rooms
      if (!activeRooms.has(orderId)) {
        activeRooms.set(orderId, {});
      }

      const room = activeRooms.get(orderId);
      if (userType === 'customer') {
        room.customerId = userId;
        room.customerSocketId = socket.id;
      } else if (userType === 'driver') {
        room.driverId = userId;
        room.driverSocketId = socket.id;
      }
      activeRooms.set(orderId, room);
    });

    // Leave order room
    socket.on("order:leave", ({ orderId, userId, userType }) => {
      console.log(`User ${userId} leaving order room: ${orderId}`);
      socket.leave(`order:${orderId}`);

      const room = activeRooms.get(orderId);
      if (room) {
        if (userType === 'customer') {
          delete room.customerId;
          delete room.customerSocketId;
        } else if (userType === 'driver') {
          delete room.driverId;
          delete room.driverSocketId;
        }

        // Clean up empty rooms
        if (!room.customerId && !room.driverId) {
          activeRooms.delete(orderId);
        } else {
          activeRooms.set(orderId, room);
        }
      }
    });

    // Initiate a call
    socket.on("call:initiate", async ({ orderId, callerId, callerType, receiverId, receiverType }) => {
      console.log(`Call initiated - Order: ${orderId}, Caller: ${callerId} (${callerType})`);

      try {
        // Create call record
        const call = await Call.create({
          orderId,
          callerId,
          callerType,
          receiverId,
          receiverType,
          callType: 'audio',
          status: 'initiated'
        });

        // Send call initiation to receiver
        const receiverConnection = connectedUsers.get(receiverId);

        if (receiverConnection) {
          // Receiver is online - send via socket
          io.to(`user:${receiverId}`).emit("call:incoming", {
            callId: call._id,
            orderId,
            callerId,
            callerType,
            callerName: callerType === 'customer' ? 'Customer' : 'Driver'
          });

          // Update call status to ringing
          call.status = 'ringing';
          await call.save();
        } else {
          // Receiver is offline - send push notification
          console.log(`Receiver ${receiverId} is offline, sending push notification`);

          // Send push notification
          await SendSingularNotification(receiverId, {
            title: `Incoming Call`,
            body: `${callerType === 'customer' ? 'Customer' : 'Driver'} is calling you`,
            data: {
              type: 'incoming_call',
              callId: call._id.toString(),
              orderId,
              callerId,
              callerType
            }
          });

          // Call will remain in 'initiated' status
        }

        // Notify caller that call was initiated
        socket.emit("call:initiated", {
          callId: call._id,
          status: receiverConnection ? 'ringing' : 'offline_notification_sent'
        });

      } catch (error) {
        console.error("Error initiating call:", error);
        socket.emit("call:error", { message: "Failed to initiate call" });
      }
    });

    // WebRTC Signaling: Send offer
    socket.on("call:offer", async ({ callId, orderId, receiverId, offer }) => {
      console.log(`Call offer received for call ${callId}`);

      try {
        // Forward offer to receiver
        io.to(`user:${receiverId}`).emit("call:offer", {
          callId,
          orderId,
          offer
        });
      } catch (error) {
        console.error("Error forwarding offer:", error);
      }
    });

    // WebRTC Signaling: Send answer
    socket.on("call:answer", async ({ callId, orderId, callerId, answer }) => {
      console.log(`Call answer received for call ${callId}`);

      try {
        // Update call status to answered
        const call = await Call.findById(callId);
        if (call && call.status === 'ringing') {
          call.status = 'answered';
          call.startTime = new Date();
          await call.save();
        }

        // Forward answer to caller
        io.to(`user:${callerId}`).emit("call:answer", {
          callId,
          orderId,
          answer
        });
      } catch (error) {
        console.error("Error forwarding answer:", error);
      }
    });

    // WebRTC Signaling: ICE candidates
    socket.on("call:ice-candidate", ({ callId, orderId, targetUserId, candidate }) => {
      console.log(`ICE candidate received for call ${callId}`);

      // Forward ICE candidate to target user
      io.to(`user:${targetUserId}`).emit("call:ice-candidate", {
        callId,
        orderId,
        candidate
      });
    });

    // Call rejected
    socket.on("call:reject", async ({ callId, orderId, callerId }) => {
      console.log(`Call rejected - Call ID: ${callId}`);

      try {
        // Update call status
        const call = await Call.findById(callId);
        if (call) {
          call.status = 'rejected';
          call.endTime = new Date();
          await call.save();
        }

        // Notify caller
        io.to(`user:${callerId}`).emit("call:rejected", {
          callId,
          orderId
        });
      } catch (error) {
        console.error("Error rejecting call:", error);
      }
    });

    // Call ended
    socket.on("call:end", async ({ callId, orderId, otherUserId, duration, callQuality }) => {
      console.log(`Call ended - Call ID: ${callId}, Duration: ${duration}s`);

      try {
        // Update call record
        const call = await Call.findById(callId);
        if (call) {
          call.status = 'ended';
          call.endTime = new Date();
          if (duration) call.duration = duration;
          if (callQuality) call.callQuality = callQuality;
          await call.save();
        }

        // Notify other participant
        if (otherUserId) {
          io.to(`user:${otherUserId}`).emit("call:ended", {
            callId,
            orderId,
            duration
          });
        }
      } catch (error) {
        console.error("Error ending call:", error);
      }
    });

    // Call missed (no answer timeout)
    socket.on("call:missed", async ({ callId, orderId }) => {
      console.log(`Call missed - Call ID: ${callId}`);

      try {
        const call = await Call.findById(callId);
        if (call && call.status === 'ringing') {
          call.status = 'missed';
          call.endTime = new Date();
          await call.save();
        }
      } catch (error) {
        console.error("Error marking call as missed:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);

      // Remove from connected users
      for (const [userId, data] of connectedUsers.entries()) {
        if (data.socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} removed from connected users`);
          break;
        }
      }

      // Clean up from active rooms
      for (const [orderId, room] of activeRooms.entries()) {
        if (room.customerSocketId === socket.id) {
          delete room.customerId;
          delete room.customerSocketId;
        }
        if (room.driverSocketId === socket.id) {
          delete room.driverId;
          delete room.driverSocketId;
        }

        if (!room.customerId && !room.driverId) {
          activeRooms.delete(orderId);
        } else {
          activeRooms.set(orderId, room);
        }
      }
    });
  });

  // Return io instance for use in other parts of the app
  return io;
};

// Helper function to get online users
export const getConnectedUsers = () => {
  return Array.from(connectedUsers.keys());
};

// Helper function to check if user is online
export const isUserOnline = (userId) => {
  return connectedUsers.has(userId);
};

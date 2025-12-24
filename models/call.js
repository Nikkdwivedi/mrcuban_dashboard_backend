import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'CustomerOrder'
  },
  callerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  callerType: {
    type: String,
    enum: ['customer', 'driver'],
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  receiverType: {
    type: String,
    enum: ['customer', 'driver'],
    required: true
  },
  callType: {
    type: String,
    enum: ['audio', 'video'],
    default: 'audio'
  },
  status: {
    type: String,
    enum: ['initiated', 'ringing', 'answered', 'missed', 'rejected', 'ended', 'failed'],
    default: 'initiated'
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  callQuality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: null
  }
}, {
  timestamps: true
});

// Virtual field to calculate duration if not set
callSchema.virtual('calculatedDuration').get(function() {
  if (this.startTime && this.endTime) {
    return Math.floor((this.endTime - this.startTime) / 1000);
  }
  return this.duration;
});

// Pre-save hook to calculate duration
callSchema.pre('save', function(next) {
  if (this.startTime && this.endTime && this.duration === 0) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

const Call = mongoose.model("Call", callSchema);

export default Call;

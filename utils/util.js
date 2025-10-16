import { User } from "../models/user.js";

export const OTP_Generator = async ()=> {
    let otp;
    let isUnique = false;
  
    do {
      otp = Math.floor(1000 + Math.random() * 9000);
      console.log(otp)
      const existingUser = await User.findOne({ accountOtp: String(otp) });
      if (!existingUser) {
        isUnique = true;
      }
    } while (!isUnique);
  
    return String(otp);
  }
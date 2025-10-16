import { Driver } from "../models/driver.js";
import { Notification } from "../models/notification.js";
import { Rating } from "../models/rating.js";
import { User } from "../models/user.js";

//comment create by user
export const createComment = async (req, res) => {
  try {
    const { driverId, customerId, comment, rating } = req.query;

    const data = await Rating.create({
      driverId: driverId,
      customerId: customerId,
      comment: comment,
      rating: rating,
    });

    const rateNumber = await Rating.find({ driverId: driverId }, "rating");
    let temp = 0;
    for (let i = 0; i < rateNumber?.length; i++) {
      temp = temp + Number(rateNumber[i]?.rating);
    }
    const finalRating = Math.floor(Number(temp / rateNumber?.length)).toFixed(
      0
    );

    await Notification.create({
      title: "Rating Notification",
      driverId: driverId,
      message: "New comment added to your account",
    });

    await Driver.findByIdAndUpdate({ _id: driverId }, { ratings: finalRating });
    return res.status(201).json({ msg: "Rating Saved Successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

//comments get by user
export const CommentGetByCustomer = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await Rating.find({ customerId: id })
      .limit(30)
      .sort({ createdAt: -1 });
    const main = [];
    for (let i = 0; i < data?.length; i++) {
      const driverdetails = await Driver.findById(
        { _id: data[i]?.driverId },
        "name"
      );
      main.push({ rate: data[i], driver: driverdetails });
    }

    return res
      .status(200)
      .json({ msg: "Comments Fetch Successfully", data: main });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

//comments get by driver
export const CommentGetByDriver = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await Rating.find({ driverId: id })
      .limit(20)
      .sort({ createdAt: -1 });
    const mainData = [];
    for (let i = 0; i < data?.length; i++) {
      const user = await User.findById({ _id: data[i]?.customerId }, "name");
      mainData.push({ user: user, rate: data[i] });
    }

    return res
      .status(200)
      .json({ msg: "Comments fetch Successfully", data: mainData });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const CommentGetByDriver2 = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await Rating.find({ driverId: id })
      .limit(5)
      .sort({ createdAt: -1 });
    const mainData = [];
    for (let i = 0; i < data?.length; i++) {
      const user = await User.findById({ _id: data[i]?.customerId }, "name");
      mainData.push({ user: user, rate: data[i] });
    }

    return res
      .status(200)
      .json({ msg: "Comments fetch Successfully", data: mainData });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

//code to get all comments of a driver
export const AllCommentGetByDriver = async (req, res) => {

  try {

    const data = await Rating.find({
      $or: [
        { isApproved:false },
        { isApproved: null }
      ]
    })
    .limit(20)
    .sort({ createdAt: -1 });

    const mainData = [];
    for (let i = 0; i < data?.length; i++) {
      const user = await User.findById({ _id: data[i]?.customerId }, "name");
      mainData.push({ user: user, rate: data[i] });
    }
    
    return res
      .status(200)
      .json({ msg: "Comments fetch Successfully", data: mainData });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};


// Common update controller for Accept & Edit
export const UpdateRatingByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating, isApproved } = req.body;


    const updateFields = {};
    if (comment !== undefined) updateFields.comment = comment;
    if (rating !== undefined) updateFields.rating = rating;
    if (isApproved !== undefined) updateFields.isApproved = isApproved;

    const updated = await Rating.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: "Rating not found" });
    }

    return res
      .status(200)
      .json({ msg: "Rating updated successfully", data: updated });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error.message });
  }
};
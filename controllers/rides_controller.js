import { Rides } from "../models/rides.js";
import cloudinary from "cloudinary";

// Function to upload using Cloudinary's upload stream
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        {
          resource_type: "image",
          public_id: `backup_${Date.now()}`, // Assign a unique public ID
        },
        (error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            resolve({
              public_id: result.public_id,
              url: result.secure_url,
            });
          }
        }
      )
      .end(file.data); // Use file.data to pass the file buffer
  });
};

export const addRide = async (req, res) => {
  try {
    const { id, name, no, seat } = req.body;
    const { images } = req.files;

    // Check if the vehicle is already registered
    const check = await Rides.find({
      $and: [{ driverId: id }, { modelNumber: no }],
    });

    if (check?.length > 0) {
      return res.status(400).json({ msg: "Vehicle already registered" });
    }

    let imageUrls = [];

    // Upload images to Cloudinary using the uploadToCloudinary function
    if (images) {
      const uploadImages = Array.isArray(images) ? images : [images]; // Handle multiple images

      for (let i = 0; i < uploadImages.length; i++) {
        const image = uploadImages[i];
        const result = await uploadToCloudinary(image); // Use the stream upload function
        imageUrls.push(result); // Store uploaded image URL and public ID
      }
    }

    // Create the ride with the image URLs
    const data = await Rides.create({
      driverId: id,
      modelName: name,
      modelNumber: no,
      seat: seat,
      img: imageUrls, // Save the Cloudinary URLs and public IDs
    });

    return res
      .status(201)
      .json({ msg: "Vehicle registered successfully", data });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: error.message });
  }
};

export const GetRides = async (req, res) => {
  try {
    const { id } = req.query;

    const data = await Rides.find({ driverId: id });

    return res.status(200).json({ msg: "Rides Get Successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const GetActiveRides = async (req, res) => {
  try {
    const { id } = req.query;

    const data = await Rides.find({
      $and: [{ driverId: id }, { status: true }],
    });

    return res.status(200).json({ msg: "Rides Get Successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

export const RidesDelete = async (req, res) => {
  try {
    const { id } = req.query;

    const data = await Rides.findByIdAndDelete({ _id: id });

    return res.status(200).json({ msg: "Rides Delete Successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(400), json({ msg: error });
  }
};

export const GetDisableRides = async (req, res) => {
  try {
    const { id, status } = req.query;

    const data = await Rides.findByIdAndUpdate(
      {
        _id: id,
      },
      { status: status }
    );

    return res.status(200).json({ msg: "Rides Update Successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: error });
  }
};

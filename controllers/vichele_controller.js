import { Vichele } from "../models/vichele.js";

export const createVichele = async (req, res) => {
  try {
    const { name, seat,type } = req.query;

    const check = await Vichele.find({ seat: seat });

    if (check?.length > 0) {
      return res.status(400).json({ msg: "Model already exist" });
    } else {
      const data = await Vichele.create({ name, seat,type });
      return res.status(201).json({ msg: "Vichele Created", data });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const FetchVichele = async (req, res) => {
  try {
    const data = await Vichele.find({});
    res.status(200).json({ msg: "Vichele Fetch", data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

export const VicheleDelete = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await Vichele.findByIdAndDelete({ _id: id });
    return res.status(200).json({ msg: "Vichele Deleted", data:[] });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

import formidable from "formidable";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Cafe } from "../models/cafeModel.js";
import { Employee } from "../models/employeeModel.js";

// create cafe
export const createCafe = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    let logo = {};

    if (files.logo) {
      logo = {
        data: fs.readFileSync(files.logo.path),
        contentType: files.logo.type,
      };
    }

    // create new cafe object
    const cafe = new Cafe({
      id: uuidv4(),
      name: fields.name,
      description: fields.description,
      logo: logo?.data ? logo : null,
      location: fields.location,
    });

    // save to DB
    const result = await cafe.save();
    res.status(200).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ code: 1000, message: "Cafe is not added successfully" });
  }
};

// update cafe
export const updateCafe = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const cafe = await Cafe.findOne({ id: req.params.id }).exec();

    let logo = {};

    if (files.logo) {
      logo = {
        data: fs.readFileSync(files.logo.path),
        contentType: files.logo.type,
      };
    }

    cafe.name = fields.name;
    cafe.description = fields.description;
    cafe.logo = logo?.data ? logo : cafe.logo;
    cafe.location = fields.location;

    const result = await cafe.save();
    res.status(200).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ code: 1000, message: "Cafe is not updated successfully" });
  }
};

// get all cafes
export const getAllCafes = async (req, res) => {
  try {
    const { location } = req.query;
    const cafes = await Cafe.aggregate([
      {
        $match:
          typeof location !== "undefined"
            ? { location: { $regex: `^${location}$`, $options: "i" } }
            : {},
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "cafe_id",
          as: "emp",
        },
      },
      {
        $addFields: {
          employees: { $size: "$emp" },
        },
      },
      {
        $project: {
          __v: 0,
          emp: 0,
          updatedAt: 0,
          createdAt: 0,
        },
      },
    ]).sort({ employees: "desc" });

    const data = {
      data: cafes,
      total: cafes.length,
    };

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

// get cafe
export const getCafe = async (req, res) => {
  try {
    const resp = await Cafe.findOne({ _id: req.params.id }).select(
      "-__v -updatedAt -createdAt"
    );
    res.status(200).json(resp);
  } catch (err) {
    res.status(400).json(err);
  }
};

// get unique locations
export const getUniqueLocations = async (req, res) => {
  try {
    const uniqueLocationArr = await Cafe.distinct("location");
    res.status(200).json(uniqueLocationArr);
  } catch (err) {
    res.status(400).json(err);
  }
};

// delete cafe
export const deleteCafe = async (req, res) => {
  try {
    const employees = await Employee.find({ cafe_id: req.params.id }).exec();
    for (const emp of employees) {
      emp.cafe_id = null;
      await emp.save();
    }

    await Cafe.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ code: 1000, message: "Cafe deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
};

// get logo
export const getLogo = async (req, res) => {
  try {
    const cafe = await Cafe.findOne({ id: req.params.id }).exec();
    const { contentType, data } = cafe.logo;
    if (contentType) {
      res.set("Content-Type", contentType);
      return res.send(data);
    }
  } catch (err) {
    res.status(400).json({ code: 1000, message: "Error retrieving logo" });
  }
};

import { Employee } from "../models/employeeModel.js";
import { generateEmployeeId } from "../helpers/utilityHelper.js";

// create employee
export const createEmployee = async (req, res) => {
  try {
    const { name, email_address, phone_number, gender, cafe_id, start_date } =
      req.body;

    // create new employee object
    const employee = new Employee({
      id: generateEmployeeId(),
      name,
      email_address,
      phone_number,
      gender,
      cafe_id,
      start_date,
    });

    // save to DB
    const result = await employee.save();
    res.status(200).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ code: 1000, message: "Employee is not added successfully" });
  }
};

// update employee
export const updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({ id: req.params.id }).exec();
    const { name, email_address, phone_number, gender, cafe_id, start_date } =
      req.body;

    emp.name = name;
    emp.email_address = email_address;
    emp.phone_number = phone_number;
    emp.gender = gender;
    emp.cafe_id = cafe_id;
    emp.start_date = start_date;

    const result = await emp.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ code: 1000, message: "Employee update failed" });
  }
};

// get all employees
export const getAllEmployees = async (req, res, next) => {
  try {
    const { cafe } = req?.query;
    const employees = await Employee.aggregate([
      {
        $addFields: {
          workedDays: {
            $floor: {
              $divide: [
                {
                  $subtract: [
                    new Date(),
                    { $toDate: "$start_date" }, // Convert start_date to Date type
                  ],
                },
                1000 * 60 * 60 * 24, // milliseconds in a day
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "caves",
          localField: "cafe_id",
          foreignField: "_id",
          as: "cafe_id",
        },
      },
      {
        $project: {
          __v: 0,
          _id: 0,
          updatedAt: 0,
          createdAt: 0,
          "cafe_id.description": 0,
          "cafe_id.id": 0,
          "cafe_id.location": 0,
          "cafe_id.logo": 0,
          "cafe_id.updatedAt": 0,
          "cafe_id.createdAt": 0,
          "cafe_id.__v": 0,
        },
      },
    ]).sort({ workedDays: "desc" });

    let filteredEmployees = employees;

    if (typeof cafe !== "undefined") {
      filteredEmployees = employees.filter(
        (el) => el?.cafe_id?.[0]?.name?.toLowerCase() === cafe.toLowerCase()
      );
    }

    res.status(200).json({
      data: filteredEmployees,
      total: filteredEmployees.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// get employee
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: req.params.id }).select(
      "-__v -updatedAt -createdAt"
    );
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ code: 404, message: "Employee not found" });
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: "Failed to retrieve employee" });
  }
};

// delete employee
export const deleteEmployee = async (req, res) => {
  try {
    await Employee.deleteOne({ id: req.params.id }).exec();
    res.status(200).json({ code: 1000, message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ code: 5000, message: "Failed to delete employee" });
  }
};

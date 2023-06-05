import mongoose from "mongoose";

const employeeSchema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email_address: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone_number: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    cafe_id: {
      type: mongoose.Schema.Types.ObjectId || null,
      ref: "Cafe",
    },
    start_date: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model("Employee", employeeSchema);

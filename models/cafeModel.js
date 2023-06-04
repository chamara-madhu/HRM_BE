import mongoose from "mongoose";

const cafeSchema = mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    logo: { data: Buffer || null, contentType: String },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

export const Cafe = mongoose.model("Cafe", cafeSchema);

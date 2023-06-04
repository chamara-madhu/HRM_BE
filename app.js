import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import employeeRoutes from "./routes/api/employeeRoutes.js";
import cafeRoutes from "./routes/api/cafeRoutes.js";

const app = express();

// connect mongoDB cloud
mongoose
  .connect(
    "mongodb+srv://artiAdmin:Articare1@@arti.we407.mongodb.net/hrm?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("db is running"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
});
app.use("/api/v1", employeeRoutes);
app.use("/api/v1", cafeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running in Port ${PORT}`));

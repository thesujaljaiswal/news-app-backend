import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URL}/${DB_NAME}`
    );
    console.log("Connected to mongoDB Successfully, The host name is", connectionInstance.connection.host)
  } catch (error) {
    console.log("Failed to connect MONGODB", error);
    process.exit(1);
  }
};

export default connectDB;

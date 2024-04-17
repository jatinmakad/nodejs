import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`db Connected: ${data.connection.host}`);
    })
};

export default connectDB;

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
  },
  discription: {
    type: String,
    required: [true, "Please enter discription"],
  },
  price: {
    type: Number,
    required: [true, "Please enter price"],
    maxLength: [8, "Price cannot exceed 8 Char"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter category"],
  },
  stock: {
    type: String,
    required: [true, "Please enter prodcut stock"],
    maxLength: [4, "Stock cannot exceed 4 Char"],
    default: 1,
  },
  numOfReview: {
    type: String,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);

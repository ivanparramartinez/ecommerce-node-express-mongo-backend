import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  //   description: {
  //     type: String,
  //     required: true,
  //     trim: true,
  //   },
  //   rating: {
  //     type: Number,
  //     required: true,
  //   },
  //   images: {
  //     type: [String],
  //     required: true,
  //   },
  //   sizes: {
  //     type: [String],
  //     required: true,
  //   },
  //   colors: {
  //     type: [String],
  //     required: true,
  //   },
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Product = model("Product", productSchema);

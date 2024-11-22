import { Product } from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json({ products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const createBulkProducts = async (req, res) => {
  try {
    console.log(req.uid);
    const products = req.csvData.map((product) => {
      return {
        name: product.name,
        price: product.price,
        stock: product.stock,
        uid: req.uid,
      };
    });

    const newProducts = await Product.insertMany(products);
    return res
      .status(201)
      .json({ products: newProducts, message: "Productos creados" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

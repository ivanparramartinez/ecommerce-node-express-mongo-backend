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
    const productMap = new Map();

    req.csvData.forEach((product) => {
      const images = product.images.split("|"); // Split the images string into an array
      const variation = {
        color: product.color,
        size: product.size,
        stock: parseInt(product.stock, 10), // Convert stock to number
      };

      if (productMap.has(product.reference)) {
        productMap.get(product.reference).variations.push(variation);
      } else {
        productMap.set(product.reference, {
          reference: product.reference,
          name: product.name,
          price: parseFloat(product.price), // Convert price to number
          variations: [variation],
          description: product.description,
          rating: parseFloat(product.rating), // Convert rating to number
          images: images,
          category: product.category, // Include category
          brand: product.brand, // Include brand
          uid: req.uid,
        });
      }
    });

    const products = Array.from(productMap.values());

    const newProducts = await Product.insertMany(products);
    return res
      .status(201)
      .json({ products: newProducts, message: "Productos creados" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

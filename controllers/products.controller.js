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

    req.data.forEach((product) => {
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

export const updateBulkProducts = async (req, res) => {
  try {
    const productMap = new Map();

    req.data.forEach((product) => {
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

    const deleteProductsNotInFile = await Product.deleteMany({
      reference: { $nin: products.map((product) => product.reference) },
    });

    console.log("deleteProductsNotInFile:", deleteProductsNotInFile);

    const bulkOperations = products.map((product) => {
      return {
        updateOne: {
          filter: { reference: product.reference }, // Find product by reference
          update: {
            $set: {
              name: product.name,
              price: parseFloat(product.price), // Convert price to number
              description: product.description,
              rating: parseFloat(product.rating), // Convert rating to number
              images: product.images,
              category: product.category,
              brand: product.brand,
              variations: product.variations,
              uid: req.uid,
            },
          },
          upsert: true, // Optionally insert the product if not found
        },
      };
    });

    const updatedProducts = await Product.bulkWrite(bulkOperations);

    return res
      .status(200)
      .json({ products: updatedProducts, message: "Productos actualizados" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al obtener el producto" });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

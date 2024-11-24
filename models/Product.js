import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Subschema para manejar las variaciones de producto
const variationSchema = new Schema({
  color: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0, // Para evitar números negativos
  },
});

// Esquema principal del producto
const productSchema = new Schema(
  {
    reference: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5, // Asumiendo un rango de calificación típico
    },
    images: {
      type: [String], // URLs de imágenes
      validate: [(v) => v.length > 0, "Debe tener al menos una imagen"],
    },
    variations: {
      type: [variationSchema], // Referencia al subschema
      required: true,
      validate: [(v) => v.length > 0, "Debe tener al menos una variación"], // Validación personalizada
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    uid: {
      type: Schema.Types.ObjectId,
      ref: "User", // Relación con el usuario que creó el producto
      required: true,
    },
  },
  {
    timestamps: true, // Para agregar automáticamente `createdAt` y `updatedAt`
  }
);

export const Product = model("Product", productSchema);

export const productSchemaForXlsx = {
  reference: {
    prop: "reference",
    data: String,
  },
  name: {
    prop: "name",
    data: String,
  },
  price: {
    prop: "price",
    data: Number,
  },
  description: {
    prop: "description",
    data: String,
  },
  rating: {
    prop: "rating",
    data: Number,
  },
  images: {
    prop: "images",
    data: String,
  },
  color: {
    prop: "color",
    data: String,
  },
  size: {
    prop: "size",
    data: String,
  },
  stock: {
    prop: "stock",
    data: Number,
  },
  category: {
    prop: "category",
    data: String,
  },
  brand: {
    prop: "brand",
    data: String,
  },
};

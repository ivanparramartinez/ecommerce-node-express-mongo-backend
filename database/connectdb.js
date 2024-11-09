import mongoose from "mongoose";

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log('Error de conexión a mongodb: ',error);
}

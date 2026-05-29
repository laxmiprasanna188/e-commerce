import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from './routes/productRoute.js'
import cors from 'cors'
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

connectDB();

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from "express";
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/productController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";



const router = express.Router();

// Register
router.post("/add", isAuthenticated, isAdmin, multipleUpload,addProduct);
router.get('/getallproduct', getAllProduct)
router.delete('/delete/:productId', isAuthenticated, isAdmin, deleteProduct)
router.put("/update/:productId", multipleUpload, isAuthenticated, isAdmin, updateProduct)
export default router;
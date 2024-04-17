import express from "express";
import {
  createProduct,
  DelteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controller/productController.js";
import { isAuthentication, authorizeRole } from "../middleware/auth.js";
const router = express.Router();
router.route("/product").get(getAllProduct);
router
  .route("/create-product")
  .post(isAuthentication, authorizeRole("admin"), createProduct);
router
  .route("/update-product/:id")
  .put(isAuthentication, authorizeRole("admin"), updateProduct);
router
  .route("/delete-product/:id")
  .delete(isAuthentication, authorizeRole("admin"), DelteProduct);
router.route("/product/:id").get(getProductById);
export default router;

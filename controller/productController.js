import catchAsyncError from "../middleware/catchAsyncError.js";
import Product from "../models/ProductModels.js";
import ApiFeatures from "../utils/apiFeatures.js";
export const createProduct = catchAsyncError(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

export const updateProduct = catchAsyncError(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    errorFunction(res, 500, "Product not Found", false);
  } else {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    return res.status(200).json({
      success: true,
      product,
    });
  }
});

export const DelteProduct = catchAsyncError(async (req, res) => {
  let product = await Product.findOneAndDelete(req.params.id);

  if (!product) {
    errorFunction(res, 500, "Product not Found", false);
  } else {
    errorFunction(res, 200, "Product Deleted Succesfully", true);
  }
});

export const getProductById = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    errorFunction(res, 500, "Product not Found", false);
  } else {
    return res.status(200).json({
      success: true,
      product,
    });
  }
});

export const getAllProduct = catchAsyncError(async (req, res) => {
  let resultPerPage = 5;
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apiFeatures.query;
  return res.status(200).json({
    success: true,
    products,
  });
});

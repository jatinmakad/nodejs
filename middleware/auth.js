import { errorFunction } from "../utils/utilFunction.js";
import catchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
const isAuthentication = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      errorFunction(res, 401, "Please Login to access this record", false)
    );
  }
  const decode = jwt.verify(token, process.env.JWT_SECRATE);
  req.user = await User.findById(decode.id);
  next();
});
const authorizeRole = (...role) => {
  return async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      errorFunction(res, 403, `Role ${req.user.role} dont have access to this role`, false);
    }
    next();
  };
};
export { isAuthentication, authorizeRole };

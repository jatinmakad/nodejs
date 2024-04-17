import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/UserModel.js";
import crypto from "crypto";
import { sendToken, errorFunction, sendEmail } from "../utils/utilFunction.js";
export const registerUser = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avtar: {
      public_id: "id",
      url: "url",
    },
  });
  sendToken(user, res);
});

export const logInUser = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    errorFunction(res, 400, "Please enter email and password", false);
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    errorFunction(res, 500, "User not found!", false);
  }

  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    errorFunction(res, 401, "Invalid email and password", false);
  }

  sendToken(user, res);
});

export const logout = catchAsyncError(async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Loged Out",
    });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    errorFunction(res, 404, "User not found!", false);
  }

  // Get resetpassword token
  const generateToken = await user.generatePasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${generateToken}`;

  const message = `Your Passowrd reset toekn is : -\n\n ${resetPasswordUrl} \n\n if you have not request this mail then , please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return errorFunction(res, 500, error.message, false);
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    errorFunction(
      res,
      404,
      "Reset Password token is invalid and has been expired",
      false
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    errorFunction(
      res,
      404,
      "Password does not match with confirm password",
      false
    );
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, res);
});

// Get Profile Data
export const getProfileData = catchAsyncError(async (req, res, next) => {
  let userObj = req.user || {};
  const user = await User.findById(userObj._id);
  if (!user) {
    errorFunction(res, 404, "Cann't find user", false);
  }
  return res.status(200).json({
    success: true,
    user,
  });
});

// Update Profile Info
export const updateProfileData = catchAsyncError(async (req, res, next) => {
  let userObj = req.user || {};
  const user = await User.findById(userObj._id);
  if (!user) {
    errorFunction(res, 404, "Cann't find user", false);
  }
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  return res.status(200).json({
    success: true,
    updatedUser,
  });
});

// Update login password
export const updateLoginPassword = catchAsyncError(async (req, res, next) => {
  const { password, newPassword } = req.body;
  let userObj = req.user || {};
  const user = await User.findOne({ email: userObj.email }).select("+password");
  if (!user) {
    errorFunction(res, 404, "User not found!", false);
  }
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    errorFunction(res, 404, "Password does not match with old password", false);
  }
  if (password == newPassword) {
    errorFunction(
      res,
      404,
      "password and new password should not be same",
      false
    );
  }
  user.password = newPassword;
  await user.save();
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Password Reset Succesfully",
    });
});

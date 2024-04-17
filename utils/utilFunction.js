import nodeMailer from "nodemailer";
const sendToken = (user, res) => {
  const token = user.getJWTToken();
  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(201).cookie("token", token, option).json({
    success: true,
    token,
    user,
  });
};

const errorFunction = (res, status, message, statusType) => {
  return res.status(status).json({
    success: statusType,
    message: message,
  });
};
const sendEmail = async (option) => {
  const transporter = nodeMailer.createTransport({
    service: process.env.SMPT_SERVICE,
    secure: false,
    requireTLS: true,
    host: process.env.SMPT_HOST,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.SMPT_MAIL,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(mailOption);
};
export { errorFunction, sendToken, sendEmail };

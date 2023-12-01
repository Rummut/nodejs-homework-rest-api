const express = require("express");
const { validateBody } = require("../../validation/validateBody");
const {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  emailSchema,
} = require("../../validation/userValidationSchema");

const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verify,
  resendVerifyEmail,
} = require("../../controllers/auth");
const { authenticate } = require("../../middlewares/authenticate");
const { uploadFile } = require("../../middlewares/uploadFile");
const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrent);

router.patch(
  "/:_id/subscription",
  authenticate,
  validateBody(subscriptionSchema),
  updateSubscription
);

router.patch(
  "/avatars",
  authenticate,
  uploadFile.single("avatar"),
  updateAvatar
);

router.get("/verify/:verificationToken", verify);

router.post("/verify", validateBody(emailSchema), resendVerifyEmail);
module.exports = router;

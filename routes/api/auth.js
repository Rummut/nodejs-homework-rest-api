const express = require("express");
const { validateBody } = require("../../validation/validateBody");
const {
  registerSchema,
  loginSchema,
  subscriptionSchema,
} = require("../../validation/userValidationSchema");

const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
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
module.exports = router;

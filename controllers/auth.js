const { User } = require("../models/users");
const { HttpError } = require("../helpers/httpError");
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET_KEY } = process.env;
const gravatar = require("gravatar");
const path = require("path");
const avatarDirection = path.join(__dirname, "../public/avatars");
const crypto = require("crypto");
const Jimp = require("jimp");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }
    const body = {
      email: req.body.email,
      password: req.body.password,
    };

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      ...body,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "No content",
  });
};

const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const result = await User.findOneAndUpdate(_id, req.body, { new: true });

    if (!result) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json({ subscription: result.subscription });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;

    const image = await Jimp.read(tempUpload);
    image.resize(250, 250);

    const nameForFile = `${crypto.randomUUID()}_${originalname}`;
    const avatarUpload = path.join(avatarDirection, nameForFile);

    await image.writeAsync(avatarUpload);
    await fs.unlink(tempUpload);
    // await fs.rename(tempUpload, avatarUpload);

    const avatarURL = path.join("avatars", nameForFile);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
};

const { Schema, model } = require("mongoose");
const { mongooseError } = require("../helpers/mongooseError");
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", mongooseError);

const Contact = model("contact", contactSchema);

module.exports = Contact;

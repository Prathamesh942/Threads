import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: (username) => User.doesNotExist({ username }),
        message: "Username already exists",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email) => User.doesNotExist({ email }),
        message: "Email already exists",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profileImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.statics.doesNotExist = async function (field) {
  return (await this.where(field).countDocuments()) === 0;
};

UserSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);

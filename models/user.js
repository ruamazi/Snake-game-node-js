import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
 username: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  minlength: 3,
  maxlength: 20,
 },
 password: {
  type: String,
  required: function () {
   return this.isRegistered;
  }, // Only required for registered users
 },
 score: {
  type: Number,
  required: true,
  default: 0,
 },
 isRegistered: {
  type: Boolean,
  default: true, // If false, the user is a guest
 },
 createdAt: {
  type: Date,
  default: Date.now,
 },
 updatedAt: {
  type: Date,
  default: Date.now,
 },
});

// Hash password before saving (only for registered users)
userSchema.pre("save", async function (next) {
 if (this.isModified("password") && this.isRegistered) {
  this.password = await bcrypt.hash(this.password, 10); // Hash password
 }
 next();
});

// Method to compare password (for registered users only)
userSchema.methods.comparePassword = async function (password) {
 if (this.isRegistered) {
  return bcrypt.compare(password, this.password);
 }
 return false;
};

export const User = mongoose.model("User", userSchema);

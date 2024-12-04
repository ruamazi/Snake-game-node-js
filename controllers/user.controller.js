import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";

export const createUser = async (req, res) => {
 const { username, password } = req.body;
 const usernameRegex = /^[a-z]+$/;

 if (username.includes("guest")) {
  return res.status(400).json({ error: "Username cannot contain word guest" });
 }
 if (!username || !password) {
  return res.status(400).json({ error: "Username and password are required" });
 }
 if (!usernameRegex.test(username)) {
  return res.status(400).json({
   error:
    "Username can only contain lowercase letters and no spaces, symbols, or numbers.",
  });
 }
 if (username.includes("guest")) {
  return res.status(400).json({ error: "Username cannot contain word guest" });
 }
 6;
 if (password.length < 6 || password.length > 20) {
  return res
   .status(400)
   .json({ error: "Password must be between 6 characters and 20 characters" });
 }

 if (username.length < 3 || username > 10) {
  return res.status(400).json({
   error: "Username cannot be less than 3 letters or more than 10 letters",
  });
 }

 try {
  const userExist = await User.findOne({ username });
  const checkPSW = await bcryptjs.compare(password, userExist.password);
  if (checkPSW) {
   return res.status(200).json(userExist);
  }
  if (userExist || !checkPSW) {
   return res.status(400).json({ error: "User name taken, try diffrent one." });
  }
  const user = new User({ username, password });
  await user.save();
  user.password = undefined;
  res.status(201).json(user);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

export const updateScore = async (req, res) => {
 const { userId } = req.params;
 const { score } = req.body;
 if (typeof score !== "number") {
  return res.status(400).json({ error: "Score must be a number" });
 }

 try {
  const user = await User.findById(userId);
  if (!user) {
   return res.status(404).json({ error: "User not found" });
  }
  user.score = score;
  user.updatedAt = Date.now();
  await user.save();
  res.json(user);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

export const leaderBoard = async (req, res) => {
 try {
  const users = await User.find({})
   .sort({ score: -1 })
   .limit(100)
   .select("-password -_id");
  res.json(users);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

export const createGuest = async (req, res) => {
 try {
  const latestGuest = await User.findOne({
   username: { $regex: /^guest(\d+)$/ },
  })
   .sort({ username: -1 })
   .limit(1);

  let nextGuestNumber = 0;
  if (latestGuest) {
   const match = latestGuest.username.match(/^guest(\d+)$/);
   if (match && match[1]) {
    nextGuestNumber = parseInt(match[1], 10) + 1;
   }
  }

  let newUsername = `guest${nextGuestNumber}`;
  while (await User.exists({ username: newUsername })) {
   nextGuestNumber++;
   newUsername = `guest${nextGuestNumber}`;
  }
  const user = new User({
   username: newUsername,
   isRegistered: false,
  });

  await user.save();
  res.status(201).json(user);
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

export const login = async (req, res) => {
 const { username, password } = req.body;

 if (!username || !password) {
  return res.status(400).json({ error: "Username and password are required" });
 }

 try {
  const user = await User.findOne({ username, isRegistered: true });

  if (!user) {
   return res.status(400).json({ error: "User not found or not registered" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
   return res.status(400).json({ error: "Invalid password" });
  }

  res.status(200).json({ message: "Login successful" });
 } catch (error) {
  res.status(500).json({ error: error.message });
 }
};

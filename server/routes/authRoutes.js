const express = require("express");
const User = require("../models/UserLogin");
const adminUser = require("../models/SuperadminModels");
const mongoose = require("mongoose");
const Role = require("../models/RolesSettingsModels");
const router = express.Router();
const bcrypt = require("bcrypt");
const { generateToken, verifyToken, sendEmail } = require("../commonfunction");

// ================= Helper Functions =================

const findUserByUsernameOrEmail = async (usernameOrEmail) => {
  let user = await adminUser.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  let userType = "admin";

  if (!user) {
    user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    userType = "user";
  }

  return { user, userType };
};

const findUserById = async (id) => {
  let user = await adminUser.findById(id);
  let userType = "admin";

  if (!user) {
    user = await User.findById(id);
    userType = "user";
  }

  return { user, userType };
};

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const { user, userType } = await findUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, "1h");
    user.authToken = token;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      role: user.role,
      userType,
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/", async (req, res) => {
  const {
    fullName,
    username,
    email,
    phone,
    password,
    role,
    usertype,
    address,
    company,
    branch, // Include company and branch in the destructuring
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(role)) {
      return res.status(400).json({ message: "Invalid role ID format" });
    }

    const roleDoc = await Role.findById(role);
    if (!roleDoc) {
      return res.status(400).json({ message: "Invalid role - Role not found in DB" });
    }

    // 🔒 Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUserData = {
      fullName,
      username,
      email,
      phone,
      password: hashedPassword,
      role: roleDoc._id,
      usertype,
      address,
    };

    // ✅ If usertype is 'employee', include company and branch
    if (usertype === "employee") {
      if (!company || !branch) {
        return res.status(400).json({ message: "Company and Branch are required for employee type" });
      }

      // Optionally validate if company/branch are valid ObjectIds or exist in DB
      // if (!mongoose.Types.ObjectId.isValid(company) || !mongoose.Types.ObjectId.isValid(branch)) {
      //   return res.status(400).json({ message: "Invalid company or branch ID format" });
      // }

      newUserData.company = company;
      newUserData.branch = branch;
    }

    const newUser = new User(newUserData);

    await newUser.save();
    res.status(201).json({ message: "User successfully registered", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE USER =================
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, username, email, phone, password, role, usertype, address } = req.body;

    const { user, userType } = await findUserById(userId);

    if (!user || userType === "admin") {
      return res.status(404).json({ message: "User not found or not updatable" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        username,
        email,
        phone,
        password,
        role,
        usertype,
        address,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGOUT =================
router.post("/logout", async (req, res) => {
  const { usernameOrEmail } = req.body;

  try {
    const { user } = await findUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.authToken = null;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET LOGGED-IN USER DETAILS =================
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    const decoded = verifyToken(token);
    const { user, userType } = await findUserById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      username: user.username,
      role: user.role,
      company: user.company,
      userType,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET USERS LIST (only from User model) =================
router.get("/", async (req, res) => {
  const { limit = 10, page = 1, username, roleId, company, userType } = req.query;

  try {
    const pageNumber = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    const query = {};

    if (username) query.username = { $regex: username, $options: "i" };
    if (company && company !== "all") query.company = company;
    if (userType) query.userType = userType;

    // Directly use roleId if provided
    if (roleId && roleId !== "all") {
      query.roleID = roleId;
    }

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / pageLimit);

    const users = await User.find(query)
      .populate("role")
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);

    res.status(200).json({
      users,
      totalUsers,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE USER =================
router.delete("/:id", async (req, res) => {
  try {
    const { user, userType } = await findUserById(req.params.id);

    if (!user || userType === "admin") {
      return res.status(404).json({ message: "User not found or not deletable" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= VERIFY TOKEN =================
router.post("/verify-authtoken", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    const { user } = await findUserById(decoded.id);

    if (!user || user.authToken !== token) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false, message: "Token verification failed" });
  }
});

module.exports = router;

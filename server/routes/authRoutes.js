
const express = require("express");
const User = require("../models/UserLogin"); // Import the User model
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Role =require( "../models/SettingModels/RolesSettingsModels")
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";



// **Login Route**
router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Look for a user by either username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password matches (ensure password hashing is handled in a real-world scenario)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Store the token in the user's record (authToken field)
    user.authToken = token;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// router.put("/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { fullName, username, email, phone, password, role, company } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { fullName, username, email, phone, password, role, company },
//       { new: true } // Return updated user
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/register", async (req, res) => {
//   const { fullName, username, email, phone, password, role, roletype } = req.body;

//   console.log("Received Role ID:", role); // 🛠 Debugging Step 1
//   console.log("Request Body:", req.body);

//   try {
//     // Validate role ID format before querying
//     if (!mongoose.Types.ObjectId.isValid(role)) {
//       return res.status(400).json({ message: "Invalid role ID format" });
//     }

//     const roleDoc = await Role.findById(role);
//     console.log("Fetched RoleDoc:", roleDoc); // 🛠 Debugging Step 2

//     if (!roleDoc) {
//       return res.status(400).json({ message: "Invalid role - Role not found in DB" });
//     }

//     const newUser = new User({
//       fullName,
//       username,
//       email,
//       phone,
//       password,
//       role: roleDoc._id, // Use the valid ObjectId
//       roletype,
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: "User successfully registered",
//       user: newUser,
//     });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/register", async (req, res) => {
  const { fullName, username, email, phone, password, role, usertype, address } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(role)) {
      return res.status(400).json({ message: "Invalid role ID format" });
    }

    const roleDoc = await Role.findById(role);
    if (!roleDoc) {
      return res.status(400).json({ message: "Invalid role - Role not found in DB" });
    }

    const newUser = new User({
      fullName,
      username,
      email,
      phone,
      password,
      role: roleDoc._id,
      usertype,
      address,
    });

    await newUser.save();
    res.status(201).json({ message: "User successfully registered", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, username, email, phone, password, role, usertype, address } = req.body;

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
        address, // ✅ Update address fields
      },
      { new: true } // Return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", async (req, res) => {
  const { usernameOrEmail } = req.body;

  try {
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Clear the authToken to log out the user
    user.authToken = null;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// **Get User Details Route (Protected)**
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
console.log("enteredd...")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("token here",decoded.id)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ username: user.username, role: user.role, company: user.company });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// router.get("/", async (req, res) => {
//   const { limit = 10, page = 1, username, role, company } = req.query;
//   console.log(role);

//   try {
//     const pageNumber = parseInt(page, 10) || 1;
//     const pageLimit = parseInt(limit, 10) || 10;

//     const query = {};

//     if (username) query.username = { $regex: username, $options: "i" };
//     if (company && company !== "all") query.company = company;

//     if (role && role !== "all") {
//       // Find the role ID by roleName
//       const roleDoc = await Role.findOne({ roleName: role });

//       // If the role exists, use its ObjectId in the query
//       if (roleDoc) {
//         query.role = roleDoc._id;
//       } else {
//         // If role not found, return an empty array
//         return res.status(200).json({
//           users: [],
//           totalUsers: 0,
//           totalPages: 0,
//           currentPage: pageNumber,
//         });
//       }
//     }

//     // Get the total count of users matching the query
//     const totalUsers = await User.countDocuments(query);

//     // Fetch users and populate only the roleName field
//     const users = await User.find(query)
//       .skip((pageNumber - 1) * pageLimit)
//       .limit(pageLimit)
//       .populate({
//         path: "role", // Ensure that the role is properly populated
//         select: "roleName", // Only fetch the roleName field
//       })
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       users,
//       totalUsers,
//       totalPages: Math.ceil(totalUsers / pageLimit),
//       currentPage: pageNumber,
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, username, role, company } = req.query;

  try {
    const pageNumber = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    const query = {};

    if (username) query.username = { $regex: username, $options: "i" };
    if (company && company !== "all") query.company = company;

    if (role && role !== "all") {
      // Find the role ID by roleName
      const roleDoc = await Role.findOne({ roleName: role });

      // If the role exists, use its ObjectId in the query
      if (roleDoc) {
        query.role = roleDoc._id;
      } else {
        return res.status(200).json({
          users: [],
          totalUsers: 0,
          totalPages: 0,
          currentPage: pageNumber,
        });
      }
    }

    // Get total users count
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / pageLimit);

    // Fetch paginated users
    const users = await User.find(query)
      .populate("role") // Ensure role details are included
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


// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// **Token Verification Route**
router.post("/verify-authtoken", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    // Verify token signature
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user in the database
    const user = await User.findById(decoded.id);

    if (!user || user.authToken !== token) {
      return res.status(401).json({ valid: false, message: "Invalid token" });
    }

    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false, message: "Token verification failed" });
  }
});

module.exports = router;



// Fetch users with pagination and filtering





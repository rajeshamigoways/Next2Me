// const mongoose = require("mongoose");
// const Role = require("../models/SettingModels/RolesSettingsModels"); // Import the Role model

// const userSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference Role
//       ref: "Role", // Reference to the Role model
//       required: true,
//     },
//     roletype: {
//       type: String,
//       required: true,
//       enum: ["admin", "subadmin", "client"], // Adjusted role names for clarity
//     },
//     roleID: {
//       type: String, // Storing as String since you requested "1", "2", "3"
//       default: null, // Not required, will be assigned based on roletype
//     },
//     authToken: {
//       type: String, // Field for storing the JWT token
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// // ✅ Automatically Assign roleID Based on roletype
// userSchema.pre("save", function (next) {
//   if (this.roletype === "admin") {
//     this.roleID = "1";
//   } else if (this.roletype === "subadmin") {
//     this.roleID = "2";
//   } else if (this.roletype === "client") {
//     this.roleID = "3";
//   }
//   next();
// });
// // Pre-delete hook to ensure that if the role is deleted, it's removed from the user
// userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
//   const roleId = this.role;
//   try {
//     const roleExists = await Role.findById(roleId);
//     if (!roleExists) {
//       this.role = null;  // Remove role reference if the role doesn't exist
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });


// const User = mongoose.model("User", userSchema);

// module.exports = User;

const mongoose = require("mongoose");
const Role = require("../models/SettingModels/RolesSettingsModels");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
   usertype: { type: String, required: true, enum: ["admin", "subadmin", "client"] },
    roleID: { type: String, default: null },
    authToken: { type: String, default: null },
    
    // ✅ New Address Fields
    address: {
      city: { type: String, required: false },
    
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.usertype=== "admin") {
    this.roleID = "1";
  } else if (this.usertype === "subadmin") {
    this.roleID = "2";
  } else if (this.usertype === "client") {
    this.roleID = "3";
  }
  next();
});

// Pre-delete hook to ensure that if the role is deleted, it's removed from the user
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const roleId = this.role;
  try {
    const roleExists = await Role.findById(roleId);
    if (!roleExists) {
      this.role = null;  // Remove role reference if the role doesn't exist
    }
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
const mongoose = require("mongoose")
const Role = require("../models/RolesSettingsModels")

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    usertype: { type: String, required: true, enum: ["subadmin", "employee", "client"] },
    roleID: { type: String, default: null },
    authToken: { type: String, default: null },

    // References for employee user type
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: function () {
        return this.usertype === "employee"
      },
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branch_details",
      required: function () {
        return this.usertype === "employee"
      },
    },

    // Address Fields
    address: {
      city: { type: String, required: false },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
  },
  { timestamps: true },
)

userSchema.pre("save", function (next) {
  if (this.usertype === "subadmin") {
    this.roleID = "2"
  } else if (this.usertype === "employee") {
    this.roleID = "3"
  } else if (this.usertype === "client") {
    this.roleID = "4"
  }
  next()
})

// Pre-delete hook to ensure that if the role is deleted, it's removed from the user
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const roleId = this.role
  try {
    const roleExists = await Role.findById(roleId)
    if (!roleExists) {
      this.role = null // Remove role reference if the role doesn't exist
    }
    next()
  } catch (err) {
    next(err)
  }
})

const User = mongoose.model("User", userSchema)

module.exports = User


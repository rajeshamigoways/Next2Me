const express = require("express");
const Role = require("../../models/SettingModels/RolesSettingsModels");
const router = express.Router();

// Create a new role
router.post("/", async (req, res) => {
  try {
    const { roleName, accessModules } = req.body;
    
    // Check if the role name is already taken
    const existingRole = await Role.findOne({ roleName });
    if (existingRole) {
      return res.status(400).json({ message: "Role name already exists" });
    }

    if (!roleName || !accessModules || accessModules.length === 0) {
      return res.status(400).json({ message: "Role name and modules are required" });
    }

    const newRole = new Role({ roleName, accessModules });
    await newRole.save();

    res.status(201).json({ message: "Role created successfully", role: newRole });
  } catch (error) {
    console.error("Error saving role:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get roles with pagination
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10, searchQuery = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = searchQuery ? { roleName: { $regex: searchQuery, $options: "i" } } : {};
    const totalRoles = await Role.countDocuments(query);
    const totalPages = Math.ceil(totalRoles / limit);

    const roles = await Role.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ roles, totalPages });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, accessModules } = req.body;

    // Ensure that roleName and accessModules are provided
    if (!roleName || !accessModules || accessModules.length === 0) {
      return res.status(400).json({ message: "Role name and modules are required" });
    }

    // Check if the roleName is taken by a different role (excluding the current role being updated)
    const existingRole = await Role.findOne({ roleName, _id: { $ne: id } });

    if (existingRole) {
      return res.status(400).json({ message: "Role name already exists" });
    }

    // Update the role in the database
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { roleName, accessModules },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Successfully updated
    res.status(200).json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to check if a role already exists
router.get("/check/:roleName", async (req, res) => {
  try {
    const { roleName } = req.params;

    // Check if a role with the same roleName already exists
    const existingRole = await Role.findOne({ roleName });

    if (existingRole) {
      return res.status(200).json({ exists: true, id: existingRole._id });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking role:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Delete a role
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

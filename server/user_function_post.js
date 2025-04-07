const express = require("express")
const router = express.Router()
const multer = require("multer")
const userFunctions = require("./userfunction")
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const adminUser=require("./models/SuperadminModels")
const roles=require("./models/RolesSettingsModels")
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/") // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const upload = multer({ storage })

// Company Settings Routes
// router.post("/companysettings", async (req, res) => {
//   try {
//     console.log("Incoming Request Data:", req.body)
//     const { username, ...companyData } = req.body
//     const result = await userFunctions.saveCompanySettings(username, companyData)
//     res.status(201).json(result)
//   } catch (error) {
//     console.error("Error in updating company:", error)
//     res.status(500).json({ message: "Error saving company details", error: error.message })
//   }
// })

// router.get("/companysettings", async (req, res) => {
//   try {
//     console.log("Incoming GET request:", req.query)
//     const { username } = req.query
//     const company = await userFunctions.getCompanySettings(username)
//     res.status(200).json(company)
//   } catch (error) {
//     console.error("Error fetching company details:", error)
//     res.status(500).json({ message: "Error fetching company details", error: error.message })
//   }
// })

// Email Template Routes
router.get("/emailsettings/email-templates", async (req, res) => {
  try {
    const templates = await userFunctions.getAllEmailTemplates()
    res.json(templates)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
})

router.get("/emailsettings/email-templates/:id", async (req, res) => {
  try {
    const template = await userFunctions.getEmailTemplateById(req.params.id)
    res.json(template)
  } catch (error) {
    if (error.message === "Template not found") {
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: "Server error", error })
  }
})

router.post("/emailsettings/email-templates", async (req, res) => {
  try {
    const newTemplate = await userFunctions.createEmailTemplate(req.body)
    res.status(201).json(newTemplate)
  } catch (error) {
    if (error.message === "Template with this ID already exists") {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: "Server error", error })
  }
})

router.put("/emailsettings/email-templates/:id", async (req, res) => {
  try {
    const updatedTemplate = await userFunctions.updateEmailTemplate(req.params.id, req.body)
    res.json(updatedTemplate)
  } catch (error) {
    if (error.message === "Template not found") {
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: "Server error", error })
  }
})

// Profile Settings Routes
router.put("/profilesettings/profile", async (req, res) => {
  try {
    const authToken = req.headers.authorization?.split(" ")[1] // Extract token
    const result = await userFunctions.updateProfile(authToken, req.body)
    res.json(result)
  } catch (error) {
    if (error.message === "Unauthorized access" || error.message === "Admin not found") {
      return res.status(401).json({ message: error.message })
    }
    res.status(500).json({ message: "Server error", error })
  }
})

router.put("/profilesettings/changepassword", async (req, res) => {
  try {
    const authToken = req.headers.authorization?.split(" ")[1] // Extract token
    const result = await userFunctions.changePassword(authToken, req.body)
    res.json(result)
  } catch (error) {
    if (error.message === "Unauthorized access" || error.message === "Admin not found") {
      return res.status(401).json({ message: error.message })
    }
    if (error.message === "Old password is incorrect") {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: "Server error", error })
  }
})

router.put("/profilesettings/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const authToken = req.headers.authorization?.split(" ")[1] // Extract token
    const avatarPath = req.file ? `/uploads/${req.file.filename}` : null
    const result = await userFunctions.updateAvatar(authToken, avatarPath)
    res.json(result)
  } catch (error) {
    if (error.message === "Unauthorized access" || error.message === "Admin not found") {
      return res.status(401).json({ message: error.message })
    }
    res.status(500).json({ message: "Server error", error })
  }
})

// Role Settings Routes
router.post("/rolesettings", async (req, res) => {
  try {
    const result = await userFunctions.createRole(req.body)
    res.status(201).json(result)
  } catch (error) {
    if (error.message === "Role name already exists" || error.message === "Role name and modules are required") {
      return res.status(400).json({ message: error.message })
    }
    console.error("Error saving role:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/rolesettings", async (req, res) => {
  try {
    const { page, limit, searchQuery } = req.query
    const result = await userFunctions.getRoles(page, limit, searchQuery)
    res.status(200).json(result)
  } catch (error) {
    console.error("Error fetching roles:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.put("/rolesettings/:id", async (req, res) => {
  try {
    const result = await userFunctions.updateRole(req.params.id, req.body)
    res.status(200).json(result)
  } catch (error) {
    if (error.message === "Role name already exists" || error.message === "Role name and modules are required") {
      return res.status(400).json({ message: error.message })
    }
    if (error.message === "Role not found") {
      return res.status(404).json({ message: error.message })
    }
    console.error("Error updating role:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/rolesettings/check/:roleName", async (req, res) => {
  try {
    const result = await userFunctions.checkRoleExists(req.params.roleName)
    res.status(200).json(result)
  } catch (error) {
    console.error("Error checking role:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.delete("/rolesettings/:id", async (req, res) => {
  try {
    const result = await userFunctions.deleteRole(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    if (error.message === "Role not found") {
      return res.status(404).json({ message: error.message })
    }
    console.error("Error deleting role:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Social Media Settings Routes
router.get("/socialmediasettings", async (req, res) => {
  try {
    const socialLinks = await userFunctions.getSocialMediaSettings()
    res.status(200).json(socialLinks)
  } catch (error) {
    console.log("Error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

router.put("/socialmediasettings", async (req, res) => {
  try {
    const result = await userFunctions.updateSocialMediaSettings(req.body)
    res.status(result.message.includes("created") ? 201 : 200).json(result)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})


/**
 * @route   GET /api/systemsettings
 * @desc    Get system settings
 * @access  Public
 */
router.get("/systemsettings", async (req, res) => {
  try {
    const settings = await userFunctions.getAllSettings()
    res.status(200).json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    })
  }
})

/**
 * @route   GET /api/systemsettings/:id
 * @desc    Get system settings by ID
 * @access  Public
 */
router.get("/systemsettings/:id", async (req, res) => {
  try {
    const settings = await userFunctions.getSettingsById(req.params.id)
    res.status(200).json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    })
  }
})

/**
 * @route   POST /api/systemsettings
 * @desc    Create system settings (only if none exist)
 * @access  Public
 */
router.post("/systemsettings", async (req, res) => {
  try {
    const newSettings = await userFunctions.createSettings(req.body)
    res.status(201).json(newSettings)
  } catch (error) {
    console.error("Error creating settings:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    })
  }
})

/**
 * @route   PUT /api/systemsettings/:id
 * @desc    Update system settings
 * @access  Public
 */
router.put("/systemsettings/:id", async (req, res) => {
  try {
    const settings = await userFunctions.updateSettings(req.params.id, req.body)
    res.status(200).json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    })
  }
})

/**
 * @route   DELETE /api/systemsettings/:id
 * @desc    Delete system settings
 * @access  Public
 */
router.delete("/systemsettings/:id", async (req, res) => {
  try {
    const result = await deleteSettings(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    console.error("Error deleting settings:", error)
    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    })
  }
})

module.exports = router


// Country Routes
router.get("/countries", async (req, res) => {
  try {
    const countries = await userFunctions.getAllCountries()
    res.json(countries)
  } catch (error) {
    res.status(500).json({ message: "Server error", error })
  }
})

router.get("/countries/:iso2", async (req, res) => {
  try {
    const country = await userFunctions.getCountryByIso2(req.params.iso2)
    res.json(country)
  } catch (error) {
    if (error.message === "Country not found") {
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: "Server error", error })
  }
})

router.get("/countries/:iso2/states", async (req, res) => {
  try {
    const states = await userFunctions.getStatesByCountry(req.params.iso2)
    res.json(states)
  } catch (error) {
    if (error.message === "Country not found") {
      return res.status(404).json({ message: error.message })
    }
    res.status(500).json({ message: "Server error", error })
  }
})

router.get("/countries/:iso2/states/:stateCode/cities", async (req, res) => {
  try {
    const state = await userFunctions.getCitiesByState(req.params.iso2, req.params.stateCode)
    res.json(state)
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message })
    }
    console.error("Error fetching cities:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Client Routes - Middleware for validation
const validateRequest = (req, res, next) => {
  try {
    userFunctions.validatecompanyData(req.body)
    next()
  } catch (error) {
    res.status(400).json({ error: error.errors })
  }
}

// router.post("/companies", validateRequest, async (req, res) => {
//   try {
//     console.log("received data", req.body)
//     const newClient = await userFunctions.createcompany(req.body)
//     res.status(201).json(newClient)
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })
router.post('/companies', async (req, res) => {
  try {
      const companyWithBranches = await userFunctions.createcompany(req.body);
      res.status(201).json({ message: 'Company and branches created successfully', data: companyWithBranches });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

router.get("/companies", async (req, res) => {
  try {
    const { page, limit, searchQuery } = req.query
    const result = await userFunctions.getAllcompanys(page, limit, searchQuery)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/companies/:id", async (req, res) => {
  try {
    const client = await userFunctions.getcompanyById(req.params.id)
    res.json(client)
  } catch (err) {
    if (err.message === "Client not found") {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: err.message })
  }
})

router.put("/companies/:id", validateRequest, async (req, res) => {
  console.log("here is the updated detailsssssssssssssss",req.body)
  try {
    const updatedClient = await userFunctions.updatecompany(req.params.id, req.body)
    res.json(updatedClient)
  } catch (err) {
    if (err.message === "Client not found") {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: err.message })
  }
})

router.delete("/companies/:id", async (req, res) => {
  try {
    const result = await userFunctions.deletecompany(req.params.id)
    res.json(result)
  } catch (err) {
    if (err.message === "Client not found") {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: err.message })
  }
})


router.post(
  "/themesettings",
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: "appleIcon", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const result = await userFunctions.saveThemeSettings(req.body, req.files)
      res.status(200).json(result)
    } catch (err) {
      console.error("Error saving theme settings:", err)
      res.status(500).json({ error: "Failed to save theme settings" })
    }
  },
)

// -------------------- Branches --------------------------


// router.post('/branches', async (req, res) => {
//   try {
     
//       const branch = await userFunctions.createbranch(req.body);
//       res.status(201).json({ message: 'Branch created successfully', branch });
//   } catch (error) {
//       res.status(400).json({ error: error.message });
//   }
// });


// -------------------- Employees ----------------------------



router.post('/admin', async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      phone,
      password,
      role,
      usertype,
      roleID,
      authToken,
      address
    } = req.body;

    // Validate role ID
    if (!mongoose.Types.ObjectId.isValid(role)) {
      return res.status(400).json({ error: 'Invalid role ID' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin user
    const adminUsers = new adminUser({
      fullName,
      username,
      email,
      phone,
      password: hashedPassword, // store hashed password
      role: new mongoose.Types.ObjectId(role),
      usertype: usertype || 'admin',
      roleID,
      authToken,
      address
    });

    const savedUser = await adminUsers.save();
    res.status(201).json({ message: 'Admin user created', user: savedUser });

  } catch (err) {
    console.error('Error creating admin user:', err);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

module.exports = router



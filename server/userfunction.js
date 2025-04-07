const Companies = require("./models/CompanyModels")
const Branches= require("./models/BranchModels")
const Employees=require("./models/EmployeeModels")
const EmailTemplate = require("./models/EmailSettingsModel")
const Admin = require("./models/UserLogin")
const Role = require("./models/RolesSettingsModels")
const SystemSettings = require("./models/SystemSettingsModels")
const Country = require("./models/CoutryModels")

const ThemeSettings = require("./models/ThemeSettingsModels")
const SocialMedia = require("./models/SocialMediaSettingsModels")
const { z } = require("zod")

const mongoose = require('mongoose');
const EmployeeModels = require("./models/EmployeeModels")


async function getAllEmailTemplates() {
  return await EmailTemplate.find()
}

async function getEmailTemplateById(id) {
  const template = await EmailTemplate.findOne({ id })
  if (!template) {
    throw new Error("Template not found")
  }
  return template
}

async function createEmailTemplate(templateData) {
  const { id, name, subject, content, variables } = templateData

  // Check if a template with the same ID already exists
  const existingTemplate = await EmailTemplate.findOne({ id })
  if (existingTemplate) {
    throw new Error("Template with this ID already exists")
  }

  const newTemplate = new EmailTemplate({
    id,
    name,
    subject,
    content,
    variables,
  })

  await newTemplate.save()
  return newTemplate
}

async function updateEmailTemplate(id, templateData) {
  const updatedTemplate = await EmailTemplate.findOneAndUpdate({ id }, templateData, { new: true })

  if (!updatedTemplate) {
    throw new Error("Template not found")
  }

  return updatedTemplate
}

// Profile Settings Functions
async function updateProfile(authToken, profileData) {
  if (!authToken) {
    throw new Error("Unauthorized access")
  }

  const admin = await Admin.findOne({ authToken })
  if (!admin) {
    throw new Error("Admin not found")
  }

  const { fullName, phone } = profileData
  admin.username = fullName || admin.username
  admin.phone = phone || admin.phone
  await admin.save()

  return { message: "Profile updated successfully", admin }
}

async function changePassword(authToken, passwordData) {
  if (!authToken) {
    throw new Error("Unauthorized access")
  }

  const admin = await Admin.findOne({ authToken })
  if (!admin) {
    throw new Error("Admin not found")
  }

  const { oldPassword, newPassword } = passwordData

  if (oldPassword !== admin.password) {
    throw new Error("Old password is incorrect")
  }

  admin.password = newPassword
  await admin.save()

  return { message: "Password changed successfully" }
}

async function updateAvatar(authToken, avatarPath) {
  if (!authToken) {
    throw new Error("Unauthorized access")
  }

  const admin = await Admin.findOne({ authToken })
  if (!admin) {
    throw new Error("Admin not found")
  }

  admin.avatar = avatarPath
  await admin.save()
  return { message: "Avatar updated successfully", avatar: avatarPath }
}

// Role Settings Functions
async function createRole(roleData) {
  const { roleName, accessModules } = roleData

  // Check if the role name is already taken
  const existingRole = await Role.findOne({ roleName })
  if (existingRole) {
    throw new Error("Role name already exists")
  }

  if (!roleName || !accessModules || accessModules.length === 0) {
    throw new Error("Role name and modules are required")
  }

  const newRole = new Role({ roleName, accessModules })
  await newRole.save()

  return { message: "Role created successfully", role: newRole }
}

async function getRoles(page = 1, limit = 10, searchQuery = "") {
  page = Number.parseInt(page)
  limit = Number.parseInt(limit)

  const query = searchQuery ? { roleName: { $regex: searchQuery, $options: "i" } } : {}
  const totalRoles = await Role.countDocuments(query)
  const totalPages = Math.ceil(totalRoles / limit)

  const roles = await Role.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  return { roles, totalPages }
}

async function updateRole(id, roleData) {
  const { roleName, accessModules } = roleData

  // Ensure that roleName and accessModules are provided
  if (!roleName || !accessModules || accessModules.length === 0) {
    throw new Error("Role name and modules are required")
  }

  // Check if the roleName is taken by a different role
  const existingRole = await Role.findOne({ roleName, _id: { $ne: id } })
  if (existingRole) {
    throw new Error("Role name already exists")
  }

  // Update the role in the database
  const updatedRole = await Role.findByIdAndUpdate(id, { roleName, accessModules }, { new: true })

  if (!updatedRole) {
    throw new Error("Role not found")
  }

  return { message: "Role updated successfully", role: updatedRole }
}

async function checkRoleExists(roleName) {
  const existingRole = await Role.findOne({ roleName })
  return existingRole ? { exists: true, id: existingRole._id } : { exists: false }
}

async function deleteRole(id) {
  const deletedRole = await Role.findByIdAndDelete(id)
  if (!deletedRole) {
    throw new Error("Role not found")
  }
  return { message: "Role deleted successfully" }
}

// Social Media Settings Functions
async function getSocialMediaSettings() {
  return await SocialMedia.findOne()
}

async function updateSocialMediaSettings(socialData) {
  const { facebook, twitter, instagram, youtube, pinterest, linkedin, snapchat, discord, reddit, telegram, whatsapp } =
    socialData

  const updateData = {
    facebook: facebook || null,
    twitter: twitter || null,
    instagram: instagram || null,
    youtube: youtube || null,
    pinterest: pinterest || null,
    linkedin: linkedin || null,
    snapchat: snapchat || null,
    discord: discord || null,
    reddit: reddit || null,
    telegram: telegram || null,
    whatsapp: whatsapp || null,
  }

  let socialLinks = await SocialMedia.findOne()

  if (socialLinks) {
    // Update existing record
    socialLinks = await SocialMedia.findByIdAndUpdate(socialLinks._id, updateData, { new: true })
    return { message: "Social media links updated!", data: socialLinks }
  } else {
    // Create new record
    const newSocialLinks = new SocialMedia(updateData)
    await newSocialLinks.save()
    return { message: "Social media links created!", data: newSocialLinks }
  }
}


// Get all system settings
 async function getAllSettings()  {
  try {
    return await SystemSettings.find().sort({ createdAt: -1 }).limit(1)
  } catch (error) {
    throw error
  }
}

// Get system settings by ID
async function getSettingsById (id) {
  try {
    const settings = await SystemSettings.findById(id)
    if (!settings) {
      const error = new Error("Settings not found")
      error.statusCode = 404
      throw error
    }
    return settings
  } catch (error) {
    throw error
  }
}

// Create new system settings
async function createSettings(settingsData)  {
  try {
    // Check if settings already exist
    const existingSettings = await SystemSettings.find()

    if (existingSettings.length > 0) {
      const error = new Error("Settings already exist. Use PUT to update.")
      error.statusCode = 400
      throw error
    }

    // Create new settings
    const newSettings = new SystemSettings(settingsData)
    return await newSettings.save()
  } catch (error) {
    throw error
  }
}

// Update system settings
 async function updateSettings(id, settingsData) {
  try {
    const settings = await SystemSettings.findByIdAndUpdate(
      id,
      { $set: settingsData },
      { new: true, runValidators: true },
    )

    if (!settings) {
      const error = new Error("Settings not found")
      error.statusCode = 404
      throw error
    }

    return settings
  } catch (error) {
    throw error
  }
}

// Delete system settings
 async function deleteSettings(id) {
  try {
    const settings = await SystemSettings.findByIdAndDelete(id)

    if (!settings) {
      const error = new Error("Settings not found")
      error.statusCode = 404
      throw error
    }

    return { message: "Settings deleted successfully" }
  } catch (error) {
    throw error
  }
}





// Country Functions
async function getAllCountries() {
  return await Country.find().select("-_id"); // Excludes the `_id` field if not needed
}


async function getCountryByIso2(iso2) {
  const country = await Country.findOne({ iso2: iso2.toUpperCase() })
  if (!country) {
    throw new Error("Country not found")
  }
  return country
}

async function getStatesByCountry(iso2) {
  const country = await Country.findOne({ iso2: iso2.toUpperCase() }, "states")
  if (!country) {
    throw new Error("Country not found")
  }
  return country.states.map((state) => ({ id: state.id, name: state.name }))
}

async function getCitiesByState(iso2, stateCode) {
  const country = await Country.findOne({ iso2: iso2.toUpperCase() }, "states")
  if (!country) {
    throw new Error("Country not found")
  }

  if (!country.states || country.states.length === 0) {
    throw new Error("No states found for this country")
  }

  const state = country.states.find((s) => s.name == stateCode)
  if (!state) {
    throw new Error("State not found")
  }

  return state
}

// Client Functions
// Zod Validation Schema
const formSchema = z.object({
  company_name: z.string().min(2),
  registration_number: z.string().min(1),



  phone: z.string().min(10),
  organization_type: z.string().min(1),
  web_url: z.string().url(),
  tax: z.string().min(3),
  tax_number: z.string().max(30),
  city: z.string().min(1),
  postal_code: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  domain_name: z.string().min(1),
  domain_provider: z.string().min(1),
  ssl_provider: z.string().optional(),

  bank_name: z.string().min(1),
  account_number: z.string().min(1),
  ifsc_code: z.string().min(11).max(11),
 
  account_type: z.string().min(1),
  server_ip: z.string().optional(),
  cpanel_username: z.string().optional(),
  server_location: z.string().optional(),
})

function validatecompanyData(data) {
  return formSchema.parse(data)
}

// async function createcompany(companyData) {
//   try {
//     console.log("Company data received:", companyData);
    
//     const newCompany = new Companies(companyData);
//     await newCompany.save();
    
//     console.log("Company created successfully:", newCompany);
//     return newCompany;
//   } catch (error) {
//     console.error("Error creating company:", error);
//     throw error;  // Re-throw to handle in the API route
//   }
// }


// Theme Settings Functions
async function saveThemeSettings(themeData, files) {
  const { sitename, systemFont, sidebarTheme, themeColor, topBarColor, loginTitle, logoType } = themeData

  // Access uploaded files
  const companyLogo = files?.companyLogo ? files.companyLogo[0].filename : null
  const favicon = files?.favicon ? files.favicon[0].filename : null
  const appleIcon = files?.appleIcon ? files.appleIcon[0].filename : null

  // Create new theme settings document
  const newSettings = new ThemeSettings({
    site_name: sitename,
    system_font: systemFont,
    sidebar_theme: sidebarTheme,
    theme_color: themeColor,
    topBar_color: topBarColor,
    login_title: loginTitle,
    logo_type: logoType,
    company_logo: companyLogo,
    favicon: favicon,
    appleIcon: appleIcon,
  })

  // Save to database
  await newSettings.save()

  return {
    message: "Theme settings saved successfully!",
    data: newSettings,
  }
}

// const createbranch= async (branchData) => {

//   if (!branchData.company_id) {
//       throw new Error('company_id is required');
//   }
  
//   const branch = new Branches(branchData);
//   return await branch.save();
// };




async function generateCompanyId   () {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const datePrefix = `C${day}${month}${year}-`;

    const lastCompany = await Companies.findOne(
        { company_id: new RegExp(`^${datePrefix}`) },
        {},
        { sort: { createdAt: -1 } }
    );

    let sequence = 1;
    if (lastCompany) {
        const lastSequence = parseInt(lastCompany.company_id.split("-")[1], 10);
        sequence = lastSequence + 1;
    }

    return `${datePrefix}${String(sequence).padStart(3, "0")}`;
};




async  function createcompany (companyData) {
  try {
    const { branches, ...companyDetails } = companyData

    // ✅ Generate unique company_id
    const company_id = await generateCompanyId()

    // ✅ Create the company first (without branches)
    const newCompany = new Companies({
      company_id,
      ...companyDetails,
      branches: [], // Store branch objects later
    })

    const savedCompany = await newCompany.save()

    console.log("✅ Company saved:", savedCompany)

    // ✅ Create and save branches, storing properly formatted objects in the company
    const branchObjects = []

    for (const branch of branches) {
      const branch_id = await Branches.generateBranchId() // Generate unique branch_id

      const newBranch = new Branches({
        branch_id,
        branch_name: branch.branch_name,
        branch_contact: branch.branch_contact,
        branch_link: branch.branch_link,
        company_id: savedCompany._id,
      })

      const savedBranch = await newBranch.save()

      // ✅ Create branch object according to schema structure
      branchObjects.push({
        branch_id: savedBranch._id, // Store the ObjectId reference
        branch_name: savedBranch.branch_name, // Store the branch name
      })
    }

    // ✅ Update company with properly formatted branch objects
    savedCompany.branches = branchObjects
    await savedCompany.save()

    return savedCompany
  } catch (error) {
    throw new Error(`Failed to create company: ${error.message}`)
  }
}

async function getAllcompanys(page = 1, limit = 10, searchQuery = "") {
  page = Number.parseInt(page)
  limit = Number.parseInt(limit)
  const query = searchQuery ? { roleName: { $regex: searchQuery, $options: "i" } } : {}
  const totalRoles = await Companies.countDocuments(query)
  const totalPages = Math.ceil(totalRoles / limit)

  const company = await Companies
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  return { company, totalPages }
}

async function getcompanyById(id) {
  const company = await Companies.findById(id)
  if (!company) {
    throw new Error("company not found")
  }
  return company
}

async function updatecompany(id, companyData) {
  console.log("Updating company with ID:", id);

  const { branches, ...companyFields } = companyData;

  // Step 1: Update the company document first (without branches)
  const updatedCompany = await Companies.findByIdAndUpdate(id, companyFields, { new: true });
  if (!updatedCompany) {
    throw new Error("company not found");
  }

  // Step 2: Process branches in branch_details collection
  let embeddedBranches = [];

  if (Array.isArray(branches)) {
    for (const branch of branches) {
      const { branch_id, branch_name, ...branchData } = branch;

      if (branch_id && mongoose.Types.ObjectId.isValid(branch_id)) {
        // Update existing branch
        const updated = await Branches.findByIdAndUpdate(branch_id, {
          branch_name,
          ...branchData
        }, { new: true });

        if (updated) {
          embeddedBranches.push({
            branch_id: updated._id,
            branch_name: updated.branch_name
          });
        }
      } else {
        // Create new branch
        const newBranch = await Branches.create({
          branch_name,
          ...branchData,
          company_id: id
        });

        embeddedBranches.push({
          branch_id: newBranch._id,
          branch_name: newBranch.branch_name
        });
      }
    }
  }

  // Step 3: Update embedded branches in Companies collection
  const finalCompany = await Companies.findByIdAndUpdate(id, {
    $set: { branches: embeddedBranches }
  }, { new: true });

  return finalCompany;
}



async function deletecompany(id) {
  const deletedcompany = await Companies.findByIdAndDelete(id)
  if (!deletedcompany) {
    throw new Error("company not found")
  }
  return { message: "company deleted successfully" }
}



// module.exports = { createCompanyWithBranchesService };

// module.exports = { createCompanyWithBranchesService };

module.exports = {



  // System Settings
  getAllSettings,
  getSettingsById,
  createSettings,
  updateSettings,
  deleteSettings,
  // Email Templates
  getAllEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,

  // Profile Settings
  updateProfile,
  changePassword,
  updateAvatar,

  // Role Settings
  createRole,
  getRoles,
  updateRole,
  checkRoleExists,
  deleteRole,

  // Social Media Settings
  getSocialMediaSettings,
  updateSocialMediaSettings,

  // System Settings

  // Country Functions
  getAllCountries,
  getCountryByIso2,
  getStatesByCountry,
  getCitiesByState,

  // company Functions
  validatecompanyData,
  createcompany,
  getAllcompanys,
  getcompanyById,
  updatecompany,
  deletecompany,

  // Theme Settings
  saveThemeSettings,
}


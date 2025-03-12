const express = require("express");
const Company = require("../../models/SettingModels/CompanySettingsModels");

const router = express.Router();

// 🔹 Create or Update Company Details (Upsert)
router.post("/", async (req, res) => {
  try {
    console.log("Incoming Request Data:", req.body);

    const { username, ...companyData } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // 🔹 Fetch existing company data
    const existingCompany = await Company.findOne({ username });

    if (!existingCompany) {
      // 🔹 Create new company if not found
      const newCompany = await Company.create({ username, ...companyData });
      return res.status(201).json({
        message: "Company details saved successfully",
        company: newCompany,
        changes: companyData, // All data is considered as 'new'
      });
    }

    // 🔹 Compare old and new data to track updates
    const changes = {};
    Object.keys(companyData).forEach((key) => {
      if (existingCompany[key] !== companyData[key]) {
        changes[key] = { old: existingCompany[key], new: companyData[key] };
      }
    });

    // 🔹 Update company details
    const updatedCompany = await Company.findOneAndUpdate(
      { username },
      { ...companyData, username },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: "Company details saved successfully",
      company: updatedCompany,
      changes: Object.keys(changes).length > 0 ? changes : null, // If no changes, return null
    });

  } catch (error) {
    console.error("Error in updating company:", error);
    res.status(500).json({ message: "Error saving company details", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    console.log("Incoming GET request:", req.query);

    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const company = await Company.findOne({ username });

    if (!company) {
      return res.status(200).json({}); // Instead of returning 404, return an empty object
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company details:", error);
    res.status(500).json({ message: "Error fetching company details", error: error.message });
  }
});


module.exports = router;

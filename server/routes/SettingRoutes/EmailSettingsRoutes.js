const express = require("express");
const router = express.Router();
const EmailTemplate = require("../../models/SettingModels/EmailSettingsModel");


// Get all email templates
router.get("/email-templates", async (req, res) => {
  try {
    const templates = await EmailTemplate.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get a single email template by ID
router.get("/email-templates/:id", async (req, res) => {
  try {
    const template = await EmailTemplate.findOne({ id: req.params.id });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create a new email template
router.post("/email-templates", async (req, res) => {
  try {
    const { id, name, subject, content, variables } = req.body;

    // Check if a template with the same ID already exists
    const existingTemplate = await EmailTemplate.findOne({ id });
    if (existingTemplate) {
      return res.status(400).json({ message: "Template with this ID already exists" });
    }

    const newTemplate = new EmailTemplate({
      id,
      name,
      subject,
      content,
      variables,
    });

    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update an email template
router.put("/email-templates/:id", async (req, res) => {
  try {
    const updatedTemplate = await EmailTemplate.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

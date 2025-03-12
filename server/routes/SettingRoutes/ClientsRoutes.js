const express = require("express");
const { z } = require("zod");
const clients = require("../../models/SettingModels/ClientModels");

const router = express.Router();

// Zod Validation Schema
const formSchema = z.object({
  company_name: z.string().min(2),
  registration_number: z.string().min(1),
  name: z.string().min(2),
  position: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
 
  organization_type: z.string().min(1),
  web_url: z.string().url(),
  tax:z.string().min(3),
 tax_number: z.string().max(30),

  city: z.string().min(1),
  postal_code: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  domain_name: z.string().min(1),
  domain_provider: z.string().min(1),
  ssl_provider: z.string().optional(),
  ssl_expiry_date: z.string().optional(),
  bank_name: z.string().min(1),
  account_number: z.string().min(1),
  ifsc_code: z.string().min(11).max(11),
  branch_name: z.string().min(1),
  account_type: z.string().min(1),
  server_ip: z.string().optional(),
  cpanel_username: z.string().optional(),
  server_location: z.string().optional(),
});

// Middleware for validation
const validateRequest = (req, res, next) => {
  try {
    formSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};

// **Create (POST)**
router.post("/", validateRequest, async (req, res) => {
  try {
    console.log("received data",req.body)
    const newClient = new clients(req.body);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **Read All (GET)**
router.get("/", async (req, res) => {

  try{
  let { page = 1, limit = 10, searchQuery = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const query = searchQuery ? { roleName: { $regex: searchQuery, $options: "i" } } : {};
  const totalRoles = await clients.countDocuments(query);
  const totalPages = Math.ceil(totalRoles / limit);

  const client = await clients.find(query)
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

  res.status(200).json({ client, totalPages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// **Read One (GET by ID)**
router.get("/:id", async (req, res) => {
  try {
    const client = await clients.findById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **Update (PUT)**
router.put("/:id", validateRequest, async (req, res) => {
  try {
    const updatedClient = await clients.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClient) return res.status(404).json({ error: "Client not found" });
    res.json(updatedClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **Delete (DELETE)**
router.delete("/:id", async (req, res) => {
  try {
    const deletedClient = await clients.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json({ error: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

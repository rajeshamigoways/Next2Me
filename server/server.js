const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(express.json());

// **MongoDB Connection**
mongoose.connect("mongodb://localhost:27017/adminuser", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.error("MongoDB connection error:", err));

// **Import Routes**
const userRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const companysettings=require("./routes/SettingRoutes/CompanySettingsRoutes");
const emailsettings=require("./routes/SettingRoutes/EmailSettingsRoutes");
const profilesettings=require("./routes/SettingRoutes/ProfileSettingsRoutes");
const socialmediasettings=require("./routes/SettingRoutes/SocialMediaLinksRoutes");
const rolesettings=require("./routes/SettingRoutes/RolesSettingRoutes");
const systemsettings=require("./routes/SettingRoutes/SystemSettingsRoutes");
const countries = require("./routes/SettingRoutes/CountrySettingsRoutes")
const clients = require("./routes/SettingRoutes/ClientsRoutes")
const themesettings = require("./routes/SettingRoutes/ThemeSettingsRoutes")
const path = require("path");

// **Use Routes**
app.use("/user", userRoutes);
app.use("/email", emailRoutes);
app.use("/companysettings",companysettings)
app.use("/emailsettings",emailsettings)
app.use("/profilesettings",profilesettings)
app.use("/rolesettings",rolesettings)
app.use("/socialmediasettings",socialmediasettings );
app.use("/systemsettings",systemsettings );
app.use("/api",countries);
app.use("/clients",clients);
app.use("/themesettings",themesettings);
// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// **Start Server**
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


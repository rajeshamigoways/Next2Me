const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  accessModules: [
    {
      moduleName: { type: String, required: true },
      permissions: {
        add: { type: Number, default: 0 },
        edit: { type: Number, default: 0 },
        delete: { type: Number, default: 0 },
        view: { type: Number, default: 0 },
      },
    },
  ],
}, { timestamps: true });

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;

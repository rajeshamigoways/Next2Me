const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    branch_id: { type: String, required: true, unique: true }, // Unique string identifier
    branch_name: { type: String, required: true },
    branch_contact: { type: String, required: true },
    branch_link: { type: String },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Companies",
      required: true,
    },
  },
  { timestamps: true }
);

// Static method to generate a unique branch_id
BranchSchema.statics.generateBranchId = async function () {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const datePrefix = `B${day}${month}${year}-`;

  // Find the last branch created on the same day
  const lastBranch = await this.findOne(
    { branch_id: new RegExp(`^${datePrefix}`) },
    {},
    { sort: { createdAt: -1 } }
  );

  let sequence = 1;
  if (lastBranch) {
    const lastSequence = parseInt(lastBranch.branch_id.split("-")[1], 10);
    sequence = lastSequence + 1;
  }

  return `${datePrefix}${String(sequence).padStart(3, "0")}`;
};

module.exports = mongoose.model("branch_details", BranchSchema);

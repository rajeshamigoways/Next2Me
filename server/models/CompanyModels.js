const mongoose = require("mongoose");
const moment = require("moment");

const companysSchema = new mongoose.Schema(
  {
    company_id: { type: String, unique: true }, // Unique company ID
    company_name: { type: String, required: true },
    registration_number: { type: String, required: true },
    // name: { type: String, required: true },
    address:{type:String, required:true},
    mobile:{type:String,required:true},
    fax:{type:String,required:true},
    // email: { type: String, required: true },
    phone: { type: String, required: true },
    organization_type: { type: String, required: true },
    web_url: { type: String, required: true },
    tax: { type: String, required: true },
    tax_number: { type: String, required: true, maxlength: 30 },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    domain_name: { type: String, required: true },
    domain_provider: { type: String, required: true },
    ssl_provider: { type: String, default: "" },

    bank_name: { type: String, required: true },
    account_number: { type: String, required: true },
    ifsc_code: { type: String, required: false, minlength: 11, maxlength: 11 },
    branches: [
      {
          _id: false, // Prevents automatic `_id` field inside array elements
          branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'branch_details' , required: true},
          branch_name: { type: String, required:true }
      }
    ],
    account_type: { type: String, required: true },
    server_ip: { type: String, default: "" },
    cpanel_username: { type: String, default: "" },
    server_location: { type: String, default: "" },
  },
  { timestamps: true }
);

// companysSchema.pre("save", async function (next) {
//   if (this.company_id) return next(); // Skip if already assigned

//   const now = new Date();

//   // Get the last two digits of the year
//   const year = now.getFullYear().toString().slice(-2);  // "25" for 2025

//   // Get day and month WITHOUT leading zero
//   const day = now.getDate();  // 24 (not "24")
//   const month = now.getMonth() + 1;  // 2 (not "02")

//   // Create the prefix "C24225"
//   const datePrefix = `C${day}${month}${year}-`;  // Example: "C24225-"

//   // Find the last company with today's prefix
//   const lastcompany = await mongoose.model("Companies").findOne(
//     { company_id: new RegExp(`^${datePrefix}`) },
//     {},
//     { sort: { createdAt: -1 } }
//   );

//   let sequence = 1;
//   if (lastcompany) {
//     const lastSequence = parseInt(lastcompany.company_id.split("-")[1], 10);
//     sequence = lastSequence + 1;
//   }

//   // Create the final company_id
//   this.company_id = `${datePrefix}${String(sequence).padStart(3, "0")}`;  // "C24225-001"
//   next();
// });


const companys = mongoose.model("Companies", companysSchema);
module.exports = companys;

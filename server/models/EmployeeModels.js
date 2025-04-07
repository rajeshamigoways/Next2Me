const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address_head_office: { type: String, required: true },
    city: { type: String, required: true },
    state_province: { type: String, required: true },
    postal_zip_code: { type: String, required: true },
    start_date: { type: Date, required: true },
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'companies'  // References _id in the companies collection
    },
    branch: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'branch_details'  // References _id in the branch_details collection
    }
}, { timestamps: true });

module.exports = mongoose.model('employees', EmployeeSchema);

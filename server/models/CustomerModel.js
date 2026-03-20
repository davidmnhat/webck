const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: Number, default: 0 },
  lockaccount: { type: Number, default: 0 },
  
  // --- QUAN TRỌNG NHẤT: PHẢI CÓ DÒNG NÀY ---
  address: { type: String, default: '' },
  // ------------------------------------------
  
  cdate: { type: Date, default: Date.now }
});

const CustomerModel = mongoose.model('customer', CustomerSchema);
module.exports = CustomerModel;
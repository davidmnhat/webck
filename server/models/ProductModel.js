const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  // --- MỚI THÊM ---
  description: { type: String },  // Mô tả chi tiết
  color: { type: String },        // Màu sắc (Ví dụ: Midnight, Gold)
  memory: { type: String },       // Bộ nhớ (Ví dụ: 8GB/256GB)
  // ----------------
  cdate: { type: Date, default: Date.now },
  address: { type: String, default: '' }
});

const ProductModel = mongoose.model('product', ProductSchema);
module.exports = ProductModel;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  cdate: { type: Number, default: Date.now },
  total: { type: Number, required: true },
  status: { type: String, default: 'PENDING' },
  customer: { type: Schema.Types.ObjectId, ref: 'customer' },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'product' },
    quantity: { type: Number }
  }],
  
  // --- THÊM 3 DÒNG NÀY ĐỂ LƯU THÔNG TIN SHIP HÀNG ---
  phone: { type: String },
  address: { type: String },
  paymentMethod: { type: String, default: 'COD' } // Mặc định là thanh toán khi nhận hàng
  // --------------------------------------------------
});

const OrderModel = mongoose.model('order', OrderSchema);
module.exports = OrderModel;
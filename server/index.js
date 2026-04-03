// CLI: npm install express body-parser --save
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// --- THÊM ĐOẠN NÀY ---
const cors = require('cors');
app.use(cors());
// ---------------------

// Middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// APIs
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Server!' });
});
app.use('/api/admin', require('./api/admin')); 
app.use('/api/categories', require('./api/category'));
app.use('/api/products', require('./api/product'));
app.use('/api/customer', require('./api/customer'));
app.use('/api/order', require('./api/order'));
app.use('/api/payment', require('./api/payment'));
app.use('/api/chat', require('./api/chat'));
// My Utilities
const db = require('./utils/MongooseUtil');

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


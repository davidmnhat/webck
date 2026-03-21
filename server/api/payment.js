const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel'); // ✅ FIX: trỏ đúng vào model

const receivedTransactions = new Map();

router.post('/casso-webhook', async (req, res) => {
  console.log('=== CASSO WEBHOOK ===', JSON.stringify(req.body, null, 2)); // ✅ log để debug
  try {
    // Tạm comment token check khi test, sau deploy thật thì bật lại
    // const token = req.headers['secure-token'];
    // if (token !== process.env.CASSO_SECURE_TOKEN) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    const { data } = req.body;
    if (!data || !Array.isArray(data)) return res.json({ success: true });

    for (const transaction of data) {
      const { description, amount, when } = transaction;
      const match = description?.toUpperCase().match(/DH\w+/);
      if (!match) continue;

      const orderCode = match[0];
      receivedTransactions.set(orderCode, { amount, when, description });

      await Order.findOneAndUpdate(
        { code: orderCode },
        { paymentStatus: 'PAID', paidAt: new Date(when) }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Casso webhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/check-payment/:orderCode', async (req, res) => {
  try {
    const { orderCode } = req.params;

    if (receivedTransactions.has(orderCode)) {
      const tx = receivedTransactions.get(orderCode);
      receivedTransactions.delete(orderCode);
      return res.json({ paid: true, transaction: tx });
    }

    const order = await Order.findOne({ code: orderCode });
    if (order?.paymentStatus === 'PAID') {
      return res.json({ paid: true });
    }

    res.json({ paid: false });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const connection = require('./database');

// Get statistics for the selected month
router.get('/:month', (req, res) => {
  const month = req.params.month;
  const query = `
    SELECT
      SUM(price * quantity) total_sale_amount,
      SUM(quantity) total_quantity,
      SUM(CASE WHEN quantity = 0 THEN 1 ELSE 0 END) not_sold_items,
      category
    FROM product_transaction
    WHERE MONTH(transaction_date) = ?
    GROUP BY category
  `;

  connection.query(query, [month], (err, results) => {
    if
const express = require('express');
const router = express.Router();
const connection = require('./database');

// Get all transactions with search and pagination
router.get('/', (req, res) => {
  const { search, page, limit } = req.query;
  const query = `
    SELECT *
    FROM product_transaction
    WHERE MONTH(transaction_date) = ?
    ${search ? `AND (product_id = ? OR category LIKE ?)` : ' '}
    ORDER BY transaction_date DESC
    LIMIT ?, ?
  `;
  const searchValues = [search, search, `%${search}%`];
  const defaultValues = [req.query.month, 0, 10];
  const finalValues = search ? [...searchValues, ...defaultValues] : defaultValues;

  connection.query(query, finalValues, (err, results) => {
    if (err) throw err;
    res.status(200).json({ data: results });
  });
});

module.exports = router;
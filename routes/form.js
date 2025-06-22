const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

router.get('/', (req, res) => {
  res.render('form', { title: 'Poradce Jakub Mácha' });
});

router.post('/', async (req, res) => {
  const { jmeno, prijmeni, telefon } = req.body;
  const newLead = new Lead({ jmeno, prijmeni, telefon });
  await newLead.save();
  res.render('dekujeme', { jmeno });
});

module.exports = router;
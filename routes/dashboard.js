const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { requireAuth } = require('../middleware/auth');

// Zobrazení dashboardu
router.get('/', requireAuth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.render('dashboard', { 
      title: 'Dashboard',
      leads,
      user: req.session.user
    });
  } catch (error) {
    console.error('Chyba při načítání leadů:', error);
    res.status(500).render('error', { 
      message: 'Chyba při načítání dat' 
    });
  }
});

// Změna stavu leadu
router.post('/update-status/:id', requireAuth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lead nebyl nalezen' 
      });
    }

    if (lead.status === 'new' || lead.status === 'disagreed') {
      lead.status = 'agreed';
    } else if (lead.status === 'agreed') {
      lead.status = 'disagreed';
    }
    
    await lead.save();

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Chyba při změně stavu:', error);
    res.status(500).render('error', { 
      message: 'Chyba při změně stavu' 
    });
  }
});

// Smazání leadu
router.post('/delete/:id', requireAuth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Chyba při mazání leadu:', error);
    res.status(500).render('error', { 
      message: 'Chyba při mazání leadu' 
    });
  }
});

// Odhlášení uživatele
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Chyba při odhlašování:', err);
      return res.status(500).render('error', { 
        message: 'Chyba při odhlašování' 
      });
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
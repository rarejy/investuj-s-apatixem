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

// Změna stavu leadu - OPRAVENO
router.post('/update-status/:id', requireAuth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lead nebyl nalezen' 
      });
    }

    // Opravená logika pro změnu statusu
    if (lead.status === 'new' || lead.status === 'disagreed') {
      lead.status = 'agreed';
    } else if (lead.status === 'agreed') {
      lead.status = 'disagreed';
    }
    
    await lead.save();

    // Přesměrování místo JSON response pro formulář
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Chyba při změně stavu:', error);
    res.status(500).render('error', { 
      message: 'Chyba při změně stavu' 
    });
  }
});

// Smazání leadu - OPRAVENO
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

// Přidání poznámky
router.post('/add-note/:id', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Text poznámky je povinný' 
      });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: { 
        text: text.trim(),
        createdAt: new Date(),
        createdBy: req.session.user.username 
      }}},
      { new: true }
    );

    res.json({ 
      success: true, 
      notes: updatedLead.notes 
    });
  } catch (error) {
    console.error('Chyba při přidávání poznámky:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Chyba serveru' 
    });
  }
});

// Aktualizace poznámky
router.put('/update-note/:leadId/:noteIndex', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false });
    }

    const lead = await Lead.findById(req.params.leadId);
    if (!lead || !lead.notes[req.params.noteIndex]) {
      return res.status(404).json({ success: false });
    }
    
    lead.notes[req.params.noteIndex].text = text.trim();
    lead.notes[req.params.noteIndex].updatedAt = new Date();
    await lead.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Chyba při aktualizaci poznámky:', error);
    res.status(500).json({ success: false });
  }
});

// Smazání poznámky - OPRAVENO metoda
router.post('/delete-note/:leadId/:noteIndex', requireAuth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead || !lead.notes[req.params.noteIndex]) {
      return res.status(404).json({ success: false });
    }
    
    lead.notes.splice(req.params.noteIndex, 1);
    await lead.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Chyba při mazání poznámky:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
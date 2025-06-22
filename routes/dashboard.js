const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Dashboard route
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.render('dashboard', { 
      title: 'Dashboard',
      leads,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Nastala chyba při načítání dashboardu');
    res.redirect('/auth/login');
  }
});

// Update status route
router.post('/update-status/:id', async (req, res) => {
  try {
    const { status, customDate } = req.body;
    const updateData = { status };
    
    if (customDate) {
      updateData.posledniVolani = new Date(customDate);
    }
    
    await Lead.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Status byl úspěšně aktualizován');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Nastala chyba při aktualizaci statusu');
    res.redirect('/dashboard');
  }
});

// Add note route
router.post('/add-note/:id', async (req, res) => {
  try {
    const { note, noteDate } = req.body;
    const newNote = {
      text: note,
      datum: noteDate ? new Date(noteDate) : new Date()
    };

    await Lead.findByIdAndUpdate(
      req.params.id,
      { $push: { poznamky: newNote } }
    );

    req.flash('success', 'Poznámka byla úspěšně přidána');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Nastala chyba při přidávání poznámky');
    res.redirect('/dashboard');
  }
});

// Update note route
router.post('/update-note/:leadId/:noteId', async (req, res) => {
  try {
    const { leadId, noteId } = req.params;
    const { editedNote } = req.body;

    await Lead.findOneAndUpdate(
      { _id: leadId, 'poznamky._id': noteId },
      { $set: { 'poznamky.$.text': editedNote } }
    );

    req.flash('success', 'Poznámka byla úspěšně upravena');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Nastala chyba při úpravě poznámky');
    res.redirect('/dashboard');
  }
});

// Delete note route
router.post('/delete-note/:leadId/:noteId', async (req, res) => {
  try {
    const { leadId, noteId } = req.params;
    
    await Lead.findByIdAndUpdate(
      leadId,
      { $pull: { poznamky: { _id: noteId } } }
    );

    req.flash('success', 'Poznámka byla úspěšně smazána');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Nastala chyba při mazání poznámky');
    res.redirect('/dashboard');
  }
});

module.exports = router;

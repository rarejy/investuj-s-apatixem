// routes/auth.js
const express = require('express');
const router = express.Router();

// Zde nastav svůj PIN
const ADMIN_PIN = '950909'; // Změň na svůj PIN

// Login stránka
router.get('/login', (req, res) => {
  console.log('GET /auth/login - Session:', req.session);
  if (req.session.authenticated) {
    console.log('User already authenticated, redirecting to dashboard');
    return res.redirect('/dashboard');
  }
  console.log('Rendering login page');
  res.render('login', { error: null });
});

// Login POST
router.post('/login', (req, res) => {
  console.log('POST /auth/login received');
  console.log('Request body:', req.body);
  console.log('Session before:', req.session);
  
  const { pin } = req.body;
  console.log('Received PIN:', pin);
  console.log('Expected PIN:', ADMIN_PIN);
  console.log('PIN match:', pin === ADMIN_PIN);
  
  if (pin === ADMIN_PIN) {
    req.session.authenticated = true;
    console.log('PIN correct, setting session authenticated');
    console.log('Session after:', req.session);
    
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.render('login', { error: 'Chyba při ukládání session!' });
      }
      console.log('Session saved, redirecting to dashboard');
      return res.redirect('/dashboard');
    });
  } else {
    console.log('PIN incorrect');
    return res.render('login', { error: 'Nesprávný PIN!' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  console.log('Logout requested');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    console.log('Session destroyed, redirecting to login');
    res.redirect('/auth/login');
  });
});

module.exports = router;
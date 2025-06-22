const express = require('express');
const router = express.Router();
const passport = require('passport');

// Přihlašovací formulář
router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Přihlášení',
    error: req.flash('error')[0],
    success: req.flash('success')[0]
  });
});

// Zpracování přihlášení
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

// Odhlášení (s callbackem!)
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Chyba při odhlašování:', err);
      return res.redirect('/dashboard');
    }
    req.flash('success', 'Úspěšně odhlášeno');
    res.redirect('/auth/login');
  });
});

module.exports = router;
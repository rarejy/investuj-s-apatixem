const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const formRouter = require('./routes/form');
const dashboardRouter = require('./routes/dashboard');
const authRouter = require('./routes/auth');

const app = express();

// Připojení k databázi
mongoose.connect('mongodb://mongo:mfutLkgTpuBkWFDQDPKSNMmAwrXgCQkp@mainline.proxy.rlwy.net:37537', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Připojeno k MongoDB'))
.catch(err => console.error('Chyba připojení k MongoDB:', err));

// Session middleware
app.use(session({
  secret: 'B7#zvP9qK!0LfdX$sn@eM6WaR3tUjg82', // Změňte na silný klíč
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // V produkci nastavte na true (pouze s HTTPS)
    maxAge: 30 * 60 * 1000 // 30 minut
  }
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// View engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Helper funkce pro formátování stavu
app.locals.formatStatus = (status) => {
  const statusMap = {
    'new': 'Nový',
    'agreed': 'Domluvený',
    'disagreed': 'Nedomluvený'
  };
  return statusMap[status] || status;
};

// Routy
app.use('/', formRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Nastala chyba na serveru' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});
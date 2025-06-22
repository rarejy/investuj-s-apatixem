const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    // Připojení s lepším timeoutem a kontrolou
    await mongoose.connect('mongodb://localhost/investuj-apatix', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Zkrácený timeout na 5s
    });
    
    console.log('✅ Úspěšně připojeno k MongoDB');

    // Kontrola existence uživatele
    const existingUser = await User.findOne({ username: 'admin' });
    if (existingUser) {
      console.log('❌ Uživatel "admin" již existuje');
      return;
    }

    // Vytvoření admina
    const admin = new User({
      username: 'admin',
      password: 'admin' // Nahraď vlastním heslem!
    });
    
    await admin.save();
    console.log('✅ Admin uživatel vytvořen!');
  } catch (err) {
    console.error('❌ Chyba:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
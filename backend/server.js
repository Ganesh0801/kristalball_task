const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const runServer = async () => {
  await connectDB();
  
  const Base = require('./models/Base');
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  if ((await Base.countDocuments()) === 0) {
    
    const alpha = await Base.create({ name: 'Fort Alpha', location: 'Sector 1 Strategic Region' });
    const bravo = await Base.create({ name: 'Outpost Bravo', location: 'Sector 5 Forward Line' });
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash('password123', salt);
    
    await User.create({ username: 'admin', password: hashPassword, role: 'Admin' });
    await User.create({ username: 'commander', password: hashPassword, role: 'Base Commander', baseId: alpha._id });
    await User.create({ username: 'logistics', password: hashPassword, role: 'Logistics Officer' });
    
  }

  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/assets', require('./routes/assetRoutes'));
  app.use('/api/transactions', require('./routes/transactionRoutes'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`STRATCOM server infrastructure operational on port ${PORT}`));
};

runServer();
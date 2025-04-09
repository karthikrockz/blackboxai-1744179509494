require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Route files
const auth = require('./routes/auth');
const elections = require('./routes/elections');
const candidates = require('./routes/candidates');
const votes = require('./routes/votes');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/elections', elections);
app.use('/api/v1/candidates', candidates);
app.use('/api/v1/elections', votes);

// Base route
app.get('/', (req, res) => {
  res.send('College Voting System API');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

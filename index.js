const app = require('./app');
const config = require('./utils/config');
const mongoose = require('mongoose');
const supertest = require('supertest');
const api = supertest(app)

mongoose.connect(config.MONGODB_URI);

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  }).on('error', (error) => {
    console.error('Error starting the server:', error.message);
  });
  
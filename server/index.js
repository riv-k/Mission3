// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const authMiddleware = require('./middleware/auth');
const interviewRoutes = require('./routes/interviewRoute');

// Middleware to parse JSON
app.use(express.json());

// [UNPROTECTED] Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Use authentication middleware
app.use(authMiddleware);

// [PROTECTED] Interview routes
app.use('/interview', interviewRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

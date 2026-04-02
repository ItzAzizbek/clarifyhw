require('dotenv').config();

const express = require('express');
const cors = require('cors');
const explainRouter = require('./routes/explain');

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());

app.use('/api/explain', explainRouter);

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    message: 'Something went wrong while processing the request.',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
